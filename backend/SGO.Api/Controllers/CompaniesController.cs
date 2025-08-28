using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Collections.Generic;
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

        // GET: api/companies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {           
            return await _context.Companies.ToListAsync();
        }

        // GET: api/companies/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetCompanyById(Guid id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
            {
                return NotFound("Empresa não encontrada.");
            }
            return Ok(company);
        }

        // POST: api/companies
        [HttpPost]
        public async Task<ActionResult<Company>> CreateCompany([FromBody] Company companyData)
        {            
            companyData.Id = Guid.NewGuid(); 
            
            _context.Companies.Add(companyData);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCompanyById), new { id = companyData.Id }, companyData);
        }

        // PUT: api/companies/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(Guid id, [FromBody] Company companyData)
        {
            if (id != companyData.Id)
            {
                return BadRequest("O ID da empresa na URL não corresponde ao ID no corpo da requisição.");
            }

            var existingCompany = await _context.Companies.FindAsync(id);
            if (existingCompany == null)
            {
                return NotFound("Empresa não encontrada.");
            }

            existingCompany.Name = companyData.Name;
            existingCompany.Cnpj = companyData.Cnpj;

            _context.Entry(existingCompany).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/companies/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompany(Guid id)
        {
            var company = await _context.Companies
                                        .Include(c => c.Employees)
                                        .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
            {
                return NotFound();
            }
            
            if (company.Employees.Any())
            {
                return BadRequest("Não é possível excluir uma empresa que possui funcionários cadastrados.");
            }
          

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}