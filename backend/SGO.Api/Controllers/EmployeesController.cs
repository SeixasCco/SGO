using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace SGO.Api.Controllers
{
    [Authorize] 
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly SgoDbContext _context;
        
        public EmployeesController(SgoDbContext context) 
        { 
            _context = context; 
        }
       
        private string GetCurrentUsername()
        {
            return HttpContext.User.FindFirst(ClaimTypes.Name)?.Value ?? "unknown";
        }

        private string GetCurrentUserRole()
        {
            return HttpContext.User.FindFirst(ClaimTypes.Role)?.Value ?? "user";
        }

        // GET: api/employees
        [HttpGet]
        [Authorize(Roles = "admin,supervisor")] 
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetEmployees()
        {
            var currentUser = GetCurrentUsername();
            var userRole = GetCurrentUserRole();

            Console.WriteLine($"🔍 Usuário {currentUser} ({userRole}) acessando lista de funcionários");

            var employees = await _context.Employees
                .Select(e => new EmployeeDto
                {
                    Id = e.Id,
                    Name = e.Name,
                    Position = e.Position,                    
                    Salary = userRole == "admin" ? e.Salary : 0,      
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,             
                    IsActive = e.IsActive
                })
                .ToListAsync();

            return Ok(employees);
        }

        // GET: api/employees/{id}
        [HttpGet("{id:guid}")]
        [Authorize(Roles = "admin,supervisor")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeById(Guid id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) 
                return NotFound("Funcionário não encontrado.");

            var userRole = GetCurrentUserRole();
            var currentUser = GetCurrentUsername();

            Console.WriteLine($"🔍 Usuário {currentUser} ({userRole}) acessando funcionário {employee.Name}");

            var employeeDto = new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Position = employee.Position,               
                Salary = userRole == "admin" ? employee.Salary : 0,   
                StartDate = employee.StartDate.ToUniversalTime(),
                EndDate = employee.EndDate?.ToUniversalTime(),            
                IsActive = employee.IsActive
            };

            return Ok(employeeDto);
        }

        // GET: api/employees/available
        [HttpGet("available")]
        [Authorize(Roles = "admin,supervisor")]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAvailableEmployees()
        {
            var currentUser = GetCurrentUsername();
            Console.WriteLine($"🔍 Usuário {currentUser} buscando funcionários disponíveis");

            var assignedEmployeeIds = await _context.ProjectEmployees
                                                    .Where(pe => pe.EndDate == null) 
                                                    .Select(pe => pe.EmployeeId)
                                                    .Distinct()
                                                    .ToListAsync();

            var userRole = GetCurrentUserRole();
            var availableEmployees = await _context.Employees
                               .Where(e => e.IsActive && !assignedEmployeeIds.Contains(e.Id))
                               .Select(e => new EmployeeDto 
                               {
                                   Id = e.Id,
                                   Name = e.Name,
                                   Position = e.Position,                                
                                   Salary = userRole == "admin" ? e.Salary : 0,       
                                   StartDate = e.StartDate,
                                   EndDate = e.EndDate,                           
                                   IsActive = e.IsActive
                               })
                               .ToListAsync();

            return Ok(availableEmployees);
        }

        // POST: api/employees
        [HttpPost]
        [Authorize(Roles = "admin")] 
        public async Task<ActionResult<EmployeeDto>> CreateEmployee(CreateEmployeeDto employeeDto)
        {
            var currentUser = GetCurrentUsername();
            Console.WriteLine($"🆕 Admin {currentUser} criando funcionário: {employeeDto.Name}");
            
            if (string.IsNullOrWhiteSpace(employeeDto.Name) || employeeDto.Name.Length < 2)
            {
                return BadRequest("Nome deve ter pelo menos 2 caracteres.");
            }

            if (employeeDto.Salary < 0)
            {
                return BadRequest("Salário não pode ser negativo.");
            }

            var employee = new Employee
            {
                Id = Guid.NewGuid(),
                Name = employeeDto.Name.Trim(),
                Position = employeeDto.Position?.Trim() ?? "",
                Salary = employeeDto.Salary,
                StartDate = employeeDto.StartDate.ToUniversalTime(),
                EndDate = employeeDto.EndDate?.ToUniversalTime(),              
                IsActive = true
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            var responseDto = new EmployeeDto
            {
                Id = employee.Id,
                Name = employee.Name,
                Position = employee.Position,
                Salary = employee.Salary,
                StartDate = employee.StartDate,
                EndDate = employee.EndDate,
                IsActive = employee.IsActive
            };

            return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, responseDto);
        }

        // PUT: api/employees/{id}
        [HttpPut("{id:guid}")]
        [Authorize(Roles = "admin")] 
        public async Task<IActionResult> UpdateEmployee(Guid id, CreateEmployeeDto employeeDto)
        {
            var currentUser = GetCurrentUsername();
            Console.WriteLine($"✏️ Admin {currentUser} atualizando funcionário {id}");

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound("Funcionário não encontrado.");
            }
            
            if (string.IsNullOrWhiteSpace(employeeDto.Name) || employeeDto.Name.Length < 2)
            {
                return BadRequest("Nome deve ter pelo menos 2 caracteres.");
            }

            if (employeeDto.Salary < 0)
            {
                return BadRequest("Salário não pode ser negativo.");
            }

            existingEmployee.Name = employeeDto.Name.Trim();
            existingEmployee.Position = employeeDto.Position?.Trim() ?? "";
            existingEmployee.Salary = employeeDto.Salary;
            existingEmployee.StartDate = employeeDto.StartDate.ToUniversalTime();
            existingEmployee.EndDate = employeeDto.EndDate?.ToUniversalTime();

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Erro ao atualizar funcionário: {ex.Message}");
                return StatusCode(500, "Erro interno do servidor.");
            }
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "admin")] 
        public async Task<IActionResult> DeleteEmployee(Guid id)
        {
            var currentUser = GetCurrentUsername();
            Console.WriteLine($"🗑️ Admin {currentUser} removendo funcionário {id}");

            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound("Funcionário não encontrado.");
            }
          
            var hasActiveProjects = await _context.ProjectEmployees
                .AnyAsync(pe => pe.EmployeeId == id && pe.EndDate == null);

            if (hasActiveProjects)
            {
                return BadRequest("Não é possível remover funcionário que está ativo em projetos.");
            }
            
            employee.IsActive = false;
            employee.EndDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}