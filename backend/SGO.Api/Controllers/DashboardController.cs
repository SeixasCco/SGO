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
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public DashboardController(SgoDbContext context)
        {
            _context = context;
        }

        private async Task<decimal> CalculateTotalLaborCostAsync()
        {
            var allAllocations = await _context.ProjectEmployees
                .Include(pe => pe.Employee)
                .Where(pe => pe.StartDate > DateTime.MinValue)
                .ToListAsync();

            return allAllocations
                .Sum(pe => (pe.Employee.Salary / 30m) * (decimal)(((pe.EndDate?.Date ?? DateTime.UtcNow.Date) - pe.StartDate.Date).TotalDays + 1));
        }

        private async Task<decimal> CalculateLaborCostForPeriodAsync(DateTime startDate, DateTime? endDate = null)
        {
            var periodEnd = endDate ?? DateTime.UtcNow;

            var allAllocations = await _context.ProjectEmployees
                .Include(pe => pe.Employee)
                .Where(pe => pe.StartDate > DateTime.MinValue)
                .Where(pe => pe.StartDate <= periodEnd && (pe.EndDate == null || pe.EndDate >= startDate))
                .ToListAsync();

            return allAllocations
        .Sum(pe =>
        {
            var workStartDate = pe.StartDate.Date < startDate.Date ? startDate.Date : pe.StartDate.Date;
            var effectiveEndDate = pe.EndDate?.Date ?? periodEnd.Date;
            var workEndDate = effectiveEndDate > periodEnd.Date ? periodEnd.Date : effectiveEndDate;

            if (workStartDate > workEndDate) return 0m;

            var daysWorked = (decimal)((workEndDate - workStartDate).TotalDays + 1);
            return (pe.Employee.Salary / 30m) * daysWorked;
        });
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var today = DateTime.UtcNow.Date;
            var firstDayOfMonth = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var firstDayOfYear = new DateTime(today.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var projects = await _context.Projects.ToListAsync();
            var contracts = await _context.Contracts.ToListAsync();
            var manualExpenses = await _context.ProjectExpenses.Where(e => !e.IsAutomaticallyCalculated).ToListAsync();
            var activeEmployees = await _context.Employees.Where(e => e.IsActive).ToListAsync();
            var allocatedEmployeesCount = await _context.ProjectEmployees.CountAsync(pe => pe.EndDate == null);
            var totalLaborCost = await CalculateTotalLaborCostAsync();
            var monthlyLaborCost = await CalculateLaborCostForPeriodAsync(firstDayOfMonth);
            var yearlyLaborCost = await CalculateLaborCostForPeriodAsync(firstDayOfYear);
            var totalManualExpenses = manualExpenses.Sum(e => e.Amount);
            var monthlyManualExpenses = manualExpenses.Where(e => e.Date >= firstDayOfMonth).Sum(e => e.Amount);
            var yearlyManualExpenses = manualExpenses.Where(e => e.Date >= firstDayOfYear).Sum(e => e.Amount);

            var summary = new DashboardSummaryDto
            {
                TotalProjects = projects.Count,
                ActiveProjects = projects.Count(p => p.Status == ProjectStatus.Active),
                CompletedProjects = projects.Count(p => p.Status == ProjectStatus.Completed),
                PendingProjects = projects.Count(p => p.Status == ProjectStatus.Planning),

                TotalContractsValue = contracts.Sum(c => c.TotalValue),

                TotalExpensesValue = totalManualExpenses + Math.Round(totalLaborCost, 2),
                MonthlyExpenses = monthlyManualExpenses + Math.Round(monthlyLaborCost, 2),
                YearlyExpenses = yearlyManualExpenses + Math.Round(yearlyLaborCost, 2),

                TotalEmployees = activeEmployees.Count,
                AllocatedEmployees = allocatedEmployeesCount,

                ProjectsStartedThisMonth = projects.Count(p => p.StartDate >= firstDayOfMonth),
                ExpensesCountThisMonth = await _context.ProjectExpenses.CountAsync(e => e.Date >= firstDayOfMonth),
                ProfitMargin = contracts.Sum(c => c.TotalValue) - (totalManualExpenses + Math.Round(totalLaborCost, 2)),
                AverageProjectValue = contracts.Any() ? contracts.Average(c => c.TotalValue) : 0,
                LastUpdated = DateTime.UtcNow
            };

            return Ok(summary);
        }

        [HttpGet("projects-by-status")]
        public async Task<IActionResult> GetProjectsByStatus()
        {
            var projectsByStatus = await _context.Projects
                .GroupBy(p => p.Status)
                .Select(g => new ProjectStatusSummaryDto
                {
                    Status = (int)g.Key,
                    StatusName = g.Key.ToString(),
                    Count = g.Count(),
                    TotalValue = g.SelectMany(p => p.Contracts).Sum(c => c.TotalValue)
                })
                .ToListAsync();

            return Ok(projectsByStatus);
        }

        [HttpGet("monthly-expenses")]
        public async Task<IActionResult> GetMonthlyExpenses()
        {
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);

            var monthlyData = await _context.ProjectExpenses
                .Where(e => e.Date >= sixMonthsAgo)
                .GroupBy(e => new { e.Date.Year, e.Date.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalAmount = g.Sum(e => e.Amount),
                    ExpenseCount = g.Count()
                })
                .OrderBy(m => m.Year).ThenBy(m => m.Month)
                .ToListAsync();

            var monthlyExpenses = monthlyData.Select(data => new MonthlyExpenseDto
            {
                Year = data.Year,
                Month = data.Month,
                MonthName = GetMonthName(data.Month),
                TotalAmount = data.TotalAmount,
                ExpenseCount = data.ExpenseCount
            }).ToList();

            return Ok(monthlyExpenses);
        }

        [HttpGet("top-projects")]
        public async Task<IActionResult> GetTopProjects()
        {
            var projectsWithData = await _context.Projects
                .Include(p => p.Contracts)
                .Include(p => p.Expenses)
                .Include(p => p.ProjectEmployees)
                    .ThenInclude(pe => pe.Employee)
                .ToListAsync();

            var topProjects = projectsWithData.Select(p =>
            {
                var laborCost = p.ProjectEmployees
                    .Where(pe => pe.StartDate > DateTime.MinValue)
                    .Sum(pe => (pe.Employee.Salary / 30m) * (decimal)(((pe.EndDate?.Date ?? DateTime.UtcNow.Date) - pe.StartDate.Date).TotalDays + 1));

                var manualExpenses = p.Expenses.Where(e => !e.IsAutomaticallyCalculated).Sum(e => e.Amount);
                var totalExpenses = manualExpenses + Math.Round(laborCost, 2);

                return new TopProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Contractor = p.Contractor,
                    City = p.City,
                    State = p.State,
                    Status = (int)p.Status,
                    StatusName = p.Status.ToString(),
                    TotalContractsValue = p.Contracts.Sum(c => c.TotalValue),
                    TotalExpensesValue = totalExpenses,
                    ProfitMargin = p.Contracts.Sum(c => c.TotalValue) - totalExpenses
                };
            })
    .OrderByDescending(p => p.TotalContractsValue)
    .Take(5)
    .ToList();

            return Ok(topProjects);
        }

        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            var recentExpenses = await _context.ProjectExpenses
                .Include(e => e.Project)
                .OrderByDescending(e => e.Date)
                .Take(10)
                .Select(e => new RecentActivityDto
                {
                    ActivityType = "expense",
                    Description = e.Description,
                    ActivityDate = e.Date,
                    Amount = e.Amount,
                    RelatedId = e.Id,
                    ProjectName = e.Project.Name,
                    ProjectContractor = e.Project.Contractor
                })
                .ToListAsync();

            return Ok(recentExpenses);
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> GetDashboardAlerts()
        {
            var alerts = new List<DashboardAlertDto>();

            var projectsWithoutExpenses = await _context.Projects
                .Where(p => p.Status == ProjectStatus.Active && !p.Expenses.Any())
                .CountAsync();

            if (projectsWithoutExpenses > 0)
            {
                alerts.Add(new DashboardAlertDto
                {
                    Type = "warning",
                    Title = "Obras sem despesas",
                    Message = $"{projectsWithoutExpenses} obra(s) ativa(s) sem despesas lançadas",
                    Icon = "⚠️"
                });
            }

            try
            {
                var employeesWithoutAllocation = await _context.Employees
                    .Where(e => e.IsActive)
                    .CountAsync() - await _context.ProjectEmployees
                    .Where(pe => pe.EndDate == null)
                    .Select(pe => pe.EmployeeId)
                    .Distinct()
                    .CountAsync();

                if (employeesWithoutAllocation > 0)
                {
                    alerts.Add(new DashboardAlertDto
                    {
                        Type = "info",
                        Title = "Funcionários disponíveis",
                        Message = $"{employeesWithoutAllocation} funcionário(s) disponível(is) para alocação",
                        Icon = "👥"
                    });
                }
            }
            catch
            {

            }

            return Ok(alerts);
        }

        private static string GetMonthName(int month)
        {
            return month switch
            {
                1 => "Jan",
                2 => "Fev",
                3 => "Mar",
                4 => "Abr",
                5 => "Mai",
                6 => "Jun",
                7 => "Jul",
                8 => "Ago",
                9 => "Set",
                10 => "Out",
                11 => "Nov",
                12 => "Dez",
                _ => "N/A"
            };
        }
    }
}