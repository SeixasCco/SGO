using SGO.Core;

namespace SGO.Core;

public class Project
{
    public Project()
    {
        Contracts = new HashSet<Contract>();
        Expenses = new HashSet<ProjectExpense>();
    }

    public Guid Id { get; set; }
    public Guid CompanyId { get; set; }
    public string CNO { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Contractor { get; set; } = default!;
    public string City { get; set; } = default!;
    public string State { get; set; } = default!;
    public ProjectStatus Status { get; set; }

    public DateTime StartDate { get; set; }
   
    public DateTime? EndDate { get; set; }
    public string? Address { get; set; }
   
    public string? Description { get; set; }
   
    public bool IsAdditive { get; set; }
   
    public Guid? OriginalProjectId { get; set; }
   
    public ICollection<Contract> Contracts { get; set; }
    
    public ICollection<ProjectExpense> Expenses { get; set; }
    
}

public enum ProjectStatus
{
    Planning = 1,
    Active = 2,
    OnHold = 3,
    Completed = 4,
    Additive = 5,
    Cancelled = 6
}