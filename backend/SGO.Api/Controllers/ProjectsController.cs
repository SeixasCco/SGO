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

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectSummaryDto>>> GetAllProjects([FromQuery] ProjectFilterDto filters)
        {
            var query = _context.Projects.AsQueryable();

            if (!string.IsNullOrEmpty(filters.City))
            {
                query = query.Where(p => p.City.Contains(filters.City));
            }

            if (!string.IsNullOrEmpty(filters.ServiceTaker))
            {
                query = query.Where(p => p.ServiceTaker.Contains(filters.ServiceTaker));
            }

            if (filters.StartDate.HasValue)
            {
                query = query.Where(p => p.StartDate >= filters.StartDate.Value.ToUniversalTime());
            }

            if (filters.EndDate.HasValue)
            {
                query = query.Where(p => p.EndDate <= filters.EndDate.Value.ToUniversalTime());
            }

            if (filters.Status.HasValue)
            {
                query = query.Where(p => (int)p.Status == filters.Status.Value);
            }

            var projectsData = await query
                .Select(p => new
                {
                    Project = p,
                    Contracts = p.Contracts,
                    Expenses = p.Expenses,
                    Allocations = p.ProjectEmployees.Select(pe => new
                    {
                        pe.StartDate,
                        pe.EndDate,
                        pe.Employee.Salary
                    })
                })
                .ToListAsync();

            var projectSummaries = projectsData.Select(data =>
            {
                var laborCost = data.Allocations
                    .Where(a => a.StartDate > DateTime.MinValue)
                    .Sum(a => (a.Salary / 30) * (decimal)((a.EndDate ?? DateTime.UtcNow) - a.StartDate).TotalDays);

                return new ProjectSummaryDto
                {
                    Id = data.Project.Id,
                    Name = data.Project.Name,
                    Contractor = data.Project.Contractor,
                    City = data.Project.City,
                    State = data.Project.State,
                    CNO = data.Project.CNO,
                    Responsible = data.Project.Responsible,
                    Status = (int)data.Project.Status,
                    StatusText = GetStatusText(data.Project.Status),

                    TeamSize = data.Allocations.Count(a => a.EndDate == null),
                    TotalContractsValue = data.Contracts.Sum(c => c.TotalValue),
                    TotalExpensesValue = (data.Expenses.Sum(e => (decimal?)e.Amount) ?? 0) + Math.Round(laborCost, 2)
                };
            });

            return Ok(projectSummaries);
        }
        private static string GetStatusText(ProjectStatus status)
        {
            return status switch
            {
                ProjectStatus.Planning => "🟡 Planejamento",
                ProjectStatus.Active => "🟢 Ativa",
                ProjectStatus.OnHold => "🟠 Pausada",
                ProjectStatus.Completed => "✅ Concluída",
                ProjectStatus.Additive => "🔄 Aditivo",
                ProjectStatus.Cancelled => "❌ Cancelada",
                _ => "❓ Indefinido"
            };
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDetailsDto>> GetProjectById(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.Contracts)
                .Include(p => p.Expenses)
                    .ThenInclude(e => e.CostCenter)
                .Include(p => p.ProjectEmployees)
                    .ThenInclude(pe => pe.Employee)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (project == null) return NotFound();

            var laborCost = project.ProjectEmployees
                .Where(pe => pe.StartDate > DateTime.MinValue)
                .Sum(pe => (pe.Employee.Salary / 30) * (decimal)((pe.EndDate ?? DateTime.UtcNow) - pe.StartDate).TotalDays);


            var realExpenses = project.Expenses.Select(e => new ExpenseDto
            {
                Id = e.Id,
                Date = e.Date,
                Description = e.Description,
                Amount = e.Amount,
                CostCenterName = e.CostCenter?.Name ?? "N/A",
                AttachmentPath = e.AttachmentPath,
                IsVirtual = false
            }).ToList();

            if (laborCost > 0)
            {
                var virtualExpense = new ExpenseDto
                {
                    Id = Guid.NewGuid(),
                    Date = DateTime.UtcNow,
                    Description = "Custo de Mão de Obra (Calculado)",
                    Amount = Math.Round(laborCost, 2),
                    CostCenterName = "Mão de Obra",
                    IsVirtual = true
                };
                realExpenses.Insert(0, virtualExpense);
            }


            var projectDto = new ProjectDetailsDto
            {
                Id = project.Id,
                CNO = project.CNO,
                Name = project.Name,
                Contractor = project.Contractor,
                ServiceTaker = project.ServiceTaker,
                Responsible = project.Responsible,
                City = project.City,
                State = project.State,
                StartDate = project.StartDate,
                Address = project.Address,
                Description = project.Description,
                Status = (int)project.Status,
                EndDate = project.EndDate,
                Expenses = realExpenses ,
                Contracts = project.Contracts.Select(c => new ContractDto
                {
                    Id = c.Id,
                    ContractNumber = c.ContractNumber,
                    TotalValue = c.TotalValue
                }).ToList(),                
            };

            return Ok(projectDto);
        }

        // Em SGO.Api/Controllers/ProjectsController.cs

        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDto projectDto)
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                CNO = projectDto.CNO,
                Name = projectDto.Name,
                Contractor = projectDto.Contractor,
                ServiceTaker = projectDto.ServiceTaker,
                Responsible = projectDto.Responsible,
                City = projectDto.City,
                State = projectDto.State,
                StartDate = projectDto.StartDate.ToUniversalTime(),
                EndDate = projectDto.EndDate?.ToUniversalTime(),
                Status = ProjectStatus.Active
            };

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
