using AutoMapper;
using Chelsea.Repository;
using ChelseaApp.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChelseaApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly ChelseaContext _context;
        private readonly IMapper _mapper;


        public HomeController(ChelseaContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("submittal/list")]
        public async Task<ActionResult> Get()
        {
            var dataList  = await _context.Submittal.ToListAsync();
            var modelList = this._mapper.Map<List<SubmittalModel>>(dataList);
            return Ok(modelList);
        }
    }
}
