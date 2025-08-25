using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.API.DTOs;
using SGO.Core;
using SGO.Infrastructure;

namespace SGO.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractInvoicesController : ControllerBase
{
    private readonly SgoDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ContractInvoicesController> _logger;

    public ContractInvoicesController(
        SgoDbContext context,
        IWebHostEnvironment environment,
        ILogger<ContractInvoicesController> logger)
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    [HttpGet("by-contract/{contractId}")]
    public async Task<ActionResult<IEnumerable<ContractInvoiceResponseDto>>> GetByContract(Guid contractId)
    {
        var invoices = await _context.ContractInvoices
            .Where(ci => ci.ContractId == contractId)
            .OrderByDescending(ci => ci.IssueDate)
            .ThenByDescending(ci => ci.PaymentDate)
            .ToListAsync();

        var response = invoices.Select(invoice => new ContractInvoiceResponseDto
        {
            Id = invoice.Id,
            IssueDate = invoice.IssueDate,
            InvoiceNumber = invoice.InvoiceNumber,
            GrossValue = invoice.GrossValue,
            IssValue = invoice.IssValue,
            InssValue = invoice.InssValue,
            NetValue = invoice.NetValue,
            PaymentDate = invoice.PaymentDate,
            AttachmentPath = invoice.AttachmentPath,
            ContractId = invoice.ContractId
        });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ContractInvoiceResponseDto>> GetById(Guid id)
    {
        var invoice = await _context.ContractInvoices.FindAsync(id);

        if (invoice == null)
            return NotFound();

        var response = new ContractInvoiceResponseDto
        {
            Id = invoice.Id,
            IssueDate = invoice.IssueDate,
            InvoiceNumber = invoice.InvoiceNumber,
            GrossValue = invoice.GrossValue,
            IssValue = invoice.IssValue,
            InssValue = invoice.InssValue,
            NetValue = invoice.NetValue,
            PaymentDate = invoice.PaymentDate,
            AttachmentPath = invoice.AttachmentPath,
            ContractId = invoice.ContractId
        };

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ContractInvoiceResponseDto>> Create([FromForm] ContractInvoiceWithFileDto dto)
    {
        if (!dto.IsNetValueValid)
        {
            return BadRequest("O valor líquido não pode ser negativo. Verifique os valores de ISS e INSS.");
        }

        var contractExists = await _context.Contracts.AnyAsync(c => c.Id == dto.ContractId);
        if (!contractExists)
        {
            return BadRequest("Contrato não encontrado.");
        }

        var duplicateExists = await _context.ContractInvoices
            .AnyAsync(ci => ci.ContractId == dto.ContractId && ci.InvoiceNumber == dto.InvoiceNumber);
        
        if (duplicateExists)
        {
            return BadRequest($"Já existe uma nota fiscal com o número {dto.InvoiceNumber} para este contrato.");
        }

        var invoice = new ContractInvoice
        {
            Id = Guid.NewGuid(),
            IssueDate = dto.GetIssueDateUtc(),
            InvoiceNumber = dto.InvoiceNumber,
            GrossValue = dto.GrossValue,
            IssValue = dto.IssValue,
            InssValue = dto.InssValue,
            PaymentDate = dto.GetPaymentDateUtc(),
            ContractId = dto.ContractId
        };

        invoice.CalculateNetValue();

        if (dto.Attachment != null && dto.Attachment.Length > 0)
        {
            try
            {
                var fileName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{dto.InvoiceNumber}_{dto.Attachment.FileName}";
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads");
                
                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

                var filePath = Path.Combine(uploadsPath, fileName);
                
                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Attachment.CopyToAsync(stream);
                
                invoice.AttachmentPath = fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao salvar anexo da nota fiscal");
                return BadRequest("Erro ao processar o anexo. Tente novamente.");
            }
        }

        _context.ContractInvoices.Add(invoice);
        await _context.SaveChangesAsync();

        var response = new ContractInvoiceResponseDto
        {
            Id = invoice.Id,
            IssueDate = invoice.IssueDate,
            InvoiceNumber = invoice.InvoiceNumber,
            GrossValue = invoice.GrossValue,
            IssValue = invoice.IssValue,
            InssValue = invoice.InssValue,
            NetValue = invoice.NetValue,
            PaymentDate = invoice.PaymentDate,
            AttachmentPath = invoice.AttachmentPath,
            ContractId = invoice.ContractId
        };

        return CreatedAtAction(nameof(GetById), new { id = invoice.Id }, response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromForm] ContractInvoiceWithFileDto dto)
    {
        var invoice = await _context.ContractInvoices.FindAsync(id);
        if (invoice == null)
            return NotFound();

        if (!dto.IsNetValueValid)
        {
            return BadRequest("O valor líquido não pode ser negativo. Verifique os valores de ISS e INSS.");
        }

        var duplicateExists = await _context.ContractInvoices
            .AnyAsync(ci => ci.ContractId == dto.ContractId && 
                          ci.InvoiceNumber == dto.InvoiceNumber && 
                          ci.Id != id);
        
        if (duplicateExists)
        {
            return BadRequest($"Já existe outra nota fiscal com o número {dto.InvoiceNumber} para este contrato.");
        }

        invoice.IssueDate = dto.GetIssueDateUtc();
        invoice.InvoiceNumber = dto.InvoiceNumber;
        invoice.GrossValue = dto.GrossValue;
        invoice.IssValue = dto.IssValue;
        invoice.InssValue = dto.InssValue;
        invoice.PaymentDate = dto.GetPaymentDateUtc();

        invoice.CalculateNetValue();

        if (dto.Attachment != null && dto.Attachment.Length > 0)
        {
            try
            {
                if (!string.IsNullOrEmpty(invoice.AttachmentPath))
                {
                    var oldFilePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", invoice.AttachmentPath);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                var fileName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{dto.InvoiceNumber}_{dto.Attachment.FileName}";
                var uploadsPath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads");
                
                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

                var filePath = Path.Combine(uploadsPath, fileName);
                
                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Attachment.CopyToAsync(stream);
                
                invoice.AttachmentPath = fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao salvar anexo da nota fiscal");
                return BadRequest("Erro ao processar o anexo. Tente novamente.");
            }
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var invoice = await _context.ContractInvoices.FindAsync(id);
        if (invoice == null)
            return NotFound();

        if (!string.IsNullOrEmpty(invoice.AttachmentPath))
        {
            try
            {
                var filePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", invoice.AttachmentPath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Erro ao deletar arquivo anexado da nota fiscal {InvoiceId}", id);
            }
        }

        _context.ContractInvoices.Remove(invoice);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}/attachment")]
    public async Task<IActionResult> DownloadAttachment(Guid id)
    {
        var invoice = await _context.ContractInvoices.FindAsync(id);
        if (invoice == null)
            return NotFound();

        if (string.IsNullOrEmpty(invoice.AttachmentPath))
            return NotFound("Esta nota fiscal não possui anexo.");

        var filePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", invoice.AttachmentPath);
        
        if (!System.IO.File.Exists(filePath))
            return NotFound("Arquivo anexado não encontrado.");

        var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        var fileName = $"NF_{invoice.InvoiceNumber}_{Path.GetFileName(invoice.AttachmentPath)}";

        return File(fileBytes, "application/octet-stream", fileName);
    }

    [HttpGet("attachment/{fileName}")]
    public async Task<IActionResult> ViewAttachment(string fileName)
    {
        var filePath = Path.Combine(_environment.WebRootPath ?? _environment.ContentRootPath, "uploads", fileName);
        
        if (!System.IO.File.Exists(filePath))
            return NotFound("Arquivo não encontrado.");

        var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        var extension = Path.GetExtension(fileName).ToLowerInvariant();        
      
        var contentType = extension switch
        {
            ".pdf" => "application/pdf",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".doc" => "application/msword",
            ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ".txt" => "text/plain",
            _ => "application/octet-stream"
        };

        // Para PDFs e imagens, exibir inline. Para outros, forçar download
        if (contentType.StartsWith("image/") || contentType == "application/pdf" || contentType == "text/plain")
        {
            Response.Headers.Append("Content-Disposition", $"inline; filename=\"{Path.GetFileName(fileName)}\"");
        }
        else
        {
            Response.Headers.Append("Content-Disposition", $"attachment; filename=\"{Path.GetFileName(fileName)}\"");
        }

        return File(fileBytes, contentType);
    }

    [HttpGet("by-contract/{contractId}/stats")]
    public async Task<ActionResult<object>> GetContractInvoiceStats(Guid contractId)
    {
        var invoices = await _context.ContractInvoices
            .Where(ci => ci.ContractId == contractId)
            .ToListAsync();

        if (!invoices.Any())
        {
            return Ok(new
            {
                TotalInvoices = 0,
                TotalGrossValue = 0m,
                TotalIssValue = 0m,
                TotalInssValue = 0m,
                TotalNetValue = 0m,
                AverageNetValue = 0m
            });
        }

        var stats = new
        {
            TotalInvoices = invoices.Count,
            TotalGrossValue = invoices.Sum(i => i.GrossValue),
            TotalIssValue = invoices.Sum(i => i.IssValue),
            TotalInssValue = invoices.Sum(i => i.InssValue),
            TotalNetValue = invoices.Sum(i => i.NetValue),
            AverageNetValue = invoices.Average(i => i.NetValue)
        };

        return Ok(stats);
    }

    [HttpGet("validate-number/{contractId}/{invoiceNumber}")]
    public async Task<ActionResult<object>> ValidateInvoiceNumber(Guid contractId, string invoiceNumber, [FromQuery] Guid? excludeId = null)
    {
        var query = _context.ContractInvoices
            .Where(ci => ci.ContractId == contractId && ci.InvoiceNumber == invoiceNumber);

        if (excludeId.HasValue)
        {
            query = query.Where(ci => ci.Id != excludeId.Value);
        }

        var exists = await query.AnyAsync();

        return Ok(new { exists, message = exists ? "Número de NF já existe para este contrato" : "Número disponível" });
    }

    [HttpGet("by-contract/{contractId}/report")]
    public async Task<ActionResult<object>> GetContractReport(Guid contractId)
    {
        var contract = await _context.Contracts
            .Include(c => c.Project)
            .FirstOrDefaultAsync(c => c.Id == contractId);

        if (contract == null)
            return NotFound("Contrato não encontrado.");

        var invoices = await _context.ContractInvoices
            .Where(ci => ci.ContractId == contractId)
            .OrderBy(ci => ci.IssueDate)
            .ToListAsync();

        var report = new
        {
            Contract = new
            {
                contract.Id,
                contract.ContractNumber,
                contract.Title,
                contract.TotalValue,
                Project = contract.Project?.Name
            },
            Summary = new
            {
                TotalInvoices = invoices.Count,
                TotalGrossValue = invoices.Sum(i => i.GrossValue),
                TotalIssValue = invoices.Sum(i => i.IssValue),
                TotalInssValue = invoices.Sum(i => i.InssValue),
                TotalNetValue = invoices.Sum(i => i.NetValue),
                PercentageExecuted = contract.TotalValue > 0 ? 
                    (invoices.Sum(i => i.NetValue) / contract.TotalValue * 100) : 0,
                PendingValue = contract.TotalValue - invoices.Sum(i => i.NetValue)
            },
            Invoices = invoices.Select(invoice => new ContractInvoiceResponseDto
            {
                Id = invoice.Id,
                IssueDate = invoice.IssueDate,
                InvoiceNumber = invoice.InvoiceNumber,
                GrossValue = invoice.GrossValue,
                IssValue = invoice.IssValue,
                InssValue = invoice.InssValue,
                NetValue = invoice.NetValue,
                PaymentDate = invoice.PaymentDate,
                AttachmentPath = invoice.AttachmentPath,
                ContractId = invoice.ContractId
            }).ToList()
        };

        return Ok(report);
    }

    [HttpPost("maintenance/fix-net-values")]
    public async Task<ActionResult<object>> FixNetValues()
    {
        var invoices = await _context.ContractInvoices
            .Where(ci => ci.NetValue != (ci.GrossValue - ci.IssValue - ci.InssValue))
            .ToListAsync();

        var fixedCount = 0;
        foreach (var invoice in invoices)
        {
            invoice.CalculateNetValue();
            fixedCount++;
        }

        if (fixedCount > 0)
        {
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            FixedCount = fixedCount,
            Message = $"{fixedCount} nota(s) fiscal(is) corrigida(s)",
            FixedAt = DateTime.UtcNow
        });
    }
}