// Local: SGO.Api/Controllers/AttachmentsController.cs
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.StaticFiles; // Adicione este using

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttachmentsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;         
        public AttachmentsController(IWebHostEnvironment env)
        {
            _env = env;
        }
      
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Nenhum arquivo enviado.");            
            
            var uploadsFolderPath = Path.Combine(_env.ContentRootPath, "uploads");
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
                
        [HttpGet("{fileName}")]
        public IActionResult GetAttachment(string fileName)
        {           
            var filePath = Path.Combine(_env.ContentRootPath, "Attachments", fileName);

            if (!System.IO.File.Exists(filePath))
            {                
                filePath = Path.Combine(_env.ContentRootPath, "uploads", fileName);
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("Arquivo não encontrado.");
                }
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            new FileExtensionContentTypeProvider().TryGetContentType(fileName, out var contentType);
            
            return File(fileBytes, contentType ?? "application/octet-stream", fileName);
        }
    }
}