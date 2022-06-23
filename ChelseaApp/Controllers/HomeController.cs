using AutoMapper;
using Chelsea.Repository;
using ChelseaApp.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
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
            var dataList = await _context.vwSubmittals.ToListAsync();
            var modelList = this._mapper.Map<List<SubmittalModel>>(dataList);
            return Ok(modelList);
        }
        [HttpGet("submittal/list/{searchText}")]
        public async Task<ActionResult> Get(string searchText)
        {
            var dataList = await _context.vwSubmittals.AsQueryable().Where(t => t.FileName.Contains(searchText) || t.LastName.Contains(searchText)).ToListAsync();
            var modelList = this._mapper.Map<List<SubmittalModel>>(dataList);
            return Ok(modelList);
        }

        [HttpGet("master/data/{type}")]
        public async Task<ActionResult> GetMaster(string type)
        {
            if (type == "address")
            {
                var dataList = await _context.vwAddress.ToListAsync();
                var modelList = this._mapper.Map<List<AddressModel>>(dataList);
                return Ok(modelList);
            }
            if (type == "city")
            {
                var dataList = await _context.CityMaster.ToListAsync();
                var modelList = this._mapper.Map<List<CityMaster>>(dataList);
                return Ok(modelList);
            }
            if (type == "state")
            {
                var dataList = await _context.StateMaster.ToListAsync();
                var modelList = this._mapper.Map<List<StateModel>>(dataList);
                return Ok(modelList);
            }
            else
            {
                return Ok(string.Empty);
            }

        }
    }
}
