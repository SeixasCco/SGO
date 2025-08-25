using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace SGO.Core
{
    public class Employee
    {
        public Guid Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Position { get; set; } = string.Empty;
        
        [Required]
        public decimal Salary { get; set; }

        [Required]
        public DateTime StartDate { get; set; } 
        public DateTime? EndDate { get; set; }  
        
        public bool IsActive { get; set; } = true;    
     
        public Guid CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Company { get; set; } = default!;   

        public ICollection<ProjectEmployee> ProjectEmployees { get; set; } = new List<ProjectEmployee>();
    }
}