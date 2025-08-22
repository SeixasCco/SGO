// Em SGO.Api/Controllers/EmployeesController.cs
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
    public class EmployeesController : ControllerBase
    {
        private readonly SgoDbContext _context;
        public EmployeesController(SgoDbContext context) { _context = context; }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
        {
            return await _context.Employees
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Position = e.Position,
                    Salary = e.Salary,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsActive = e.IsActive
                })
                .ToListAsync();
        }

        // GET: api/employees/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeById(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();

            var employeeDto = new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Position = employee.Position,
                Salary = employee.Salary,
                StartDate = employee.StartDate,
                EndDate = employee.EndDate,
                IsActive = employee.IsActive
            };
            return Ok(employeeDto);
        }

        [HttpGet("available")]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAvailableEmployees()
        {
            var assignedEmployeeIds = await _context.Set<ProjectEmployee>()
                                                    .Where(pe => pe.EndDate == null)
                                                    .Select(pe => pe.EmployeeId)
                                                    .Distinct()
                                                    .ToListAsync();

            return await _context.Employees
                               .Where(e => !assignedEmployeeIds.Contains(e.Id))
                               .Select(e => new EmployeeDto 
                               {
                                   Id = e.Id,
                                   Name = e.Name,
                                   Position = e.Position,
                                   Salary = e.Salary,
                                   StartDate = e.StartDate,
                                   EndDate = e.EndDate,
                                   IsActive = e.IsActive
                               })
                               .ToListAsync();
        }

        // POST: api/employees
        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> CreateEmployee(CreateEmployeeDto employeeDto)
        {
            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                Name = employeeDto.Name,
                Position = employeeDto.Position,
                Salary = employeeDto.Salary,
                StartDate = employeeDto.StartDate.ToUniversalTime(),
                EndDate = employeeDto.EndDate?.ToUniversalTime(),
                IsActive = true
            };
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            var resultDto = new EmployeeDto { Id = employee.Id, Name = employee.Name, /*...*/ };
            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, resultDto);
        }

        // PUT: api/employees/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(Guid id, UpdateEmployeeDto employeeDto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();

            employee.Name = employeeDto.Name;
            employee.Position = employeeDto.Position;
            employee.Salary = employeeDto.Salary;
            employee.StartDate = employeeDto.StartDate.ToUniversalTime();
            employee.EndDate = employeeDto.EndDate?.ToUniversalTime();
            employee.IsActive = employeeDto.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return NotFound();
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}