using System;
using System.ComponentModel.DataAnnotations;

namespace SGO.Api.Dtos
{
    public class CreateExpenseDto
    {
        public Guid? ProjectId { get; set; }
        public Guid? ContractId { get; set; }
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

        [Range(0, int.MaxValue, ErrorMessage = "O número de pessoas não pode ser negativo.")]
        public int? NumberOfPeople { get; set; }
    }
}