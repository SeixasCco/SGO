namespace SGO.Api.Dtos;

public class UpdateEmployeeDto
{
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
}

public class TeamMemberDto
{
    public Guid EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
}