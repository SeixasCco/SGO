using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
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
                    .Sum(a => (a.Salary / 30m) * (decimal)(((a.EndDate?.Date ?? DateTime.UtcNow.Date) - a.StartDate.Date).TotalDays + 1));

                var manualExpensesValue = data.Expenses
                    .Where(e => !e.IsAutomaticallyCalculated)
                    .Sum(e => (decimal?)e.Amount) ?? 0;

                var totalExpenses = manualExpensesValue + Math.Round(laborCost, 2);

                return new ProjectSummaryDto
                {
                    Id = data.Project.Id,
                    Name = data.Project.Name,
                    Contractor = data.Project.Contractor,
                    City = data.Project.City,
                    State = data.Project.State,
                    CNO = data.Project.CNO ?? "N/A",
                    Responsible = data.Project.Responsible,
                    Status = (int)data.Project.Status,
                    StatusText = GetStatusText(data.Project.Status),

                    TeamSize = data.Allocations.Count(a => a.EndDate == null),
                    TotalContractsValue = data.Contracts.Sum(c => c.TotalValue),
                    TotalExpensesValue = totalExpenses
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

            var payrollCostCenter = await _context.CostCenters
                .FirstOrDefaultAsync(cc => cc.Name == "Folhas de pagamento");

            if (payrollCostCenter == null)
            {
                return StatusCode(500, "Centro de Custo 'Folha de pagamento' não encontrado no banco de dados.");
            }

            var laborCost = project.ProjectEmployees
                .Where(pe => pe.StartDate > DateTime.MinValue)
                .Sum(pe => (pe.Employee.Salary / 30m) * (decimal)(((pe.EndDate?.Date ?? DateTime.UtcNow.Date) - pe.StartDate.Date).TotalDays + 1));

            var automatedExpense = project.Expenses
                .FirstOrDefault(e => e.IsAutomaticallyCalculated);

            if (laborCost > 0)
            {
                if (automatedExpense != null)
                {
                    automatedExpense.Amount = Math.Round(laborCost, 2);
                    automatedExpense.Date = DateTime.UtcNow;
                    automatedExpense.CostCenterId = payrollCostCenter.Id;
                }
                else
                {
                    automatedExpense = new ProjectExpense
                    {
                        Id = Guid.NewGuid(),
                        ProjectId = project.Id,
                        ContractId = project.Contracts.FirstOrDefault()?.Id,
                        Description = "Custo de Mão de Obra (Calculado)",
                        Amount = Math.Round(laborCost, 2),
                        Date = DateTime.UtcNow,
                        CostCenterId = payrollCostCenter.Id,
                        IsAutomaticallyCalculated = true
                    };
                    _context.ProjectExpenses.Add(automatedExpense);
                }
                await _context.SaveChangesAsync();
            }
            else if (automatedExpense != null)
            {
                _context.ProjectExpenses.Remove(automatedExpense);
                await _context.SaveChangesAsync();
            }

            var updatedExpenses = await _context.ProjectExpenses
                .Where(e => e.ProjectId == id)
                .Include(e => e.CostCenter)
                .ToListAsync();

            var allExpensesDto = updatedExpenses.Select(e => new ExpenseDto
            {
                Id = e.Id,
                Date = e.Date,
                Description = e.Description,
                Amount = e.Amount,
                CostCenterName = e.CostCenter?.Name ?? "N/A",
                AttachmentPath = e.AttachmentPath,
                IsVirtual = e.IsAutomaticallyCalculated
            }).ToList();

            var projectDto = new ProjectDetailsDto
            {
                Id = project.Id,
                CNO = project.CNO ?? "N/A",
                Name = project.Name,
                Contractor = project.Contractor,
                ServiceTaker = project.ServiceTaker,
                Responsible = project.Responsible,
                City = project.City,
                State = project.State,
                StartDate = project.StartDate,
                Address = project.Address ?? "N/A",
                Description = project.Description ?? "N/A",
                Status = (int)project.Status,
                EndDate = project.EndDate,
                Expenses = allExpensesDto.OrderByDescending(e => e.IsVirtual).ThenByDescending(e => e.Date).ToList(),
                Contracts = project.Contracts.Select(c => new ContractDto
                {
                    Id = c.Id,
                    ContractNumber = c.ContractNumber,
                    TotalValue = c.TotalValue
                }).ToList(),
            };

            return Ok(projectDto);
        }
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject([FromBody] CreateProjectDto projectDto)
        {
            var project = new Project
            {
                Id = Guid.NewGuid(),
                Cnpj = projectDto.Cnpj,
                Address = projectDto.Address,
                Description = projectDto.Description,
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
            project.CNO = projectDto.Cnpj;
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
            var project = await _context.Projects
                                        .Include(p => p.Contracts)
                                        .Include(p => p.ProjectEmployees)
                                        .FirstOrDefaultAsync(p => p.Id == id);
            if (project == null)
            {
                return NotFound();
            }

            if (project.Contracts.Any())
            {
                return BadRequest("Esta obra não pode ser excluída pois possui contratos vinculados.");
            }

            if (project.ProjectEmployees.Any(pe => pe.EndDate == null))
            {
                return BadRequest("Esta obra não pode ser excluída pois possui funcionários alocados ativamente.");
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }


}
