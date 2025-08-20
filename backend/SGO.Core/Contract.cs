using SGO.Core;

namespace SGO.Core;

public class Contract
{
    public Contract()
    {
        Expenses = new HashSet<ProjectExpense>();
        Invoices = new HashSet<ContractInvoice>();
    }

    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public Guid ProjectId { get; set; }
    public string ContractNumber { get; set; } = default!;
    public string Title { get; set; } = default!;
    public decimal TotalValue { get; set; }
    public ContractStatus Status { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? SignedDate { get; set; }
    public Project Project { get; set; } = default!;
    public ICollection<ProjectExpense> Expenses { get; set; }
    public ICollection<ContractInvoice> Invoices { get; set; }
}