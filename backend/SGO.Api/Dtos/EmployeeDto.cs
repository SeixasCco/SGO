namespace SGO.Api.Dtos;

public class UpdateEmployeeDto
{
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public DateTime HireDate { get; set; }
}