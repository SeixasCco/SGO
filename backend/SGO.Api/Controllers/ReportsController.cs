using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System.Text.Json;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly SgoDbContext _context;
        public ReportsController(SgoDbContext context) { _context = context; }

        [HttpGet("expenses")]
        public async Task<ActionResult<ReportResultDto>> GetExpensesReport([FromQuery] ExpenseReportFilterDto filters)
        {
            var query = _context.ProjectExpenses
                                .Include(e => e.CostCenter)
                                .Include(e => e.Project)
                                .AsQueryable();
           
            switch (filters.ReportType?.ToLower())
            {
                case "matriz":
                    if (!filters.CompanyId.HasValue) return BadRequest("O ID da Empresa é obrigatório para este tipo de relatório.");
                    query = query.Where(e => e.CompanyId == filters.CompanyId && e.ProjectId == null);
                    break;

                case "obra":
                    if (!filters.ProjectId.HasValue) return BadRequest("O ID da Obra é obrigatório para este tipo de relatório.");
                    query = query.Where(e => e.ProjectId == filters.ProjectId);
                    break;

                case "consolidado":
                    if (!filters.CompanyId.HasValue) return BadRequest("O ID da Empresa é obrigatório para este tipo de relatório.");
                    query = query.Where(e => e.CompanyId == filters.CompanyId);
                    break;
                
                case "geral":                   
                    break;

                default:
                    return BadRequest("Tipo de relatório inválido ou não informado.");
            }
          
            if (filters.StartDate.HasValue)
            {
                query = query.Where(e => e.Date.Date >= filters.StartDate.Value.Date);
            }
            if (filters.EndDate.HasValue)
            {
                query = query.Where(e => e.Date.Date <= filters.EndDate.Value.Date);
            }
            if (filters.CostCenterId.HasValue)
            {
                query = query.Where(e => e.CostCenterId == filters.CostCenterId.Value);
            }
            
            var filteredExpenses = await query.OrderBy(e => e.Date).ToListAsync();
            
            var company = await _context.Companies.FindAsync(filters.CompanyId);

            var detailedList = filteredExpenses.Select(e => new ExpenseReportItemDto
            {
                Date = e.Date,
                ProjectName = e.Project?.Name ?? "Despesa da Matriz",
                CostCenterName = e.CostCenter?.Name ?? "N/A",
                MainDescription = e.Description,
                FormattedDetails = FormatExpenseDetails(e),
                Amount = e.Amount,
                AttachmentPath = !string.IsNullOrEmpty(e.AttachmentPath) ? $"/uploads/{Path.GetFileName(e.AttachmentPath)}" : null
            }).ToList();

            var summary = new ReportSummaryDto
            {
                TotalExpenses = detailedList.Sum(item => item.Amount),
                TotalRecords = detailedList.Count,
                AverageExpense = detailedList.Any() ? detailedList.Average(item => item.Amount) : 0,
                ByProject = detailedList
                    .GroupBy(item => item.ProjectName)
                    .ToDictionary(g => g.Key, g => g.Sum(i => i.Amount)),
                ByCostCenter = detailedList
                    .GroupBy(item => item.CostCenterName)
                    .ToDictionary(g => g.Key, g => g.Sum(i => i.Amount))
            };

            var result = new ReportResultDto
            {
                CompanyName = company?.Name ?? "Relatório Geral",
                CompanyCnpj = company?.Cnpj ?? "N/A",
                FilterStartDate = filters.StartDate,
                FilterEndDate = filters.EndDate,
                GeneratedAt = DateTime.UtcNow,
                DetailedExpenses = detailedList,
                Summary = summary
            };

            return Ok(result);
        }
        
        private string FormatExpenseDetails(ProjectExpense expense)
        {
            if (string.IsNullOrEmpty(expense.DetailsJson))
            {
                return expense.Observations ?? string.Empty;
            }

            try
            {
                var details = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(expense.DetailsJson);
                if (details == null) return expense.Observations ?? string.Empty;

                var parts = new List<string>();
              
                if (details.TryGetValue("razaoSocial", out var razao) && razao.ValueKind != JsonValueKind.Null) 
                    parts.Add($"Fornecedor: {razao}");

                if (details.TryGetValue("nrNf", out var nf) && nf.ValueKind != JsonValueKind.Null) 
                    parts.Add($"NF: {nf}");

                if (details.TryGetValue("cnpj", out var cnpj) && cnpj.ValueKind != JsonValueKind.Null) 
                    parts.Add($"CNPJ: {cnpj}");

                if (details.TryGetValue("placaVeiculo", out var placa) && placa.ValueKind != JsonValueKind.Null) 
                    parts.Add($"Veículo Placa: {placa}");

                if (details.TryGetValue("kmVeiculo", out var km) && km.ValueKind != JsonValueKind.Null) 
                    parts.Add($"KM: {km}");
                    
                if (details.TryGetValue("funcionario", out var func) && func.ValueKind != JsonValueKind.Null) 
                    parts.Add($"Funcionário: {func}");

                if (details.TryGetValue("competencia", out var comp) && comp.ValueKind != JsonValueKind.Null) 
                    parts.Add($"Competência: {comp}");

                if (details.TryGetValue("municipioUf", out var mun) && mun.ValueKind != JsonValueKind.Null)
                    parts.Add($"Local: {mun}");

                var formattedString = string.Join(" | ", parts);

                if (!string.IsNullOrEmpty(expense.Observations))
                {
                    formattedString = string.IsNullOrEmpty(formattedString)
                        ? $"Obs: {expense.Observations}"
                        : $"{formattedString} | Obs: {expense.Observations}";
                }

                return formattedString;
            }
            catch (JsonException)
            {
                return !string.IsNullOrEmpty(expense.Observations) 
                    ? $"Obs: {expense.Observations}" 
                    : "Erro ao ler detalhes da despesa.";
            }
        }
    }
}