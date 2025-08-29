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
    public string MainDescription { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? AttachmentPath { get; set; }  
   
    public string? Observations { get; set; }
    public string? SupplierName { get; set; }
    public string? InvoiceNumber { get; set; }
    public string? DetailsJson { get; set; }
    public string FormattedDetails { get; set; } = string.Empty;
}

public class ReportResultDto
{
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyCnpj { get; set; } = string.Empty;
    public DateTime? FilterStartDate { get; set; }
    public DateTime? FilterEndDate { get; set; }
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
    public List<ExpenseReportItemDto> DetailedExpenses { get; set; } = new();
    public ReportSummaryDto Summary { get; set; } = new();
}

public class ReportSummaryDto
{
    public decimal TotalExpenses { get; set; }
    public int TotalRecords { get; set; }
    public decimal AverageExpense { get; set; }
    public Dictionary<string, decimal> ByProject { get; set; } = new();
    public Dictionary<string, decimal> ByCostCenter { get; set; } = new();
}