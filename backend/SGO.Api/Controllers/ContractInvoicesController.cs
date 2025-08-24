using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Core;
using SGO.Infrastructure;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SGO.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractInvoicesController : ControllerBase
    {
        private readonly SgoDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ContractInvoicesController(SgoDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/contractinvoices/by-contract/{contractId}
        [HttpGet("by-contract/{contractId}")]
        public async Task<ActionResult<IEnumerable<ContractInvoice>>> GetInvoicesByContract(Guid contractId)
        {
            return await _context.ContractInvoices
                                 .Where(i => i.ContractId == contractId)
                                 .OrderByDescending(i => i.DepositDate)
                                 .ToListAsync();
        }

        // POST: api/contractinvoices
        [HttpPost]
        public async Task<ActionResult<ContractInvoice>> PostContractInvoice([FromForm] ContractInvoiceDto invoiceDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var contract = await _context.Contracts.FindAsync(invoiceDto.ContractId);
            if (contract == null)
            {
                return NotFound("Contrato não encontrado.");
            }

            var invoice = new ContractInvoice
            {
                Id = Guid.NewGuid(),
                Title = invoiceDto.Title,
                GrossValue = invoiceDto.GrossValue,
                DeductionsValue = invoiceDto.DeductionsValue,
                NetValue = invoiceDto.GrossValue - invoiceDto.DeductionsValue,
                DepositDate = DateTime.SpecifyKind(invoiceDto.DepositDate, DateTimeKind.Utc),
                ContractId = invoiceDto.ContractId
            };

            if (invoiceDto.Attachment != null)
            {
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Attachments");
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + invoiceDto.Attachment.FileName;
                var filePath = Path.Combine(uploadsDir, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await invoiceDto.Attachment.CopyToAsync(fileStream);
                }
                invoice.AttachmentPath = uniqueFileName;
            }

            _context.ContractInvoices.Add(invoice);
            await _context.SaveChangesAsync();

            var responseDto = new ContractInvoiceResponseDto
            {
                Id = invoice.Id,
                Title = invoice.Title,
                GrossValue = invoice.GrossValue,
                DeductionsValue = invoice.DeductionsValue,
                NetValue = invoice.NetValue,
                DepositDate = invoice.DepositDate,
                AttachmentPath = invoice.AttachmentPath,
                ContractId = invoice.ContractId
            };

            return CreatedAtAction(nameof(GetInvoicesByContract), new { contractId = responseDto.ContractId }, responseDto);
        }


        // PUT: api/contractinvoices/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContractInvoice(Guid id, [FromForm] ContractInvoiceDto invoiceDto)
        {
            var invoice = await _context.ContractInvoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }
            
            invoice.Title = invoiceDto.Title;
            invoice.GrossValue = invoiceDto.GrossValue;
            invoice.DeductionsValue = invoiceDto.DeductionsValue;
            invoice.NetValue = invoiceDto.GrossValue - invoiceDto.DeductionsValue; 
            invoice.DepositDate = DateTime.SpecifyKind(invoiceDto.DepositDate, DateTimeKind.Utc);
           
            if (invoiceDto.Attachment != null)
            {                
                if (!string.IsNullOrEmpty(invoice.AttachmentPath))
                {
                    var oldFilePath = Path.Combine(_env.ContentRootPath, "Attachments", invoice.AttachmentPath);
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }
               
                var uploadsDir = Path.Combine(_env.ContentRootPath, "Attachments");
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + invoiceDto.Attachment.FileName;
                var newFilePath = Path.Combine(uploadsDir, uniqueFileName);

                using (var fileStream = new FileStream(newFilePath, FileMode.Create))
                {
                    await invoiceDto.Attachment.CopyToAsync(fileStream);
                }
                invoice.AttachmentPath = uniqueFileName; 
            }

            _context.Entry(invoice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.ContractInvoices.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); 
        }

        // DELETE: api/contractinvoices/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContractInvoice(Guid id)
        {
            var invoice = await _context.ContractInvoices.FindAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(invoice.AttachmentPath))
            {
                var filePath = Path.Combine(_env.ContentRootPath, "Attachments", invoice.AttachmentPath);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.ContractInvoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class ContractInvoiceDto
    {
        [Required]
        public string Title { get; set; } = default!;

        [Required]
        public decimal GrossValue { get; set; }
        public decimal DeductionsValue { get; set; }
        [Required]
        public DateTime DepositDate { get; set; }
        [Required]
        public Guid ContractId { get; set; }
        public IFormFile? Attachment { get; set; }
    }

    public class ContractInvoiceResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = default!;
        public decimal GrossValue { get; set; }
        public decimal DeductionsValue { get; set; }
        public decimal NetValue { get; set; }
        public DateTime DepositDate { get; set; }
        public string? AttachmentPath { get; set; }
        public Guid ContractId { get; set; }
    }
}