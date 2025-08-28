using System.ComponentModel.DataAnnotations;

namespace SGO.Core
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public required string Username { get; set; }

        [Required]
        public required string PasswordHash { get; set; } 

        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = default!;
    }
}