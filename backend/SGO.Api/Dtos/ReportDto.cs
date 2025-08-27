namespace SGO.Api.Dtos;

public class ExpenseReportFilterDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<Guid>? ProjectIds { get; set; }
}

public class ExpenseReportItemDto
{
    public DateTime Date { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string CostCenterName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? AttachmentPath { get; set; }
}

public class ReportResultDto
{
    public List<ExpenseReportItemDto> DetailedExpenses { get; set; } = new();
    public ReportSummaryDto Summary { get; set; } = new();
}

public class ReportSummaryDto
{
    public decimal TotalExpenses { get; set; }
    public int TotalRecords { get; set; }
    public decimal AverageExpense { get; set; }
    public Dictionary<string, decimal> ByProject { get; set; } = new();
}
