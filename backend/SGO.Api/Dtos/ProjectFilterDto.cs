namespace SGO.Api.Dtos;

public class ProjectFilterDto
{
    public string? City { get; set; }
    public string? ServiceTaker { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Status { get; set; } 
    public Guid? CompanyId { get; set; }
}