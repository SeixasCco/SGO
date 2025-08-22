namespace SGO.Core;

public class ProjectEmployee
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;

    public Guid EmployeeId { get; set; }
    public Employee Employee { get; set; } = default!;
}