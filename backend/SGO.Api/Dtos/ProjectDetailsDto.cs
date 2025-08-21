// Local: SGO.Api/Dtos/ProjectDetailsDto.cs
namespace SGO.Api.Dtos;

public class ProjectDetailsDto
{
    public Guid Id { get; set; }
    public string CNO { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Contractor { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    
    public List<ContractDto> Contracts { get; set; } = new();
    public List<ExpenseDto> Expenses { get; set; } = new();
}

public class ContractDto
{
    public Guid Id { get; set; }
    public string ContractNumber { get; set; } = string.Empty;
    public decimal TotalValue { get; set; }
}

public class ExpenseDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string CostCenterName { get; set; } = string.Empty;

    public string? AttachmentPath { get; set; }
}

public class UpdateProjectDto
{
    public string Name { get; set; } = string.Empty;
    public string Contractor { get; set; } = string.Empty;
    public string CNO { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? Description { get; set; }
    public int Status { get; set; }
}

public class UpdateContractDto
{
    public string ContractNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public decimal TotalValue { get; set; }
}