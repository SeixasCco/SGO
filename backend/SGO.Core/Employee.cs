using System;

namespace SGO.Core
{
    public class Employee
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty; 
        public DateTime HireDate { get; set; } 
        public bool IsActive { get; set; } = true;
        public Guid CompanyId { get; set; } 
    }
}