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
            var teamMembers = await _context.Set<ProjectEmployee>()
                .Where(pe => pe.ProjectId == projectId)
                .Include(pe => pe.Employee)
                .Select(pe => new TeamMemberDto
                {
                    EmployeeId = pe.EmployeeId,
                    EmployeeName = pe.Employee.Name
                })
                .ToListAsync();

            return Ok(teamMembers);
        }

        // POST: api/projects/{projectId}/team/{employeeId}
        [HttpPost("{employeeId}")]
        public async Task<IActionResult> AddTeamMember(Guid projectId, Guid employeeId)
        {
            var existingLink = await _context.Set<ProjectEmployee>()
                .FindAsync(projectId, employeeId);

            if (existingLink != null)
            {
                return Ok(); 
            }

            var projectEmployee = new ProjectEmployee
            {
                ProjectId = projectId,
                EmployeeId = employeeId
            };

            _context.Set<ProjectEmployee>().Add(projectEmployee);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE: api/projects/{projectId}/team/{employeeId}
        [HttpDelete("{employeeId}")]
        public async Task<IActionResult> RemoveTeamMember(Guid projectId, Guid employeeId)
        {
            var projectEmployee = await _context.Set<ProjectEmployee>()
                .FindAsync(projectId, employeeId);

            if (projectEmployee == null)
            {
                return NotFound();
            }

            _context.Set<ProjectEmployee>().Remove(projectEmployee);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}