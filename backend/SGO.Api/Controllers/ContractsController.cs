using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContractsController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public ContractsController(SgoDbContext context)
        {
            _context = context;
        }

        // GET: api/contracts/byproject/{projectId}
        [HttpGet("byproject/{projectId}")]
        public async Task<ActionResult<IEnumerable<Contract>>> GetContractsByProject(Guid projectId)
        {
            return await _context.Contracts
                                 .Where(c => c.ProjectId == projectId)
                                 .ToListAsync();
        }

        // POST: api/contracts
        [HttpPost]
        public async Task<ActionResult<Contract>> CreateContract([FromBody] CreateContractDto contractDto)
        {
            var newContract = new Contract
            {
                Id = Guid.NewGuid(),
                ProjectId = contractDto.ProjectId,
                ContractNumber = contractDto.ContractNumber,
                Title = contractDto.Title,
                TotalValue = contractDto.TotalValue,
                Status = ContractStatus.Active,
                StartDate = DateTime.UtcNow
            };

            _context.Contracts.Add(newContract);
            await _context.SaveChangesAsync();

            return Ok(newContract);
        }
        // PUT: api/contracts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateContract(Guid id, [FromBody] UpdateContractDto contractDto)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }

            contract.ContractNumber = contractDto.ContractNumber;
            contract.Title = contractDto.Title;
            contract.TotalValue = contractDto.TotalValue;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Contracts.Any(e => e.Id == id)) { return NotFound(); } else { throw; }
            }

            return NoContent();
        }

        // GET: api/contracts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Contract>> GetContractById(Guid id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }
            return Ok(contract);
        }

        // DELETE: api/contracts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContract(Guid id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }

            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}