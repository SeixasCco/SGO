// Em SGO.Api/Dtos/DashboardDto.cs - Substituir o arquivo existente

namespace SGO.Api.Dtos;

// ✅ DTO PRINCIPAL - RESUMO GERAL
public class DashboardSummaryDto
{
    // Métricas de Projetos
    public int TotalProjects { get; set; }
    public int ActiveProjects { get; set; }
    public int CompletedProjects { get; set; }
    public int PendingProjects { get; set; }
    public int ProjectsStartedThisMonth { get; set; }

    // Métricas Financeiras
    public decimal TotalContractsValue { get; set; }
    public decimal TotalExpensesValue { get; set; }
    public decimal MonthlyExpenses { get; set; }
    public decimal YearlyExpenses { get; set; }
    public decimal ProfitMargin { get; set; }
    public decimal AverageProjectValue { get; set; }

    // Métricas de Equipe
    public int TotalEmployees { get; set; }
    public int AllocatedEmployees { get; set; }

    // Métricas Mensais
    public int ExpensesCountThisMonth { get; set; }

    // Metadados
    public DateTime LastUpdated { get; set; }
}

// ✅ PROJETOS POR STATUS
public class ProjectStatusSummaryDto
{
    public int Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal TotalValue { get; set; }
}

// ✅ DESPESAS MENSAIS
public class MonthlyExpenseDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public string MonthName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public int ExpenseCount { get; set; }
}

// ✅ TOP PROJETOS
public class TopProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Contractor { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public int Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public decimal TotalContractsValue { get; set; }
    public decimal TotalExpensesValue { get; set; }
    public decimal ProfitMargin { get; set; }
}

// ✅ ATIVIDADES RECENTES EXPANDIDAS
public class RecentActivityDto
{
    public string ActivityType { get; set; } = string.Empty; 
    public string Description { get; set; } = string.Empty;
    public DateTime ActivityDate { get; set; }
    public decimal? Amount { get; set; }
    public Guid RelatedId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string ProjectContractor { get; set; } = string.Empty;
}

// ✅ ALERTAS DO DASHBOARD
public class DashboardAlertDto
{
    public string Type { get; set; } = string.Empty; // "info", "warning", "error", "success"
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}