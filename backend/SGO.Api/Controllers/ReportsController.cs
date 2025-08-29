using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using OfficeOpenXml;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly SgoDbContext _context;
        public ReportsController(SgoDbContext context) { _context = context; }

        private IQueryable<ProjectExpense> GetFilteredExpensesQuery(ExpenseReportFilterDto filters)
        {
            var query = _context.ProjectExpenses.AsQueryable();

            if (filters.StartDate.HasValue)
                query = query.Where(e => e.Date >= filters.StartDate.Value.ToUniversalTime());

            if (filters.EndDate.HasValue)
                query = query.Where(e => e.Date <= filters.EndDate.Value.ToUniversalTime());

            if (filters.ProjectIds != null && filters.ProjectIds.Any())
                query = query.Where(e => e.ProjectId.HasValue && filters.ProjectIds.Contains(e.ProjectId.Value));

            return query;
        }

        private string FormatExpenseDetails(ProjectExpense expense)
        {
            var details = new List<string>();
          
            if (!string.IsNullOrEmpty(expense.DetailsJson))
            {
                try
                {
                    var jsonDetails = JsonSerializer.Deserialize<Dictionary<string, string>>(expense.DetailsJson);
                    if (jsonDetails != null)
                    {                       
                        var costCenterName = expense.CostCenter?.Name?.ToLower() ?? "";

                        if (costCenterName.Contains("diesel") || costCenterName.Contains("combustível"))
                        {
                            if (jsonDetails.ContainsKey("placaVeiculo") && !string.IsNullOrEmpty(jsonDetails["placaVeiculo"]))
                                details.Add($"Veículo Placa: {jsonDetails["placaVeiculo"]}");
                            if (jsonDetails.ContainsKey("kmVeiculo") && !string.IsNullOrEmpty(jsonDetails["kmVeiculo"]))
                                details.Add($"KM: {jsonDetails["kmVeiculo"]}");
                            if (jsonDetails.ContainsKey("funcionario") && !string.IsNullOrEmpty(jsonDetails["funcionario"]))
                                details.Add($"Funcionário: {jsonDetails["funcionario"]}");
                        }
                        else if (costCenterName.Contains("hospedagem"))
                        {
                            if (jsonDetails.ContainsKey("razaoSocial") && !string.IsNullOrEmpty(jsonDetails["razaoSocial"]))
                                details.Add($"Hotel: {jsonDetails["razaoSocial"]}");
                            if (jsonDetails.ContainsKey("municipioUf") && !string.IsNullOrEmpty(jsonDetails["municipioUf"]))
                                details.Add($"Local: {jsonDetails["municipioUf"]}");
                            if (jsonDetails.ContainsKey("cnpj") && !string.IsNullOrEmpty(jsonDetails["cnpj"]))
                                details.Add($"CNPJ: {jsonDetails["cnpj"]}");
                            if (jsonDetails.ContainsKey("nrNf") && !string.IsNullOrEmpty(jsonDetails["nrNf"]))
                                details.Add($"NF: {jsonDetails["nrNf"]}");
                        }
                        else if (costCenterName.Contains("folha"))
                        {
                            if (jsonDetails.ContainsKey("competencia") && !string.IsNullOrEmpty(jsonDetails["competencia"]))
                                details.Add($"Competência: {jsonDetails["competencia"]}");
                            if (jsonDetails.ContainsKey("funcionario") && !string.IsNullOrEmpty(jsonDetails["funcionario"]))
                                details.Add($"Funcionário: {jsonDetails["funcionario"]}");
                        }
                        else
                        {                           
                            foreach (var kvp in jsonDetails)
                            {
                                if (!string.IsNullOrEmpty(kvp.Value))
                                {
                                    var fieldName = kvp.Key switch
                                    {
                                        "razaoSocial" => "Razão Social",
                                        "cnpj" => "CNPJ",
                                        "nrNf" => "NF",
                                        "municipioUf" => "Município/UF",
                                        "placaVeiculo" => "Placa",
                                        "kmVeiculo" => "KM",
                                        "funcionario" => "Funcionário",
                                        "competencia" => "Competência",
                                        _ => kvp.Key
                                    };
                                    details.Add($"{fieldName}: {kvp.Value}");
                                }
                            }
                        }
                    }
                }
                catch (JsonException)
                {
                    
                }
            }
           
            if (!string.IsNullOrEmpty(expense.SupplierName))
                details.Add($"Fornecedor: {expense.SupplierName}");

            if (!string.IsNullOrEmpty(expense.InvoiceNumber))
                details.Add($"Nota Fiscal: {expense.InvoiceNumber}");
           
            if (!string.IsNullOrEmpty(expense.Observations))
                details.Add($"Obs: {expense.Observations}");

            return string.Join(" | ", details);
        }

        // GET: api/reports/expenses
        [HttpGet("expenses")]
        public async Task<ActionResult<ReportResultDto>> GetExpensesReport([FromQuery] ExpenseReportFilterDto filters)
        {
            var query = GetFilteredExpensesQuery(filters);

            var filteredExpenses = await query
                .Include(e => e.Project)
                .Include(e => e.CostCenter)
                .OrderBy(e => e.Date)
                .ToListAsync();

            var detailedList = filteredExpenses.Select(e => new ExpenseReportItemDto
            {
                Date = e.Date,
                ProjectName = e.Project?.Name ?? "Despesa da Matriz",
                CostCenterName = e.CostCenter.Name,
                Description = e.Description,
                MainDescription = e.Description,
                Amount = e.Amount,
                AttachmentPath = !string.IsNullOrEmpty(e.AttachmentPath) ? $"http://localhost:5145{e.AttachmentPath}" : null,
                Observations = e.Observations,
                SupplierName = e.SupplierName,
                InvoiceNumber = e.InvoiceNumber,
                DetailsJson = e.DetailsJson,
                FormattedDetails = FormatExpenseDetails(e)
            }).ToList();

            var total = detailedList.Sum(item => item.Amount);
            var byProjectSummary = detailedList
                .GroupBy(item => item.ProjectName)
                .ToDictionary(g => g.Key, g => g.Sum(i => i.Amount));

            var byCostCenterSummary = detailedList
                .GroupBy(item => item.CostCenterName)
                .ToDictionary(g => g.Key, g => g.Sum(i => i.Amount));
            
            var company = await _context.Companies.FirstOrDefaultAsync();

            var result = new ReportResultDto
            {
                CompanyName = company?.Name ?? "Sistema SGO",
                CompanyCnpj = company?.Cnpj ?? "",
                FilterStartDate = filters.StartDate,
                FilterEndDate = filters.EndDate,
                GeneratedAt = DateTime.UtcNow,
                DetailedExpenses = detailedList,
                Summary = new ReportSummaryDto
                {
                    TotalExpenses = total,
                    TotalRecords = detailedList.Count,
                    AverageExpense = detailedList.Count > 0 ? total / detailedList.Count : 0,
                    ByProject = byProjectSummary,
                    ByCostCenter = byCostCenterSummary
                }
            };

            return Ok(result);
        }

        // GET: api/reports/expenses/export
        [HttpGet("expenses/excel")]
        public async Task<IActionResult> ExportExpensesReport([FromQuery] ExpenseReportFilterDto filters)
        {
            ExcelPackage.License.SetNonCommercialPersonal("Raul Zamban");

            var query = GetFilteredExpensesQuery(filters);

            var expensesFromDb = await query
                .Include(e => e.Project)
                .Include(e => e.CostCenter)
                .OrderBy(e => e.Date)
                .ToListAsync();

            var expensesForExport = expensesFromDb
                 .Select(e => new
                 {
                     Data = e.Date.ToString("dd/MM/yyyy"),
                     Obra = e.Project?.Name ?? "Despesa da Matriz",
                     CentroDeCusto = e.CostCenter.Name,
                     Descricao = e.Description,
                     DetalhesFormatados = FormatExpenseDetails(e),
                     Valor = e.Amount,
                     Anexo = !string.IsNullOrEmpty(e.AttachmentPath) ? $"http://localhost:5145{e.AttachmentPath}" : ""
                 })
                 .ToList();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Relatorio de Despesas");
                worksheet.Cells.LoadFromCollection(expensesForExport, true);

                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                worksheet.Column(6).Style.Numberformat.Format = "R$ #,##0.00"; // Coluna Valor

                for (int i = 2; i <= expensesForExport.Count + 1; i++)
                {
                    var linkCell = worksheet.Cells[i, 7]; // Coluna Anexo
                    if (!string.IsNullOrEmpty(linkCell.Text))
                    {
                        linkCell.Hyperlink = new Uri(linkCell.Text);
                        linkCell.Value = "Ver Anexo";
                        linkCell.Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                        linkCell.Style.Font.UnderLine = true;
                    }
                }

                var stream = new MemoryStream();
                await package.SaveAsAsync(stream);
                stream.Position = 0;
                string excelName = $"RelatorioDespesas-{DateTime.Now:yyyyMMddHHmmss}.xlsx";

                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelName);
            }
        }
    }
}