
using System.ComponentModel.DataAnnotations;

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
        
        public ICollection<ProjectEmployee> ProjectEmployees { get; set; } = new List<ProjectEmployee>();
    }
}