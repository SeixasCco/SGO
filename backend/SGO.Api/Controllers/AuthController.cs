using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SGO.Api.Dtos;
using SGO.Core;
using SGO.Infrastructure;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]   
    public class AuthController : ControllerBase
    {
        private readonly SgoDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(SgoDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public ActionResult<TokenDto> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto.Username != "admin" || loginDto.Password != "sgo2025")
            {
                return Unauthorized("Usuário ou senha inválidos.");
            }

            var userCompanyId = "00000000-0000-0000-0000-000000000001";

            var token = GenerateJwtToken(loginDto.Username, userCompanyId);
            return Ok(new TokenDto { AccessToken = token });
        }

        private string GenerateJwtToken(string username, string companyId)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? throw new InvalidOperationException("Chave JWT não configurada em appsettings.json");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim("companyId", companyId),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(8), // Duração do token
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}