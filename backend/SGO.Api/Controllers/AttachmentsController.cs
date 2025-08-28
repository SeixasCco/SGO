using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
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

            const long maxFileSize = 5 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                return BadRequest("O arquivo é muito grande. O tamanho máximo permitido é de 5 MB.");
            }
           
            var allowedMimeTypes = new[] { "image/jpeg", "image/png", "application/pdf", "image/webp", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
            if (!allowedMimeTypes.Contains(file.ContentType.ToLower()))
            {
                return BadRequest("Tipo de arquivo inválido. Apenas imagens, PDFs e documentos do Word são permitidos.");
            }
          

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
            
            return Ok(new { filePath = fileName });
        }

        [HttpGet("{fileName}")]
        [AllowAnonymous]
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