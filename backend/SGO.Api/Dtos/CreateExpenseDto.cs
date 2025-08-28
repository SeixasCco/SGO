using System;
using System.ComponentModel.DataAnnotations;
using SGO.Core;

namespace SGO.Api.Dtos
{
    public class CreateExpenseDto
    {
        public Guid? ProjectId { get; set; }
        public Guid? ContractId { get; set; }
        public Guid CompanyId { get; set; }
        public string Description { get; set; } = default!;
        [Range(0, double.MaxValue, ErrorMessage = "O valor da despesa não pode ser negativo.")]
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Guid CostCenterId { get; set; } = default!;
        public Dictionary<string, string>? Details { get; set; }
        public string? Observations { get; set; }
        public string? SupplierName { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? AttachmentPath { get; set; }           
    }

    public class ExpenseResponseDto
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
        public Guid? ProjectId { get; set; }
        public string? DetailsJson { get; set; }
        public Guid? ContractId { get; set; }
        public string Description { get; set; } = default!;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Guid CostCenterId { get; set; }
        public CostCenter CostCenter { get; set; } = default!;
        public string CostCenterName { get; set; } = default!;
        public string? Observations { get; set; }
        public string? SupplierName { get; set; }
        public string? InvoiceNumber { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? AttachmentPath { get; set; }
        public bool IsAutomaticallyCalculated { get; set; }

    }
}





