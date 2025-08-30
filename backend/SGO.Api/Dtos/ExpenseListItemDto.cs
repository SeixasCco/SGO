namespace SGO.Api.Dtos;

public class ExpenseListItemDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public required string CostCenterName { get; set; }
    public decimal Amount { get; set; }
    public bool HasAttachment { get; set; }
    public string? AttachmentPath { get; set; }
    public bool IsVirtual { get; set; }
    public string? DetailsJson { get; set; }
    public string? ProjectIdentifier { get; set; }
    public string? Observations { get; set; } 
}