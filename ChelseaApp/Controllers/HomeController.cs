using AutoMapper;
using Chelsea.Repository;
using ChelseaApp.DocHelper;
using ChelseaApp.Model;
using EO.Pdf;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Drawing;
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
        private readonly IDocUtility _docUtility;
       
        public HomeController(ChelseaContext context, IMapper mapper, IHostingEnvironment environment, IOptions<AppConfig> appSettings, IAzureBlobServices azureBlobServices, IDocUtility docUtility)
        {
            _context = context;
            _mapper = mapper;
            this._environment = environment;
            _appSetting = appSettings.Value;
            _azureBlobServices = azureBlobServices;
            _docUtility = docUtility;
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
        public async Task<ActionResult> SaveCoverPage(CoverPageModel coverPage)
        {
            var dataList = await _context.vwAddress.AsQueryable().Where(t => t.Id == coverPage.AddressId).FirstOrDefaultAsync();
            var modelList = this._mapper.Map<AddressModel>(dataList);
            //var cityObj = await _context.CityMaster.Where(t => t.Id == Convert.ToInt32(coverPage.Contractor.City)).FirstOrDefaultAsync();
            var stateObj = await _context.StateMaster.Where(t => t.Id == Convert.ToInt32(coverPage.Contractor.State)).FirstOrDefaultAsync();
            coverPage.Contractor.StateName = stateObj.Name;
            //coverPage.Contractor.CityName = cityObj.Name;
            var fileInfo = _docUtility.SaveCoverPage(coverPage, modelList);
            string fileName = Path.GetFileName(fileInfo.Path);
            
            //var fileInfo = await _azureBlobServices.UploadFile(stream, "/Content/"+ fileName, _appSetting.AzureBlobDocContainer, false);

            Submittal entity = new Submittal();
            entity.Id = Convert.ToInt64(coverPage.Id);
            entity.AddressId = coverPage.AddressId;
            entity.SubmittedDate = Convert.ToDateTime(coverPage.SubmittalDate);
            entity.JobName = coverPage.JobName;
            entity.Submittals = coverPage.Submittals;
            entity.ProjectManagerName = coverPage.ProjectManager.Name;
            entity.Phone = coverPage.ProjectManager.Phone;
            entity.Email = coverPage.ProjectManager.Email;
            entity.ContractorName = coverPage.Contractor.Name;
            entity.AddressLine1 = coverPage.Contractor.AddressLine1;
            entity.AddressLine2 = coverPage.Contractor.AddressLine2;
            entity.StateId = Convert.ToInt32(coverPage.Contractor.State);
            entity.City = coverPage.Contractor.City;
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
            modelList.FileUrl = await _azureBlobServices.GetPath(modelList.FileName, _appSetting.AzureBlobDocContainer);
            modelList.ThumbnailUrl = await _azureBlobServices.GetPath(modelList.Thumbnail, _appSetting.AzureBlobMainImageContainer);

            var pdfFiles = await _context.PdfFiles.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(id)).ToListAsync();
            var pdfFilesList = this._mapper.Map<List<PdfFileModel>>(pdfFiles);
            var pdfFilesDetails = await _context.PdfFileDetails.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(id)).ToListAsync();

            foreach (var pdfFile in pdfFilesList)
            {
                var detailList = pdfFilesDetails.Where(t => t.PdfFileId == pdfFile.Id).ToList();
                pdfFile.Files = this._mapper.Map<List<FileModel>>(detailList); ;

            }

            modelList.PdfFiles = pdfFilesList;
            return Ok(modelList);
        }

        [HttpPost("upload")]
        public async Task<ActionResult> Upload(IFormFile file)
        {
            var message = string.Empty;
            var newFileName = string.Empty;
            string thumbnail = string.Empty;
            string pdfPath =  string.Empty;
            string fileSize = string.Empty;
            string orgFileName = string.Empty;
            try
            {
                string[] acceptFileTypes = new[] { ".pdf" };
                if (file != null && acceptFileTypes.Count(t => t == Path.GetExtension(file.FileName).ToLower()) > 0)
                {
                    byte[] fileBytes = new byte[file.Length];
                    file.OpenReadStream().Read(fileBytes, 0, int.Parse(file.Length.ToString()));

                    Stream stream = new MemoryStream(fileBytes);
                  
                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    string fileId = fileName + "_" + Guid.NewGuid().ToString();

                    newFileName = string.Format("{0}{1}", fileId, fileExtension);
                    var fileUrl = string.Format("{0}/{1}", "Content", newFileName);
                    // System.IO.File.WriteAllBytes(fileUrl, fileBytes);
                    var fileInfo = await _azureBlobServices.UploadFile(stream, fileUrl, _appSetting.AzureBlobTempContainer, false);

                    fileSize = file.Length.ToString();
                    pdfPath = fileInfo.Path;
                    string thName = fileId + ".png";                    
                    thumbnail = _docUtility.ConvertPDFtoJPG(stream, thName, 0);
                    orgFileName = file.FileName;
                }
                else
                {
                    message = "Invalid file type " + Path.GetExtension(file.FileName);
                }
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return this.BadRequest(message);

            }
            return this.Ok(new FileModel { FileName = newFileName, FilePath = pdfPath, FileSize = fileSize, Thumbnail = thumbnail, OrgFileName = orgFileName });
        }

        [HttpPost("files/merge")]
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
            List<PdfFileModel> finalfiles = new List<PdfFileModel>();


            var coverfileUrl = string.Format("{0}/{1}", "Content", modelList.CoverPageName);
            var coverfileStream = await _azureBlobServices.DownloadFile(coverfileUrl, _appSetting.AzureBlobDocContainer);
            //files.Add(coverfileStream);

            var coverPageBytes = StreamHelper.ReadToEnd(coverfileStream);
            var coverFilePath = this._environment.WebRootPath + "/TempPdf/Cover_" + Guid.NewGuid().ToString() + ".pdf";
            System.IO.File.WriteAllBytes(coverFilePath, coverPageBytes);
            List<string> pages = new List<string>();
            var allfiles = pdfFileMaster.PdfFiles;//.SelectMany(t => t.Files).ToList();
            foreach (var filesList in allfiles)
            {
                foreach (var fdetails in filesList.Files)
                {
                    var fileUrl = string.Format("{0}/{1}", "Content", fdetails.FileName);
                    var fileStream = await _azureBlobServices.DownloadFile(fileUrl, _appSetting.AzureBlobTempContainer);
                    files.Add(fileStream);
                }

                string mergByte = _docUtility.CombineMultiplePDFs(filesList, files);
                filesList.FileTmpPath = mergByte;
                finalfiles.Add(filesList);
                pages.Add(mergByte);
                //using (MemoryStream pdfStream = new MemoryStream())
                //{
                //    pdfStream.Write(mergByte, 0, mergByte.Length);
                //    finalfiles.Add(pdfStream);
                //}
                files = new List<Stream>();

            }

            // var pages = _docUtility.CreateIndexPage(finalfiles);
            pages.Insert(0, coverFilePath);
            files = new List<Stream>();

            byte[] mergedByte = _docUtility.CombineMultiplePDFFiles(pages);
            string pdfFileName = "MergedFile_" + Guid.NewGuid().ToString() + ".pdf";
            var thumbnail = string.Empty;
            var blobpdffileUrl = string.Empty;
            using (MemoryStream pdfStream = new MemoryStream())
            {
                pdfStream.Write(mergedByte, 0, mergedByte.Length);
                
                var pdffileUrl = string.Format("{0}/{1}", "Content", pdfFileName);
                var fileInfo = await _azureBlobServices.UploadFile(pdfStream, pdffileUrl, _appSetting.AzureBlobDocContainer, false);
                thumbnail = _docUtility.ConvertPDFtoJPG(pdfStream, Path.GetFileNameWithoutExtension(pdfFileName) + ".png", 2);
                blobpdffileUrl = fileInfo.Path;
            }

            var pdfEntities = _context.PdfFiles.Where(t => t.SubmittalId == dataList.Id).ToList();
            var pdfDetailEntities = _context.PdfFileDetails.Where(t => t.SubmittalId == dataList.Id).ToList();
            _context.PdfFiles.RemoveRange(pdfEntities);
            _context.PdfFileDetails.RemoveRange(pdfDetailEntities);

            var submittalModel = this._mapper.Map<Submittal>(dataList);
            submittalModel.Thumbnail = Path.GetFileName(thumbnail);
            submittalModel.FileName = pdfFileName;
            _context.Submittal.Update(submittalModel);
            await _context.SaveChangesAsync();
            

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
                    pdfFile.FileName = file.FileName;
                    pdfFile.SubmittalId = pdfFileMaster.SubmittalId;
                    pdfFile.PdfFileId = modeObj.Id;
                    pdfFile.Name = modeObj.Name;
                    pdfFile.FileName = file.FileName;
                    pdfFile.FileSize = file.FileSize;
                    pdfFile.Thumbnail = Path.GetFileName(file.Thumbnail);
                    pdfFile.OrgFileName = file.OrgFileName;
                    _context.PdfFileDetails.Add(pdfFile);
                    await _context.SaveChangesAsync();
                }
            }

            modelList.FileName = pdfFileName;
            modelList.FileUrl = blobpdffileUrl;
            modelList.Thumbnail = Path.GetFileName(thumbnail);
            modelList.ThumbnailUrl = thumbnail;
            return Ok(modelList);
        }

        [HttpPost("auto/save")]
        public async Task<ActionResult> AutoSaveFile(IFormFile file, PdfFileAutoSaveModel saveModel)
        {
            var message = string.Empty;
            var newFileName = string.Empty;
            string thumbnail = string.Empty;
            string pdfPath = string.Empty;
            string fileSize = string.Empty;
            string orgFileName = string.Empty;
            try
            {
                string[] acceptFileTypes = new[] { ".pdf" };
                if (file != null && acceptFileTypes.Count(t => t == Path.GetExtension(file.FileName).ToLower()) > 0)
                {
                    byte[] fileBytes = new byte[file.Length];
                    file.OpenReadStream().Read(fileBytes, 0, int.Parse(file.Length.ToString()));

                    Stream stream = new MemoryStream(fileBytes);

                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                    string fileId = fileName + "_" + Guid.NewGuid().ToString();

                    newFileName = string.Format("{0}{1}", fileId, fileExtension);
                    var fileUrl = string.Format("{0}/{1}", "Content", newFileName);
                    // System.IO.File.WriteAllBytes(fileUrl, fileBytes);
                    var fileInfo = await _azureBlobServices.UploadFile(stream, fileUrl, _appSetting.AzureBlobTempContainer, false);

                    fileSize = file.Length.ToString();
                    pdfPath = fileInfo.Path;
                    string thName = fileId + ".png";
                    thumbnail = _docUtility.ConvertPDFtoJPG(stream, thName, 0);
                    orgFileName = file.FileName;
                }
                else
                {
                    message = "Invalid file type " + Path.GetExtension(file.FileName);
                }
            }
            catch (Exception ex)
            {
                message = ex.Message;
                return this.BadRequest(message);

            }

            var modeObj = this._mapper.Map<PdfFiles>(saveModel.PdfFiles);
            if (modeObj.Id > 0)
            {
                _context.PdfFiles.Update(modeObj);               
            }
            else
            {
                _context.PdfFiles.Add(modeObj);
            }
            await _context.SaveChangesAsync();
            saveModel.PdfFiles.Id = modeObj.Id;

            foreach (var pdffile in saveModel.PdfFiles.Files)
            {
                PdfFileDetails pdfFile = new PdfFileDetails();
                pdfFile.FileName = file.FileName;
                pdfFile.SubmittalId = saveModel.SubmittalId;
                pdfFile.PdfFileId = modeObj.Id;
                pdfFile.Name = modeObj.Name;
                pdfFile.FileName = file.FileName;
                pdfFile.FileSize = fileSize;
                pdfFile.Thumbnail = thumbnail;
                pdfFile.OrgFileName = orgFileName;
                if (modeObj.Id > 0)
                {
                    _context.PdfFileDetails.Update(pdfFile);
                }
                else
                {
                    _context.PdfFileDetails.Add(pdfFile);
                }
                await _context.SaveChangesAsync();
            }

            return this.Ok(saveModel);
        }
    }
}
