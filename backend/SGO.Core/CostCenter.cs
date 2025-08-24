namespace SGO.Core;

public class CostCenter
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public Guid? CompanyId { get; set; }
}