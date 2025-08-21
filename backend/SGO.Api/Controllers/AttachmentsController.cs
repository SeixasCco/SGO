// Local: SGO.Api/Controllers/AttachmentsController.cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttachmentsController : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");
            
            var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }
           
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
           
            var fileAccessPath = $"/uploads/{fileName}";
            return Ok(new { filePath = fileAccessPath });
        }
    }
}