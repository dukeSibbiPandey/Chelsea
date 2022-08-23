using Chelsea.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChelseaApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GlobalController : ControllerBase
    {
        private readonly ChelseaContext _context;
        public GlobalController(ChelseaContext context)
        {
            _context = context;
        }
        [HttpGet("customers")]
        public async Task<ActionResult> GetCustomers()
        {
            var dataList = await _context.Customers.ToListAsync();
            return Ok(dataList);
        }
        [HttpGet("projectManagers")]
        public async Task<ActionResult> GetPMs()
        {
            var dataList = await _context.PMs.ToListAsync();
            return Ok(dataList);
        }
    }
}
