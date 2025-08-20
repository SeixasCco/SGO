// Local: SGO.Api/Controllers/ContractsController.cs
using Microsoft.AspNetCore.Mvc;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
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
    }
}