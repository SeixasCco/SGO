using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ganss.Xss;
using System;

namespace SGO.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly SgoDbContext _context;
        private readonly IHtmlSanitizer _sanitizer;

        public ProjectsController(SgoDbContext context, IHtmlSanitizer sanitizer)
        {
            _context = context;
            _sanitizer = sanitizer;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectDetailsDto>>> GetProjects([FromQuery] ProjectFilterDto filter)
        {
            var query = _context.Projects.AsQueryable();

            if (filter.CompanyId.HasValue)
            {
                query = query.Where(p => p.CompanyId == filter.CompanyId.Value);
            }

            var projects = await query
                .Include(p => p.Company)
                .Select(p => new ProjectDetailsDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Cnpj = p.Cnpj,
                    Status = p.Status,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    CompanyId = p.CompanyId,
                    CompanyName = p.Company.Name
                })
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDetailsDto>> GetProjectById(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.Company)
                .Include(p => p.Contracts)
                    .ThenInclude(c => c.Invoices)
                .Include(p => p.Expenses)
                    .ThenInclude(e => e.CostCenter)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound();
            }
            
            var projectDto = new ProjectDetailsDto
            {
                Id = project.Id,
                Name = project.Name,
                Cnpj = project.Cnpj,
                Status = project.Status,
                StartDate = project.StartDate,
                EndDate = project.EndDate,
                CompanyId = project.CompanyId,
                CompanyName = project.Company.Name,
                Address = project.Address,
                Description = project.Description,
                IsAdditive = project.IsAdditive,
                OriginalProjectId = project.OriginalProjectId,
                Responsible = project.Responsible,
                Contractor = project.Contractor,
                ServiceTaker = project.ServiceTaker,
                City = project.City,
                State = project.State,
                CNO = project.CNO,
                Contracts = project.Contracts,
                Expenses = project.Expenses.Select(e => new ExpenseListItemDto
                {
                    Id = e.Id,
                    Date = e.Date,
                    Description = e.Description,
                    Amount = e.Amount,
                    CostCenterName = e.CostCenter.Name,
                    IsVirtual = e.IsVirtual,
                    AttachmentPath = e.AttachmentPath
                }).ToList()
            };

            return Ok(projectDto);
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            var project = new Project
            {
                CompanyId = createProjectDto.CompanyId,
                Name = _sanitizer.Sanitize(createProjectDto.Name),
                Cnpj = _sanitizer.Sanitize(createProjectDto.Cnpj),
                CNO = createProjectDto.CNO != null ? _sanitizer.Sanitize(createProjectDto.CNO) : null,
                Contractor = _sanitizer.Sanitize(createProjectDto.Contractor),
                ServiceTaker = _sanitizer.Sanitize(createProjectDto.ServiceTaker),
                Responsible = _sanitizer.Sanitize(createProjectDto.Responsible),
                City = _sanitizer.Sanitize(createProjectDto.City),
                State = _sanitizer.Sanitize(createProjectDto.State),
                Status = createProjectDto.Status,
                StartDate = createProjectDto.StartDate,
                EndDate = createProjectDto.EndDate,
                Address = createProjectDto.Address != null ? _sanitizer.Sanitize(createProjectDto.Address) : null,
                Description = createProjectDto.Description != null ? _sanitizer.Sanitize(createProjectDto.Description) : null,
                IsAdditive = createProjectDto.IsAdditive,
                OriginalProjectId = createProjectDto.OriginalProjectId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProjectById), new { id = project.Id }, project);
        }

        // PUT: api/projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectDto updateProjectDto)
        {
            if (id != updateProjectDto.Id)
            {
                return BadRequest("Project ID mismatch");
            }

            var project = await _context.Projects.FindAsync(id);

            if (project == null)
            {
                return NotFound();
            }

            project.CompanyId = updateProjectDto.CompanyId;
            project.Name = _sanitizer.Sanitize(updateProjectDto.Name);
            project.Cnpj = _sanitizer.Sanitize(updateProjectDto.Cnpj);
            project.CNO = updateProjectDto.CNO != null ? _sanitizer.Sanitize(updateProjectDto.CNO) : null;
            project.Contractor = _sanitizer.Sanitize(updateProjectDto.Contractor);
            project.ServiceTaker = _sanitizer.Sanitize(updateProjectDto.ServiceTaker);
            project.Responsible = _sanitizer.Sanitize(updateProjectDto.Responsible);
            project.City = _sanitizer.Sanitize(updateProjectDto.City);
            project.State = _sanitizer.Sanitize(updateProjectDto.State);
            project.Status = updateProjectDto.Status;
            project.StartDate = updateProjectDto.StartDate;
            project.EndDate = updateProjectDto.EndDate;
            project.Address = updateProjectDto.Address != null ? _sanitizer.Sanitize(updateProjectDto.Address) : null;
            project.Description = updateProjectDto.Description != null ? _sanitizer.Sanitize(updateProjectDto.Description) : null;
            project.IsAdditive = updateProjectDto.IsAdditive;
            project.OriginalProjectId = updateProjectDto.OriginalProjectId;

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
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
        
        private bool ProjectExists(Guid id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}