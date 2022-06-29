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
using System.IO;
using System.Linq;
using System.Net;
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
            var dataList = await _context.vwAddress.AsQueryable().Where(t => t.Id == coverPage.AddressId).FirstOrDefaultAsync();
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
            entity.CreatedDate = DateTime.Now;
            entity.Zip = Convert.ToInt32(coverPage.Contractor.PostalCode);
            if (entity.Id > 0)
            {
                _context.Submittal.Update(entity);
            }
            else
            {
                _context.Submittal.Add(entity);
            }
            await _context.SaveChangesAsync();
            return Ok(entity.Id);
        }

        [HttpGet("submittal/get/{id}")]
        public async Task<ActionResult> GetSubmittal(string id)
        {
            var dataList = await _context.vwSubmittals.AsQueryable().Where(t => t.Id == Convert.ToInt32(id)).FirstOrDefaultAsync();
            var modelList = this._mapper.Map<SubmittalModel>(dataList);
            return Ok(modelList);
        }

        [HttpPost("upload")]
        [Obsolete]
        public ActionResult Upload([FromForm] IFormFile file)
        {
            var message = string.Empty;
            var newFileName = string.Empty;
            try
            {

                file = this.Request.Form.Files[0];

                string[] acceptFileTypes = new[] { ".pdf" };
                if (file != null && acceptFileTypes.Count(t => t == Path.GetExtension(file.FileName).ToLower()) > 0)
                {
                    byte[] fileBytes = new byte[file.Length];
                    file.OpenReadStream().Read(fileBytes, 0, int.Parse(file.Length.ToString()));


                    string folderPath = this._environment.ContentRootPath + "/Content/TempPdf";
                    if (!Directory.Exists(folderPath))
                    {
                        Directory.CreateDirectory(folderPath);
                    }
                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    newFileName = string.Format("{0}{1}", fileName + "_" + Guid.NewGuid().ToString(), fileExtension);
                    var fileUrl = string.Format("{0}/{1}", folderPath, newFileName);
                    System.IO.File.WriteAllBytes(fileUrl, fileBytes);
                }
                else
                {
                    message = "Invalid file type " + Path.GetExtension(file.FileName);
                }
            }
            catch (Exception ex)
            {
                message = ex.Message;

            }
            return this.Ok(newFileName);
        }

        [HttpGet("files/merge")]
        [Obsolete]
        public async Task<ActionResult> FileMerge(PdfFileMasterModel pdfFileMaster)
        {
            var dataList = await _context.vwSubmittals.AsQueryable().Where(t => t.Id == pdfFileMaster.SubmittalId).FirstOrDefaultAsync();
            var modelList = this._mapper.Map<SubmittalModel>(dataList);
            string reportPath = "Content/Scan";
            var contentRootPath = this._environment.ContentRootPath + '\\';
            if (!Directory.Exists(contentRootPath + reportPath))
            {
                Directory.CreateDirectory(contentRootPath + reportPath);
            }

            var files = Directory.GetFiles(contentRootPath + '\\' + "Content/Files");
            string rooPath = contentRootPath + reportPath;
            var outputFile = string.Format("{0}/{1}", rooPath, "mergedbyitext.pdf");

            var allfiles = pdfFileMaster.PdfFiles.SelectMany(t => t.Files).ToList();
            DocUtility utility = new DocUtility(this._environment);
            string mergedFileName = utility.CombineMultiplePDFs(allfiles, outputFile);
            foreach (var model in pdfFileMaster.PdfFiles)
            {
                var modeObj = this._mapper.Map<PdfFiles>(model);
                modeObj.SubmittalId = pdfFileMaster.SubmittalId;
                modeObj.FileName = mergedFileName;
                _context.PdfFiles.Add(modeObj);
                await _context.SaveChangesAsync();
            }

            return Ok(modelList);
        }
    }
}
