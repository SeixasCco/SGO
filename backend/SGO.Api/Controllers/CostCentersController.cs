using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SGO.Core;
using SGO.Infrastructure;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGO.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CostCentersController : ControllerBase
    {
        private readonly SgoDbContext _context;

        public CostCentersController(SgoDbContext context)
        {
            _context = context;
        }

        // GET: api/costcenters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CostCenter>>> GetAllCostCenters()
        {
            var costCenters = await _context.CostCenters.OrderBy(c => c.Name).ToListAsync();
            return Ok(costCenters);
        }
    }
}