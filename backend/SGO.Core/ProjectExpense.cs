using SGO.Core;

namespace SGO.Core;

public class ProjectExpense
{
    public ProjectExpense()
    {
        Attachments = new HashSet<ExpenseAttachment>();
    }

    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public Guid ProjectId { get; set; }
    public Guid ContractId { get; set; }
    public string Description { get; set; } = default!;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public Guid CostCenterId { get; set; }
    public CostCenter CostCenter { get; set; } = default!;
    public string? Observations { get; set; }
    public string? SupplierName { get; set; }
    public string? InvoiceNumber { get; set; }
    public ExpenseStatus Status { get; set; }
    public DateTime? PaymentDate { get; set; }
    public string? AttachmentPath { get; set; }    
    public Project Project { get; set; } = default!;
    public Contract Contract { get; set; } = default!;
    public ICollection<ExpenseAttachment> Attachments { get; set; }
    
}