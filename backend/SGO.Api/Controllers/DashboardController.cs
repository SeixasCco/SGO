using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Api.Dtos;
using SGO.Infrastructure;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public DashboardController(SgoDbContext context)
        {
            _context = context;
        }

        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            var recentExpenses = await _context.ProjectExpenses
                .OrderByDescending(e => e.Date)
                .Take(5) 
                .Select(e => new RecentActivityDto
                {
                    ActivityType = "Despesa",
                    Description = e.Description,
                    ActivityDate = e.Date,
                    Amount = e.Amount,
                    RelatedId = e.ProjectId 
                })
                .ToListAsync();            

            return Ok(recentExpenses);
        }
    }
}