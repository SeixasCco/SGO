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
        public async Task<ActionResult<IEnumerable<ContractSummaryDto>>> GetContractsByProject(Guid projectId)
        {
            return await _context.Contracts
                .Where(c => c.ProjectId == projectId)
                .Select(c => new ContractSummaryDto
                {
                    Id = c.Id,
                    ContractNumber = c.ContractNumber,
                    TotalValue = c.TotalValue,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate
                })
                .ToListAsync();
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

        // POST: api/contracts
        [HttpPost]
        public async Task<ActionResult<Contract>> CreateContract([FromBody] CreateContractDto contractDto)
        {
            var newContract = new Contract
            {
                Id = Guid.NewGuid(),
                ProjectId = contractDto.ProjectId,
                ContractNumber = contractDto.ContractNumber.Trim(),
                Title = contractDto.Title,
                TotalValue = contractDto.TotalValue,
                StartDate = contractDto.StartDate.ToUniversalTime(),
                EndDate = contractDto.EndDate?.ToUniversalTime(),
                Status = ContractStatus.Active
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
            contract.StartDate = contractDto.StartDate.ToUniversalTime();
            contract.EndDate = contractDto.EndDate?.ToUniversalTime();
            contract.Observations = contractDto.Observations;

            await _context.SaveChangesAsync();

            return NoContent();
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
