using System.Text.Json;
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

        // GET: api/projectexpenses/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectExpense>> GetExpenseById(Guid id)
        {
            var expense = await _context.ProjectExpenses
                                        .Include(e => e.CostCenter)
                                        .FirstOrDefaultAsync(e => e.Id == id);
            if (expense == null)
            {
                return NotFound();
            }
            return Ok(expense);
        }

        // POST: api/projectexpenses
        [HttpPost]
        public async Task<ActionResult<ProjectExpense>> CreateExpense([FromBody] CreateExpenseDto expenseDto)
        {           
            if (expenseDto.ProjectId.HasValue && !expenseDto.ContractId.HasValue)
            {
                return BadRequest(new { message = "Para despesas de obra, é obrigatório selecionar um contrato." });
            }

            if (expenseDto.CostCenterId == Guid.Empty)
            {
                return BadRequest(new { message = "O Centro de Custo é obrigatório." });
            }            

            var newExpense = new ProjectExpense
            {
                Id = Guid.NewGuid(),
                ProjectId = expenseDto.ProjectId,
                ContractId = expenseDto.ContractId,
                Description = expenseDto.Description,
                Amount = expenseDto.Amount,
                Date = expenseDto.Date.ToUniversalTime(),
                CostCenterId = expenseDto.CostCenterId,
                Observations = expenseDto.Observations,
                SupplierName = expenseDto.SupplierName,
                InvoiceNumber = expenseDto.InvoiceNumber,
                AttachmentPath = expenseDto.AttachmentPath,
                IsAutomaticallyCalculated = false, 

                DetailsJson = expenseDto.Details != null && expenseDto.Details.Any()
                    ? JsonSerializer.Serialize(expenseDto.Details)
                    : null
            };

            _context.ProjectExpenses.Add(newExpense);
            await _context.SaveChangesAsync();
           
            await _context.Entry(newExpense).Reference(e => e.CostCenter).LoadAsync();
            if (newExpense.ProjectId.HasValue)
            {
                await _context.Entry(newExpense).Reference(e => e.Project).LoadAsync();
            }

            return Ok(newExpense);
        }

        // PUT: api/projectexpenses/{id}        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(Guid id, [FromBody] UpdateExpenseDto expenseDto)
        {
            if (id != expenseDto.Id)
            {
                return BadRequest();
            }

            var expense = await _context.ProjectExpenses.FindAsync(id);
            if (expense == null)
            {
                return NotFound();
            }

            expense.Description = expenseDto.Description;
            expense.Amount = expenseDto.Amount;
            expense.Date = expenseDto.Date.ToUniversalTime();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (!_context.ProjectExpenses.Any(e => e.Id == id)) { return NotFound(); } else { throw; }
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