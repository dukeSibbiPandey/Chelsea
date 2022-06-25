using AutoMapper;
using Chelsea.Repository;
using ChelseaApp.DocHelper;
using ChelseaApp.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
    public class HomeController : ControllerBase
    {
        private readonly ChelseaContext _context;
        private readonly IMapper _mapper;
        [System.Obsolete]
        private readonly IHostingEnvironment _environment;

        [System.Obsolete]
        public HomeController(ChelseaContext context, IMapper mapper, IHostingEnvironment environment)
        {
            _context = context;
            _mapper = mapper;
            this._environment = environment;
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

        [HttpPost("coverpage/save")]
        [System.Obsolete]
        public async Task<ActionResult> SaveCoverPage(CoverPageModel coverPage)
        {
            var dataList = await _context.vwAddress.AsQueryable().Where(t=>t.Id == coverPage.AddressId).FirstOrDefaultAsync();
            var modelList = this._mapper.Map<AddressModel>(dataList);
            var cityObj = await _context.CityMaster.Where(t => t.Id == Convert.ToInt32(coverPage.Contractor.City)).FirstOrDefaultAsync();
            var stateObj = await _context.StateMaster.Where(t => t.Id == Convert.ToInt32(coverPage.Contractor.State)).FirstOrDefaultAsync();
            coverPage.Contractor.StateName = stateObj.Name;
            coverPage.Contractor.CityName = cityObj.Name;
            DocUtility utility = new DocUtility(this._environment);
            utility.SaveCoverPage(coverPage, modelList);

            Submittal entity = new Submittal();
            entity.Id = Convert.ToInt64(coverPage.Id);
            entity.AddressId = coverPage.AddressId;
            entity.SubmittedDate = Convert.ToDateTime(coverPage.SubmittalDate);
            entity.JobName = coverPage.JobName;
            entity.SubmittalCount = Convert.ToInt32(coverPage.Submittals);
            entity.ProjectManagerName = coverPage.ProjectManager.Name;
            entity.Phone = coverPage.ProjectManager.Phone;
            entity.Email = coverPage.ProjectManager.Email;
            entity.ContractorName = coverPage.Contractor.Name;
            entity.AddressLine1 = coverPage.Contractor.AddressLine1;
            entity.AddressLine2 = coverPage.Contractor.AddressLine2;
            entity.StateId = Convert.ToInt32(coverPage.Contractor.State);
            entity.CityId = Convert.ToInt32(coverPage.Contractor.City);
            entity.CreatedDate= DateTime.Now;
            entity.Zip = Convert.ToInt32(coverPage.Contractor.PostalCode);
            if (entity.Id > 0)
            {
                _context.Submittal.Update(entity);
            }
            else
            {
                _context.Submittal.Add(entity);
            }
            var result = await _context.SaveChangesAsync();
            return Ok(result);
        }

        [HttpGet("submittal/get/{id}")]
        public async Task<ActionResult> GetSubmittal(string id)
        {
            var dataList = await _context.vwSubmittals.AsQueryable().Where(t => t.Id == Convert.ToInt32(id)).FirstOrDefaultAsync();
            var modelList = this._mapper.Map<SubmittalModel>(dataList);
            return Ok(modelList);
        }
    }
}
