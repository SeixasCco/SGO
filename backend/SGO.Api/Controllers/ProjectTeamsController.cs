// Em SGO.Api/Controllers/ProjectTeamsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/projects/{projectId}/team")]
    public class ProjectTeamsController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public ProjectTeamsController(SgoDbContext context)
        {
            _context = context;
        }

        // GET: api/projects/{projectId}/team
        [HttpGet]
        public async Task<IActionResult> GetTeam(Guid projectId)
        {
            var teamAllocations = await _context.ProjectEmployees // Agora buscamos na tabela correta
                .Where(pe => pe.ProjectId == projectId)
                .Include(pe => pe.Employee)
                .Select(pe => new
                {
                    AllocationId = pe.Id, // <-- Retornamos o ID da Alocação
                    EmployeeId = pe.EmployeeId,
                    EmployeeName = pe.Employee.Name,
                    StartDate = pe.StartDate,
                    EndDate = pe.EndDate // <-- E a data de fim
                })
                .OrderBy(t => t.StartDate)
                .ToListAsync();

            return Ok(teamAllocations);
        }

        // POST: api/projects/{projectId}/team/{employeeId}
        [HttpPost("{employeeId}")]
        public async Task<IActionResult> AddTeamMember(Guid projectId, Guid employeeId, [FromBody] AddTeamMemberDto dto)
        {
            var existingAllocation = await _context.ProjectEmployees
                .FirstOrDefaultAsync(pe => pe.ProjectId == projectId && pe.EmployeeId == employeeId && pe.EndDate == null);

            if (existingAllocation != null)
            {
                return BadRequest("Este funcionário já está ativo nesta obra.");
            }

            var newAllocation = new ProjectEmployee
            {
                Id = Guid.NewGuid(),
                ProjectId = projectId,
                EmployeeId = employeeId,
                StartDate = dto.StartDate.ToUniversalTime() // <-- Usa a data do DTO
            };

            _context.ProjectEmployees.Add(newAllocation);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // PUT: api/projects/{projectId}/team/{allocationId}/end
        // Usamos PUT para a ação de "dar baixa", que é uma atualização
        [HttpPut("{allocationId}/end")]
        public async Task<IActionResult> EndTeamMemberAllocation(Guid projectId, Guid allocationId)
        {
            var allocation = await _context.ProjectEmployees
                .FirstOrDefaultAsync(pe => pe.Id == allocationId && pe.ProjectId == projectId);

            if (allocation == null)
            {
                return NotFound();
            }

            allocation.EndDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}