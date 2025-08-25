using System.ComponentModel.DataAnnotations;
using SGO.Core;

namespace SGO.API.DTOs;

public class CreateContractInvoiceDto
{
    [Required(ErrorMessage = "A data de emissão é obrigatória")]
    public DateTime IssueDate { get; set; }

    [Required(ErrorMessage = "O número da nota fiscal é obrigatório")]
    [MaxLength(50, ErrorMessage = "O número da nota fiscal deve ter no máximo 50 caracteres")]
    public string InvoiceNumber { get; set; } = default!;

    [Required(ErrorMessage = "O valor bruto é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor bruto deve ser maior que zero")]
    public decimal GrossValue { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "O valor do ISS não pode ser negativo")]
    public decimal IssValue { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "O valor do INSS não pode ser negativo")]
    public decimal InssValue { get; set; }

    [Required(ErrorMessage = "A data de pagamento é obrigatória")]
    public DateTime PaymentDate { get; set; }

    [Required(ErrorMessage = "O ID do contrato é obrigatório")]
    public Guid ContractId { get; set; }

    public bool IsNetValueValid => GrossValue - IssValue - InssValue >= 0;
   
    public DateTime GetIssueDateUtc() => DateTime.SpecifyKind(IssueDate, DateTimeKind.Utc);
    public DateTime GetPaymentDateUtc() => DateTime.SpecifyKind(PaymentDate, DateTimeKind.Utc);
}

public class UpdateContractInvoiceDto
{
    [Required(ErrorMessage = "A data de emissão é obrigatória")]
    public DateTime IssueDate { get; set; }

    [Required(ErrorMessage = "O número da nota fiscal é obrigatório")]
    [MaxLength(50, ErrorMessage = "O número da nota fiscal deve ter no máximo 50 caracteres")]
    public string InvoiceNumber { get; set; } = default!;

    [Required(ErrorMessage = "O valor bruto é obrigatório")]
    [Range(0.01, double.MaxValue, ErrorMessage = "O valor bruto deve ser maior que zero")]
    public decimal GrossValue { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "O valor do ISS não pode ser negativo")]
    public decimal IssValue { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "O valor do INSS não pode ser negativo")]
    public decimal InssValue { get; set; }

    [Required(ErrorMessage = "A data de pagamento é obrigatória")]
    public DateTime PaymentDate { get; set; }

    [Required(ErrorMessage = "O ID do contrato é obrigatório")]
    public Guid ContractId { get; set; }

    public bool IsNetValueValid => GrossValue - IssValue - InssValue >= 0;
    public DateTime GetIssueDateUtc() => DateTime.SpecifyKind(IssueDate, DateTimeKind.Utc);
    public DateTime GetPaymentDateUtc() => DateTime.SpecifyKind(PaymentDate, DateTimeKind.Utc);
}

public class ContractInvoiceResponseDto
{
    public Guid Id { get; set; }
    public DateTime IssueDate { get; set; }
    public string InvoiceNumber { get; set; } = default!;
    public decimal GrossValue { get; set; }
    public decimal IssValue { get; set; }
    public decimal InssValue { get; set; }
    public decimal NetValue { get; set; }
    public DateTime PaymentDate { get; set; }
    public InvoiceStatus Status { get; set; }
    public string StatusText => Status.ToString();
    public string FormattedInvoiceNumber => $"#{InvoiceNumber}";
    public string? AttachmentPath { get; set; }
    public Guid ContractId { get; set; }
    public decimal TotalDeductions => IssValue + InssValue;
    public bool HasAttachment => !string.IsNullOrWhiteSpace(AttachmentPath);
    public string AttachmentFileName => HasAttachment ? Path.GetFileName(AttachmentPath!) : string.Empty;
}


public class ContractInvoiceWithFileDto : CreateContractInvoiceDto
{
    public IFormFile? Attachment { get; set; }
}

