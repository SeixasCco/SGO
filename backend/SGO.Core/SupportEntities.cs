using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SGO.Core;

// --- Enums de Suporte ---

public enum ContractStatus
{
    Draft = 1,      // Rascunho
    Active = 2,     // Ativo
    Completed = 3,  // Concluído
    Cancelled = 4   // Cancelado
}

public enum ExpenseStatus
{
    Pending = 1,    // Pendente
    Approved = 2,   // Aprovada
    Paid = 3,       // Paga
    Rejected = 4    // Rejeitada
}

public class ContractInvoice
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = default!;

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal GrossValue { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DeductionsValue { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal NetValue { get; set; }

    [Required]
    public DateTime DepositDate { get; set; }

   public string? AttachmentPath { get; set; }
   
    public Guid ContractId { get; set; }  

    [ForeignKey("ContractId")]
    public virtual Contract Contract { get; set; } = default!;
}

public class ExpenseAttachment
{
    public Guid Id { get; set; }
    public Guid ProjectExpenseId { get; set; }
    public string FileName { get; set; } = default!;
    public string StoredPath { get; set; } = default!;
    public DateTime UploadedAt { get; set; }
}