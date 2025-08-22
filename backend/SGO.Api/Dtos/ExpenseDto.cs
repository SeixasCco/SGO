namespace SGO.Api.Dtos;
using System.ComponentModel.DataAnnotations;

public class UpdateExpenseDto
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public Guid ContractId { get; set; }
    public Guid CostCenterId { get; set; }
    public string Description { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "O valor da despesa não pode ser negativo.")]
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? AttachmentPath { get; set; }
    
    [Range(0, int.MaxValue, ErrorMessage = "O número de pessoas não pode ser negativo.")] 
    public int? NumberOfPeople { get; set; }
}