using System.ComponentModel.DataAnnotations;

namespace SGO.Api.Dtos
{
    public class LoginDto
    {
        [Required]
        public required string Username { get; set; }

        [Required]
        public required string Password { get; set; }
    }

    public class TokenDto
    {
        public required string AccessToken { get; set; }
    }
}