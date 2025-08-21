// SGO.Api/Controllers/ProjectsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos; // Importe os DTOs
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
        public async Task<ActionResult<IEnumerable<Project>>> GetAllProjects()
        {
            return await _context.Projects.ToListAsync();
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
    }
}