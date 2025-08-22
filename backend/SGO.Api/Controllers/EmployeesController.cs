using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SGO.Api.Dtos;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public EmployeesController(SgoDbContext context)
        {
            _context = context;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(Guid id, [FromBody] UpdateEmployeeDto employeeDto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            // Atualiza a entidade com os dados do DTO
            employee.Name = employeeDto.Name;
            employee.Position = employeeDto.Position;
            employee.HireDate = employeeDto.HireDate.ToUniversalTime();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Employees.Any(e => e.Id == id))
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

        // DELETE: api/employees/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //GET :api/employee/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployeeById(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }
            return Ok(employee);
        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            employee.Id = Guid.NewGuid();
            employee.HireDate = employee.HireDate.ToUniversalTime();
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetAvailableEmployees()
        {            
            var assignedEmployeeIds = await _context.Set<ProjectEmployee>()
                                                    .Select(pe => pe.EmployeeId)
                                                    .Distinct()
                                                    .ToListAsync();
           
            var availableEmployees = await _context.Employees
                                                   .Where(e => !assignedEmployeeIds.Contains(e.Id))
                                                   .ToListAsync();

            return Ok(availableEmployees);
        }

    }
}