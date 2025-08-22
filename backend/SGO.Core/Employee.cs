using System;

namespace SGO.Core
{
    public class Employee
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty; 
        public decimal Salary { get; set; }
        public DateTime StartDate { get; set; } 
        public DateTime? EndDate { get; set; }   
        public bool IsActive { get; set; } = true;
        public Guid CompanyId { get; set; } 
    }
}