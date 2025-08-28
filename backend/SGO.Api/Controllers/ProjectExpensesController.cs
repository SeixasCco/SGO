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
                CompanyId = expenseDto.CompanyId,
                Description = expenseDto.Description,
                Amount = expenseDto.Amount,
                Date = expenseDto.Date.ToUniversalTime(),
                CostCenterId = expenseDto.CostCenterId,
                Observations = expenseDto.Observations,
                SupplierName = expenseDto.SupplierName,
                InvoiceNumber = expenseDto.InvoiceNumber,
                AttachmentPath = expenseDto.AttachmentPath,
                IsAutomaticallyCalculated = false,

                DetailsJson = expenseDto.Details != null ? JsonSerializer.Serialize(expenseDto.Details) : null
            };

            _context.ProjectExpenses.Add(newExpense);
            await _context.SaveChangesAsync();

            await _context.Entry(newExpense).Reference(e => e.CostCenter).LoadAsync();

            var responseDto = new ExpenseResponseDto
            {
                Id = newExpense.Id,
                ProjectId = newExpense.ProjectId,
                Description = newExpense.Description,
                Amount = newExpense.Amount,
                Date = newExpense.Date,
                CostCenterId = newExpense.CostCenterId,
                CostCenterName = newExpense.CostCenter.Name,
                DetailsJson = newExpense.DetailsJson,
                IsAutomaticallyCalculated = newExpense.IsAutomaticallyCalculated
            };

            return CreatedAtAction(nameof(GetExpenseById), new { id = newExpense.Id }, responseDto);
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

        [HttpGet("administrative")]
        public async Task<ActionResult<IEnumerable<ExpenseListItemDto>>> GetAdminExpenses([FromQuery] Guid companyId)
        {
            if (companyId == Guid.Empty)
            {
                return BadRequest("O ID da empresa é obrigatório.");
            }

            var expenses = await _context.ProjectExpenses
                .Where(e => e.ProjectId == null && e.CompanyId == companyId) 
                .Include(e => e.CostCenter)
                .OrderByDescending(e => e.Date)
                .Select(e => new ExpenseListItemDto
                {
                    Id = e.Id,
                    Date = e.Date,
                    Description = e.Description,
                    CostCenterName = e.CostCenter.Name,
                    Amount = e.Amount,
                    HasAttachment = !string.IsNullOrEmpty(e.AttachmentPath),
                    AttachmentPath = e.AttachmentPath
                })
                .ToListAsync();

            return Ok(expenses);
        }
    }
}