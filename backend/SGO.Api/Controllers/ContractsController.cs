using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Ganss.Xss;


namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContractsController : ControllerBase
    {
        private readonly SgoDbContext _context;
        private readonly IHtmlSanitizer _sanitizer;

        public ContractsController(SgoDbContext context)
        {
            _context = context;
            _sanitizer = new HtmlSanitizer();
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
                    Title = c.Title,
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

                ContractNumber = _sanitizer.Sanitize(contractDto.ContractNumber.Trim()),
                Title = _sanitizer.Sanitize(contractDto.Title),
                TotalValue = contractDto.TotalValue,
                DownPaymentValue = contractDto.DownPaymentValue,
                RetentionValue = contractDto.RetentionValue,
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

            contract.ContractNumber = _sanitizer.Sanitize(contractDto.ContractNumber);
            contract.Title =  _sanitizer.Sanitize(contractDto.Title);
            contract.TotalValue = contractDto.TotalValue;
            contract.DownPaymentValue = contractDto.DownPaymentValue;
            contract.RetentionValue = contractDto.RetentionValue;
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
            var contract = await _context.Contracts
                                 .Include(c => c.Invoices)
                                 .Include(c => c.Expenses)
                                 .FirstOrDefaultAsync(c => c.Id == id);

            if (contract == null)
            {
                return NotFound();
            }

            if (contract.Invoices.Any())
            {
                return BadRequest("Este contrato não pode ser excluído pois possui notas fiscais lançadas.");
            }

            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}