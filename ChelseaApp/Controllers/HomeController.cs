using AutoMapper;
using Chelsea.Repository;
using ChelseaApp.DocHelper;
using ChelseaApp.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
        public readonly AppConfig _appSetting;
        private readonly IAzureBlobServices _azureBlobServices;

       [System.Obsolete]
        public HomeController(ChelseaContext context, IMapper mapper, IHostingEnvironment environment, IOptions<AppConfig> appSettings, IAzureBlobServices azureBlobServices)
        {
            _context = context;
            _mapper = mapper;
            this._environment = environment;
            _appSetting = appSettings.Value;
            _azureBlobServices = azureBlobServices;
        }

        [HttpGet("submittal/list")]
        public async Task<ActionResult> Get()
        {
            var dataList = await _context.vwSubmittals.Where(t => t.IsTempRecord == null || t.IsTempRecord == false).ToListAsync();
            var modelList = this._mapper.Map<List<SubmittalModel>>(dataList);
            return Ok(modelList);
        }
        [HttpGet("submittal/list/{searchText}")]
        public async Task<ActionResult> Get(string searchText)
        {
            var dataList = await _context.vwSubmittals.AsQueryable().Where(t => (t.FileName.Contains(searchText) || t.LastName.Contains(searchText)) && (t.IsTempRecord == null || t.IsTempRecord == false)).ToListAsync();
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
            var stream = utility.SaveCoverPage(coverPage, modelList);
            string fileName = "cover_" + Guid.NewGuid().ToString() + ".doc";
            await _azureBlobServices.UploadFile(stream, "/Content/"+ fileName, _appSetting.AzureBlobDocContainer, false);

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
            entity.IsTempRecord = true;
            entity.CoverPageName = fileName;
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
        public async Task<ActionResult> Upload([FromForm] IFormFile file)
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


                    //string folderPath = this._environment.ContentRootPath + "/Content/TempPdf";
                    //if (!Directory.Exists(folderPath))
                    //{
                    //    Directory.CreateDirectory(folderPath);
                    //}

                    Stream stream = new MemoryStream(fileBytes);

                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    newFileName = string.Format("{0}{1}", fileName + "_" + Guid.NewGuid().ToString(), fileExtension);
                    var fileUrl = string.Format("{0}/{1}", "Content", newFileName);
                    // System.IO.File.WriteAllBytes(fileUrl, fileBytes);
                    await _azureBlobServices.UploadFile(stream, fileUrl, _appSetting.AzureBlobTempContainer, false);
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
            //string reportPath = "Content/Scan";
            //var contentRootPath = this._environment.ContentRootPath + '\\';
            //if (!Directory.Exists(contentRootPath + reportPath))
            //{
            //    Directory.CreateDirectory(contentRootPath + reportPath);
            //}

            //var files = Directory.GetFiles(contentRootPath + '\\' + "Content/Files");
            //string rooPath = contentRootPath + reportPath;

            // var outputFile = string.Format("{0}/{1}", "Content", "mergedbyitext.pdf");
            List<Stream> files = new List<Stream>();
            

            

            var allfiles = pdfFileMaster.PdfFiles.SelectMany(t => t.Files).ToList();
            foreach (var file in allfiles)
            {
                var fileUrl = string.Format("{0}/{1}", "Content", file);
                var fileStream = await _azureBlobServices.DownloadFile(fileUrl, _appSetting.AzureBlobTempContainer);
                files.Add(fileStream);
            }

            DocUtility utility = new DocUtility(this._environment);
            Stream mergedFileName = utility.CombineMultiplePDFs(files);
            string pdfFileName = "MergedFile_" + Guid.NewGuid().ToString() + ".pdf";
            var pdffileUrl = string.Format("{0}/{1}", "Content", pdfFileName);
            await _azureBlobServices.UploadFile(mergedFileName, pdffileUrl, _appSetting.AzureBlobDocContainer, false);

            foreach (var model in pdfFileMaster.PdfFiles)
            {
                var modeObj = this._mapper.Map<PdfFiles>(model);
                modeObj.SubmittalId = pdfFileMaster.SubmittalId;
                modeObj.FileName = pdfFileName;
                _context.PdfFiles.Add(modeObj);
                await _context.SaveChangesAsync();

                foreach(var file in model.Files)
                {
                    PdfFileDetails pdfFile = new PdfFileDetails();
                    pdfFile.FileName = file;
                    pdfFile.SubmittalId = pdfFileMaster.SubmittalId;
                    pdfFile.PdfFileId = modeObj.Id;
                    pdfFile.Name = modeObj.Name;
                    _context.PdfFileDetails.Add(pdfFile);
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(modelList);
        }
    }
}
