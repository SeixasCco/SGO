using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {          
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new AuthResponse 
                { 
                    Success = false, 
                    Message = "Usuário e senha são obrigatórios." 
                });
            }
            
            if (!ValidateCredentials(request.Username, request.Password))
            {
                return Unauthorized(new AuthResponse 
                { 
                    Success = false, 
                    Message = "Credenciais inválidas." 
                });
            }
          
            var token = GenerateJwtToken(request.Username);

            return Ok(new AuthResponse
            {
                Success = true,
                Message = "Login realizado com sucesso.",
                Token = token,
                User = new UserInfo
                {
                    Id = 1,
                    Username = request.Username,
                    Name = "Administrador",
                    Role = "admin"
                },
                ExpiresIn = 3600
            });
        }

        [HttpPost("validate")]
        public IActionResult ValidateToken()
        {            
            var username = HttpContext.User.FindFirst(ClaimTypes.Name)?.Value;
            var role = HttpContext.User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new 
            {
                Valid = true,
                Username = username,
                Role = role,
                Message = "Token válido"
            });
        }
       
        private bool ValidateCredentials(string username, string password)
        {            
            var validUsers = new Dictionary<string, string>
            {
                { "admin", "sgo2024" },
                { "supervisor", "super2024" },
                { "operador", "oper2024" }
            };

            return validUsers.ContainsKey(username) && validUsers[username] == password;
        }
        
        private string GenerateJwtToken(string username)
        {
            var jwtKey = _configuration["Jwt:Key"];
            var jwtIssuer = _configuration["Jwt:Issuer"];
            var jwtAudience = _configuration["Jwt:Audience"];

            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key não configurada.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
          
            var role = username switch
            {
                "admin" => "admin",
                "supervisor" => "supervisor", 
                "operador" => "user",
                _ => "user"
            };

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), 
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; }
        public UserInfo? User { get; set; }
        public int ExpiresIn { get; set; }
    }

    public class UserInfo
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }
}