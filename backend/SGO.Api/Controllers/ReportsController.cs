using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Linq;
using System.Threading.Tasks;
using OfficeOpenXml;
using System.IO;
using System.Collections.Generic;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

            // Corrected and robust check for ProjectIds
            if (filters.ProjectIds != null && filters.ProjectIds.Any())
            {
                query = query.Where(e => filters.ProjectIds.Contains(e.ProjectId));
            }

            return query;
        }

        // GET: api/reports/expenses
        [HttpGet("expenses")]
        public async Task<ActionResult> GetExpensesReport([FromQuery] ExpenseReportFilterDto filters)
        {
            var query = GetFilteredExpensesQuery(filters);

            var result = await query
                .Include(e => e.Project)
                .Include(e => e.CostCenter)
                .Select(e => new 
                {
                    e.Date,
                    ProjectName = e.Project.Name,
                    CostCenterName = e.CostCenter.Name,
                    e.Description,
                    e.Amount,
                    AttachmentPath = !string.IsNullOrEmpty(e.AttachmentPath)
                        ? $"http://localhost:5145{e.AttachmentPath}"
                        : null
                })
                .OrderBy(e => e.Date)
                .ToListAsync();

            return Ok(result);
        }

        // GET: api/reports/expenses/export
        [HttpGet("expenses/export")]
        [Obsolete]
        public async Task<IActionResult> ExportExpensesReport([FromQuery] ExpenseReportFilterDto filters)
        {
            var query = GetFilteredExpensesQuery(filters);

            var expenses = await query
                .Include(e => e.Project)
                .Include(e => e.CostCenter)
                .OrderBy(e => e.Date)
                .Select(e => new ExpenseReportItemDto 
                {
                    Data = e.Date.ToString("dd/MM/yyyy"),
                    Obra = e.Project.Name,
                    CentroDeCusto = e.CostCenter.Name,
                    Descricao = e.Description,
                    Valor = e.Amount,
                    Anexo = !string.IsNullOrEmpty(e.AttachmentPath) ? $"http://localhost:5145{e.AttachmentPath}" : ""
                })
                .ToListAsync();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Relatorio de Despesas");
                worksheet.Cells.LoadFromCollection(expenses, true);
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                // Create hyperlink
                for(int i = 2; i <= expenses.Count + 1; i++)
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