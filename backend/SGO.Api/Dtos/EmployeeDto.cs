// Local: SGO.Api/Dtos/EmployeeDto.cs
using System;
using System.ComponentModel.DataAnnotations;

namespace SGO.Api.Dtos
{
    // DTO para exibir um funcionário
    public class EmployeeDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }

    // DTO para criar um novo funcionário
    public class CreateEmployeeDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Position { get; set; } = string.Empty;
        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    // DTO para atualizar um funcionário existente
    public class UpdateEmployeeDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Position { get; set; } = string.Empty;
        [Range(0, double.MaxValue)]
        public decimal Salary { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }

    public class TeamMemberDto
    {
        public Guid EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
    }
}