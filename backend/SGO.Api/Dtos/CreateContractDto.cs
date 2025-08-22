using System;
using System.ComponentModel.DataAnnotations;

namespace SGO.Api.Dtos
{
    public class CreateContractDto
    {
        public Guid ProjectId { get; set; }
        public string ContractNumber { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;

        [Range(0, double.MaxValue, ErrorMessage = "O valor total do contrato não pode ser negativo.")]
        public decimal TotalValue { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}

