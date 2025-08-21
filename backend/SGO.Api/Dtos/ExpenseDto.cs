namespace SGO.Api.Dtos;

public class UpdateExpenseDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public Guid ContractId { get; set; }
    public Guid CostCenterId { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? AttachmentPath { get; set; }
}