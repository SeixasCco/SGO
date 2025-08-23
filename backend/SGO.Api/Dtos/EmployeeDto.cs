namespace SGO.Api.Dtos
{
    // ✅ DTO PARA RETORNO DE FUNCIONÁRIO
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

    // ✅ DTO PARA CRIAÇÃO DE FUNCIONÁRIO
    public class CreateEmployeeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public decimal Salary { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    // ✅ DTO PARA ATUALIZAÇÃO DE FUNCIONÁRIO
    public class UpdateEmployeeDto
    {
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public decimal Salary { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsActive { get; set; }
    }
    
    public class AddTeamMemberDto
    {
        public DateTime StartDate { get; set; }
    }
}