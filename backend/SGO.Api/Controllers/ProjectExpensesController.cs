using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Threading.Tasks;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectExpensesController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public ProjectExpensesController(SgoDbContext context)
        {
            _context = context;
        }

        // POST: api/projectexpenses
        [HttpPost]
        public async Task<ActionResult<ProjectExpense>> CreateExpense([FromBody] CreateExpenseDto expenseDto)        {
            
            var costCenter = await _context.CostCenters
                .FirstOrDefaultAsync(c => c.Name.ToUpper() == expenseDto.CostCenterName.ToUpper());

            if (costCenter == null)
            {
                costCenter = new CostCenter
                {
                    Id = Guid.NewGuid(),
                    Name = expenseDto.CostCenterName                   
                };
                _context.CostCenters.Add(costCenter);
            }
                        
            var newExpense = new ProjectExpense
            {
                Id = Guid.NewGuid(),
                ProjectId = expenseDto.ProjectId,
                ContractId = expenseDto.ContractId,
                Description = expenseDto.Description,
                Amount = expenseDto.Amount,
                Date = expenseDto.Date,
                Observations = expenseDto.Observations,
                SupplierName = expenseDto.SupplierName,
                InvoiceNumber = expenseDto.InvoiceNumber,
                CostCenter = costCenter 
            };
            
            _context.ProjectExpenses.Add(newExpense);
            await _context.SaveChangesAsync();

            return Ok(newExpense); 
        }
    }
}