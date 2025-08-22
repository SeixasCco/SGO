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
    public class ProjectsController : ControllerBase
    {
        private readonly SgoDbContext _context;
        public ProjectsController(SgoDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectSummaryDto>>> GetAllProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Contracts)
                .Include(p => p.Expenses)
                .Include(p => p.ProjectEmployees)
                .Select(p => new ProjectSummaryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Contractor = p.Contractor,
                    City = p.City,
                    State = p.State,
                    CNO = p.CNO,
                    TeamSize = p.ProjectEmployees.Count(),
                    TotalContractsValue = p.Contracts.Sum(c => c.TotalValue),
                    TotalExpensesValue = p.Expenses.Sum(e => e.Amount)
                })
                .ToListAsync();

            return Ok(projects);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDetailsDto>> GetProjectById(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.Contracts)
                .Include(p => p.Expenses)
                    .ThenInclude(e => e.CostCenter)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            var projectDto = new ProjectDetailsDto
            {
                Id = project.Id,
                CNO = project.CNO,
                Name = project.Name,
                Contractor = project.Contractor,
                City = project.City,
                State = project.State,
                Contracts = project.Contracts.Select(c => new ContractDto
                {
                    Id = c.Id,
                    ContractNumber = c.ContractNumber,
                    TotalValue = c.TotalValue
                }).ToList(),
                Expenses = project.Expenses.Select(e => new ExpenseDto
                {
                    Id = e.Id,
                    Date = e.Date,
                    Description = e.Description,
                    Amount = e.Amount,
                    CostCenterName = e.CostCenter?.Name ?? "N/A",
                    AttachmentPath = e.AttachmentPath
                }).ToList()
            };

            return Ok(projectDto);
        }

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            project.Id = Guid.NewGuid();
            project.StartDate = DateTime.UtcNow;

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, project);
        }

        // PUT: api/projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectDto projectDto)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            project.Name = projectDto.Name;
            project.Contractor = projectDto.Contractor;
            project.CNO = projectDto.CNO;
            project.Responsible = projectDto.Responsible;
            project.StartDate = projectDto.StartDate.ToUniversalTime();
            project.EndDate = projectDto.EndDate?.ToUniversalTime();
            project.City = projectDto.City;
            project.State = projectDto.State;
            project.Address = projectDto.Address;
            project.Description = projectDto.Description;
            project.Status = (ProjectStatus)projectDto.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Projects.Any(p => p.Id == id))
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

        // DELETE: api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}