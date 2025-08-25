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

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly SgoDbContext _context;
        public ReportsController(SgoDbContext context) { _context = context; }

        // Método privado para reutilizar a lógica de filtro
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

        // GET: api/reports/expenses (Endpoint para a tela)
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
                ProjectName = e.Project?.Name?? "Despesa da Matriz",
                CostCenterName = e.CostCenter.Name,
                Description = e.Description,
                Amount = e.Amount,
                AttachmentPath = !string.IsNullOrEmpty(e.AttachmentPath) ? $"http://localhost:5145{e.AttachmentPath}" : null
            }).ToList();

            var total = detailedList.Sum(item => item.Amount);
            var byProjectSummary = detailedList
                .GroupBy(item => item.ProjectName)
                .ToDictionary(g => g.Key, g => g.Sum(i => i.Amount));

            var result = new ReportResultDto
            {
                DetailedExpenses = detailedList,
                Summary = new ReportSummaryDto
                {
                    TotalExpenses = total,
                    TotalRecords = detailedList.Count,
                    AverageExpense = detailedList.Count > 0 ? total / detailedList.Count : 0,
                    ByProject = byProjectSummary
                }
            };

            return Ok(result);
        }

        // GET: api/reports/expenses/export (Endpoint para o Excel)
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
                    Valor = e.Amount,
                    Anexo = !string.IsNullOrEmpty(e.AttachmentPath) ? $"http://localhost:5145{e.AttachmentPath}" : ""
                })
                .ToList();

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Relatorio de Despesas");
                worksheet.Cells.LoadFromCollection(expensesForExport, true);

                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
                worksheet.Column(5).Style.Numberformat.Format = "R$ #,##0.00";

                for (int i = 2; i <= expensesForExport.Count + 1; i++)
                {
                    var linkCell = worksheet.Cells[i, 6];
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