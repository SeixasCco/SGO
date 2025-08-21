using System;

namespace SGO.Api.Dtos
{
    public class CreateExpenseDto
    {
        public Guid ProjectId { get; set; }
        public Guid ContractId { get; set; }
        public string Description { get; set; } = default!;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string CostCenterName { get; set; } = default!;
        public string? Observations { get; set; }
        public string? SupplierName { get; set; }
        public string? InvoiceNumber { get; set; }
        public string? AttachmentPath { get; set; }
    }
}