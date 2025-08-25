using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SGO.Core;

public enum ContractStatus
{
    Draft = 1,      // Rascunho
    Active = 2,     // Ativo
    Completed = 3,  // Concluído
    Cancelled = 4   // Cancelado
}

public enum InvoiceStatus
{
    Valid = 1,   // Válida
    Canceled = 2 // Cancelada
}


public class ContractInvoice
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public DateTime IssueDate { get; set; }

    [Required]
    [MaxLength(50)]
    public string InvoiceNumber { get; set; } = default!;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal GrossValue { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal IssValue { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal InssValue { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal NetValue { get; set; }

    [Required]
    public DateTime PaymentDate { get; set; }

    public InvoiceStatus Status { get; set; }

    public string? AttachmentPath { get; set; } 
    public Guid ContractId { get; set; }  

    [ForeignKey("ContractId")]
    public virtual Contract Contract { get; set; } = default!;
    public void CalculateNetValue()
    {
        NetValue = GrossValue - IssValue - InssValue;
    }
    public bool IsValid => NetValue >= 0 && GrossValue > 0 && !string.IsNullOrWhiteSpace(InvoiceNumber);
    public string FormattedInvoiceNumber => $"#{InvoiceNumber}";   
    public decimal TotalDeductions => IssValue + InssValue;
    public bool HasAttachment => !string.IsNullOrWhiteSpace(AttachmentPath);
}

public class ExpenseAttachment
{
    public Guid Id { get; set; }
    public Guid ProjectExpenseId { get; set; }
    public string FileName { get; set; } = default!;
    public string StoredPath { get; set; } = default!;
    public DateTime UploadedAt { get; set; }
}

