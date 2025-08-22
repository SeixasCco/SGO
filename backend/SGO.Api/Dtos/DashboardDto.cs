namespace SGO.Api.Dtos;

public class RecentActivityDto
{
    public string ActivityType { get; set; } = string.Empty; 
    public string Description { get; set; } = string.Empty;
    public DateTime ActivityDate { get; set; }
    public decimal? Amount { get; set; }
    public Guid RelatedId { get; set; } 
}