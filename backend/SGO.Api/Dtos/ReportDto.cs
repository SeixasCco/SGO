namespace SGO.Api.Dtos;

public class ExpenseReportFilterDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public List<Guid>? ProjectIds { get; set; } 
}

public class ExpenseReportItemDto
{
    public string Data { get; set; } = string.Empty;
    public string Obra { get; set; } = string.Empty;
    public string CentroDeCusto { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Anexo { get; set; } = string.Empty;
}