using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SGO.Core
{
    public class Company
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public required string Name { get; set; }

        [Required]
        [MaxLength(18)]
        public required string Cnpj { get; set; }

        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}