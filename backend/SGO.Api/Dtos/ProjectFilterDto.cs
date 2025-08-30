using System;
using SGO.Core; 

namespace SGO.Api.Dtos
{
    public class ProjectFilterDto
    {
        public Guid? CompanyId { get; set; }        
        public string? Contractor { get; set; }
        public string? Cnpj { get; set; }
        public string? ServiceTaker { get; set; }
        public string? Cno { get; set; }
        public ProjectStatus? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}