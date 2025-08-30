using SGO.Core;
using System.Collections.Generic;
using System;
using System.ComponentModel.DataAnnotations;

namespace SGO.Api.Dtos;

public class ProjectDetailsDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public ProjectStatus Status { get; set; } 
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? Description { get; set; }
        public bool IsAdditive { get; set; }
        public Guid? OriginalProjectId { get; set; }
        public string Responsible { get; set; } = string.Empty;
        public string Contractor { get; set; } = string.Empty;
        public string ServiceTaker { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string? CNO { get; set; }

        public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
        public ICollection<ExpenseListItemDto> Expenses { get; set; } = new List<ExpenseListItemDto>(); 
    }

public class ContractDto
{
    public Guid Id { get; set; }
    public string ContractNumber { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "O valor total do contrato não pode ser negativo.")]
    public decimal TotalValue { get; set; }
}

public class UpdateContractDto
{
    public string ContractNumber { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;

    [Range(0, double.MaxValue, ErrorMessage = "O valor total do contrato não pode ser negativo.")]
    public decimal TotalValue { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Observations { get; set; }
}

public class ContractSummaryDto
{
    public Guid Id { get; set; }
    public string ContractNumber { get; set; } = string.Empty;
    public decimal TotalValue { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }

}

public class UpdateProjectDto
    {
        public Guid Id { get; set; } // Campo adicionado
        public string Name { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public string? CNO { get; set; }
        public string Contractor { get; set; } = string.Empty;
        public string ServiceTaker { get; set; } = string.Empty;
        public string Responsible { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public ProjectStatus Status { get; set; } 
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }
        public bool IsAdditive { get; set; } 
        public Guid? OriginalProjectId { get; set; } 
        
        [Required(ErrorMessage = "A matriz (CompanyId) é obrigatória.")]
        public int CompanyId { get; set; }
    }

public class ExpenseDto
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string CostCenterName { get; set; } = string.Empty;
    public string? AttachmentPath { get; set; }

    public bool IsVirtual { get; set; }
}


public class ProjectSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Contractor { get; set; } = string.Empty;

    public string Cnpj { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string CNO { get; set; } = string.Empty;

    public string Responsible { get; set; } = string.Empty;
    public int Status { get; set; }
    public string StatusText { get; set; } = string.Empty;
    public int TeamSize { get; set; }
    public decimal TotalContractsValue { get; set; }
    public decimal TotalExpensesValue { get; set; }
}

public class CreateProjectDto
    {
        public string Name { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;
        public string? CNO { get; set; }
        public string Contractor { get; set; } = string.Empty;
        public string ServiceTaker { get; set; } = string.Empty;
        public string Responsible { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public ProjectStatus Status { get; set; } 
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Address { get; set; }
        public string? Description { get; set; }
        public bool IsAdditive { get; set; } 
        public Guid? OriginalProjectId { get; set; } 

        [Required(ErrorMessage = "A matriz (CompanyId) é obrigatória.")]
        public int CompanyId { get; set; }
    }