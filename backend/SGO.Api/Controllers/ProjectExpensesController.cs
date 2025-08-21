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
                Date = expenseDto.Date.ToUniversalTime(),
                Observations = expenseDto.Observations,
                SupplierName = expenseDto.SupplierName,
                InvoiceNumber = expenseDto.InvoiceNumber,
                AttachmentPath = expenseDto.AttachmentPath, 
                CostCenter = costCenter 
            };
            
            _context.ProjectExpenses.Add(newExpense);
            await _context.SaveChangesAsync();

            return Ok(newExpense); 
        }
        
        // PUT: api/projectexpenses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(Guid id, [FromBody] ProjectExpense updatedExpense)
        {
            if (id != updatedExpense.Id)
            {
                return BadRequest("O ID da despesa na URL não corresponde ao ID no corpo da requisição.");
            }

            _context.Entry(updatedExpense).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ProjectExpenses.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); 
        }

        // DELETE: api/projectexpenses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(Guid id)
        {
            var expense = await _context.ProjectExpenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            _context.ProjectExpenses.Remove(expense);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }
    }
}