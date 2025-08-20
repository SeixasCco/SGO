using System;

namespace SGO.Api.Dtos
{
    public class CreateContractDto
    {
        public Guid ProjectId { get; set; }
        public string ContractNumber { get; set; } = default!;
        public string Title { get; set; } = default!;
        public decimal TotalValue { get; set; }
    }
}