using Chelsea.Repository;
using ChelseaApp.DocHelper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
        private readonly AppConfig _appSetting;
        public GlobalController(ChelseaContext context, IOptions<AppConfig> appSettings)
        {
            _context = context;
            _appSetting = appSettings.Value;
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
        [HttpGet("con")]
        public  ActionResult GetConfiguration()
        {
            return Ok(_appSetting.AzureAd);
        }
    }
}
