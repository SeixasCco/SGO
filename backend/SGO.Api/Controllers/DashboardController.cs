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

        // ✅ ENDPOINT PRINCIPAL - MÉTRICAS GERAIS (CORRIGIDO)
        [HttpGet("summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var today = DateTime.UtcNow.Date;
            var firstDayOfMonth = new DateTime(today.Year, today.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var firstDayOfYear = new DateTime(today.Year, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            // ✅ CONSULTAS SEQUENCIAIS PARA EVITAR CONCORRÊNCIA
            var projects = await _context.Projects.ToListAsync();
            var contracts = await _context.Contracts.ToListAsync();
            var expenses = await _context.ProjectExpenses.ToListAsync();
            var activeEmployees = await _context.Employees.Where(e => e.IsActive).ToListAsync();
            var allocatedEmployeesCount = await _context.ProjectEmployees.CountAsync(pe => pe.EndDate == null);

            var summary = new DashboardSummaryDto
            {
                // ✅ MÉTRICAS PRINCIPAIS
                TotalProjects = projects.Count,
                ActiveProjects = projects.Count(p => p.Status == ProjectStatus.Active),
                CompletedProjects = projects.Count(p => p.Status == ProjectStatus.Completed),
                PendingProjects = projects.Count(p => p.Status == ProjectStatus.Planning),

                // ✅ MÉTRICAS FINANCEIRAS
                TotalContractsValue = contracts.Sum(c => c.TotalValue),
                TotalExpensesValue = expenses.Sum(e => e.Amount),
                MonthlyExpenses = expenses.Where(e => e.Date >= firstDayOfMonth).Sum(e => e.Amount),
                YearlyExpenses = expenses.Where(e => e.Date >= firstDayOfYear).Sum(e => e.Amount),

                // ✅ MÉTRICAS DE EQUIPE
                TotalEmployees = activeEmployees.Count,
                AllocatedEmployees = allocatedEmployeesCount,

                // ✅ MÉTRICAS MENSAIS
                ProjectsStartedThisMonth = projects.Count(p => p.StartDate >= firstDayOfMonth),
                ExpensesCountThisMonth = expenses.Count(e => e.Date >= firstDayOfMonth),

                // ✅ ANÁLISE FINANCEIRA
                ProfitMargin = contracts.Sum(c => c.TotalValue) - expenses.Sum(e => e.Amount),
                AverageProjectValue = contracts.Any() ? contracts.Average(c => c.TotalValue) : 0,

                // ✅ DATAS
                LastUpdated = DateTime.UtcNow
            };

            return Ok(summary);
        }

        // ✅ PROJETOS POR STATUS (PARA GRÁFICOS)
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

        // ✅ DESPESAS POR MÊS (PARA GRÁFICO DE LINHA) - CORRIGIDO
        [HttpGet("monthly-expenses")]
        public async Task<IActionResult> GetMonthlyExpenses()
        {
            var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
            
            // ✅ CORREÇÃO: Primeiro fazemos a consulta SQL básica
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

            // ✅ DEPOIS aplicamos a formatação em memória
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

        // ✅ MÉTODO HELPER PARA NOMES DOS MESES
        private static string GetMonthName(int month)
        {
            return month switch
            {
                1 => "Jan", 2 => "Fev", 3 => "Mar", 4 => "Abr", 5 => "Mai", 6 => "Jun",
                7 => "Jul", 8 => "Ago", 9 => "Set", 10 => "Out", 11 => "Nov", 12 => "Dez",
                _ => "N/A"
            };
        }

        // ✅ TOP 5 OBRAS POR VALOR
        [HttpGet("top-projects")]
        public async Task<IActionResult> GetTopProjects()
        {
            var topProjects = await _context.Projects
                .Include(p => p.Contracts)
                .Include(p => p.Expenses)
                .Select(p => new TopProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Contractor = p.Contractor,
                    City = p.City,
                    State = p.State,
                    Status = (int)p.Status,
                    StatusName = p.Status.ToString(),
                    TotalContractsValue = p.Contracts.Sum(c => c.TotalValue),
                    TotalExpensesValue = p.Expenses.Sum(e => e.Amount),
                    ProfitMargin = p.Contracts.Sum(c => c.TotalValue) - p.Expenses.Sum(e => e.Amount)
                })
                .OrderByDescending(p => p.TotalContractsValue)
                .Take(5)
                .ToListAsync();

            return Ok(topProjects);
        }

        // ✅ ATIVIDADES RECENTES EXPANDIDAS
        [HttpGet("recent-activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            var recentExpenses = await _context.ProjectExpenses
                .Include(e => e.Project)
                .OrderByDescending(e => e.Date)
                .Take(10)
                .Select(e => new RecentActivityDto
                {
                    ActivityType = "Despesa",
                    Description = e.Description,
                    ActivityDate = e.Date,
                    Amount = e.Amount,
                    RelatedId = e.ProjectId,
                    ProjectName = e.Project.Name,
                    ProjectContractor = e.Project.Contractor
                })
                .ToListAsync();          
            
            return Ok(recentExpenses);
        }

        // ✅ ALERTAS E NOTIFICAÇÕES (CORREÇÃO FINAL UTC)
        [HttpGet("alerts")]
        public async Task<IActionResult> GetDashboardAlerts()
        {
            var alerts = new List<DashboardAlertDto>();            
           
            var now = DateTime.UtcNow;
            var thirtyDaysAgo = now.AddDays(-30);
            var nextWeek = now.AddDays(7);
            var firstDayOfCurrentMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            try
            {
                // Projetos sem atividade recente (30 dias)
                var inactiveProjects = await _context.Projects
                    .Where(p => p.Status == ProjectStatus.Active)
                    .Where(p => !p.Expenses.Any(e => e.Date >= thirtyDaysAgo))
                    .CountAsync();

                if (inactiveProjects > 0)
                {
                    alerts.Add(new DashboardAlertDto
                    {
                        Type = "warning",
                        Title = "Projetos Inativos",
                        Message = $"{inactiveProjects} projeto(s) sem movimentação há mais de 30 dias",
                        Icon = "⚠️"
                    });
                }
            }
            catch (Exception ex)
            {              
                Console.WriteLine($"Erro ao verificar projetos inativos: {ex.Message}");
            }

            try
            {
                // Projetos próximos do prazo
                var projectsNearDeadline = await _context.Projects
                    .Where(p => p.Status == ProjectStatus.Active && p.EndDate.HasValue)
                    .Where(p => p.EndDate >= now && p.EndDate <= nextWeek)
                    .CountAsync();

                if (projectsNearDeadline > 0)
                {
                    alerts.Add(new DashboardAlertDto
                    {
                        Type = "info",
                        Title = "Prazos Próximos",
                        Message = $"{projectsNearDeadline} projeto(s) com prazo nos próximos 7 dias",
                        Icon = "📅"
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao verificar prazos próximos: {ex.Message}");
            }

            try
            {
                // Alto volume de despesas no mês
                var monthlyExpenses = await _context.ProjectExpenses
                    .Where(e => e.Date >= firstDayOfCurrentMonth)
                    .SumAsync(e => e.Amount);

                var lastMonthStart = firstDayOfCurrentMonth.AddMonths(-1);
                var lastMonthEnd = firstDayOfCurrentMonth.AddDays(-1);
                var lastMonthExpenses = await _context.ProjectExpenses
                    .Where(e => e.Date >= lastMonthStart && e.Date <= lastMonthEnd)
                    .SumAsync(e => e.Amount);

                if (lastMonthExpenses > 0 && (monthlyExpenses / lastMonthExpenses) > 1.5m)
                {
                    alerts.Add(new DashboardAlertDto
                    {
                        Type = "error",
                        Title = "Despesas Elevadas",
                        Message = "Despesas deste mês 50% acima do mês anterior",
                        Icon = "💰"
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao verificar despesas: {ex.Message}");
            }

            return Ok(alerts);
        }
    }
}