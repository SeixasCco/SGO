using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Threading.Tasks;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public CompaniesController(SgoDbContext context)
        {
            _context = context;
        }

        // GET: api/companies/main      
        [HttpGet("main")]
        public async Task<ActionResult<Company>> GetCompany()
        {
            var company = await _context.Companies.FirstOrDefaultAsync();
            if (company == null)
            {
                return NotFound("Nenhuma empresa cadastrada.");
            }
            return Ok(company);
        }

        // POST: api/companies      
        [HttpPost]
        public async Task<ActionResult<Company>> CreateOrUpdateCompany([FromBody] Company companyData)
        {
            var existingCompany = await _context.Companies.FirstOrDefaultAsync();

            if (existingCompany != null)
            {               
                existingCompany.Name = companyData.Name;
                existingCompany.Cnpj = companyData.Cnpj;
            }
            else
            {                
                companyData.Id = Guid.NewGuid();
                _context.Companies.Add(companyData);
            }

            await _context.SaveChangesAsync();
            return Ok(existingCompany ?? companyData);
        }
    }
}