using AutoMapper;
using Chelsea.Repository;
using ChelseaApp.DocHelper;
using ChelseaApp.Model;
using EO.Pdf;
using iTextSharp.text.pdf;
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
            var dataList = await _context.vwSubmittals.OrderByDescending(x=>x.UpdatedDate).ToListAsync();
            var modelList = this._mapper.Map<List<SubmittalModel>>(dataList);
            return Ok(modelList);
        }
        [HttpGet("submittal/all")]
        public async Task<ActionResult> Get(string searchText, string pageNumber, string pageSize)
        {

            int skip = (Convert.ToInt32(pageNumber) - 1) * Convert.ToInt32(pageSize);
            var dataList = new List<SubmittalList>();
            int totalCount = 0;
            if (string.IsNullOrEmpty(searchText))
            {
                var dataQuery = await _context.vwSubmittals.AsQueryable().ToListAsync();
                totalCount = dataQuery.Count();
                dataList = dataQuery.OrderByDescending(t => t.CreatedDate).Skip(skip).Take(Convert.ToInt32(pageSize)).ToList();
            }
            else
            {
                var dataQuery = _context.vwSubmittals.AsQueryable().Where(t => (
                t.FirstName.ToLower().Contains(searchText.ToLower()) || 
                t.LastName.ToLower().Contains(searchText.ToLower()) ||
                t.JobName.ToLower().Contains(searchText.ToLower()) ||
                t.Submittals.ToLower().Contains(searchText.ToLower())));
                totalCount = dataQuery.Count();
                dataList = await dataQuery.OrderByDescending(t => t.CreatedDate).Skip(skip).Take(Convert.ToInt32(pageSize)).ToListAsync();
            }
            var modelList = this._mapper.Map<List<SubmittalModel>>(dataList);
            var fileUrl = string.Format("{0}/{1}", "Content", string.Empty);
            var imagePath = await _azureBlobServices.GetPath(fileUrl, _appSetting.AzureBlobMainImageContainer);
            var docPath = await _azureBlobServices.GetPath(fileUrl, _appSetting.AzureBlobDocContainer);
            foreach (var model in modelList)
            {
                model.ThumbnailUrl = string.Format("{0}/{1}", imagePath, model.Thumbnail);
                model.FileUrl = string.Format("{0}/{1}", docPath, model.FileName);
                model.Thumbnail = model.ThumbnailUrl;
            }
            return Ok(new { data = modelList, totalCount = totalCount });
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
            var isSubmittalExists = await _context.vwSubmittals.AnyAsync(t => t.Submittals == coverPage.Submittals && t.Id != coverPage.Id);
            if (isSubmittalExists)
            {
                return this.Conflict("duplicate submittals");
            }

            var dataList = await _context.vwAddress.AsQueryable().Where(t => t.Id == coverPage.AddressId).FirstOrDefaultAsync();
            var modelList = this._mapper.Map<AddressModel>(dataList);
            //var cityObj = await _context.CityMaster.Where(t => t.Id == Convert.ToInt32(coverPage.Contractor.City)).FirstOrDefaultAsync();
            int stateId = 0;

            if (coverPage.Contractor != null && coverPage.Contractor.StateId.GetValueOrDefault() > 0)
            {
                var stateObj = await _context.StateMaster.Where(t => t.Id == coverPage.Contractor.StateId.GetValueOrDefault()).FirstOrDefaultAsync();
                coverPage.Contractor.StateName = stateObj.Name;
                stateId = coverPage.Contractor.StateId.GetValueOrDefault();
            }            

            DateTime submittalDate = DateTime.Now;
            if (DateTime.TryParse(coverPage.SubmittalDate, out submittalDate))
            {

            }

            if (!string.IsNullOrEmpty(coverPage.Contractor.City))
            {
                var cityObj = await _context.CityMaster.Where(t => t.Name == coverPage.Contractor.City && t.StateId == stateId).FirstOrDefaultAsync();
                if (cityObj == null)
                {
                    CityMaster cityMaster = new CityMaster();
                    cityMaster.Name = coverPage.Contractor.City;
                    cityMaster.StateId = stateId;
                    _context.CityMaster.Add(cityMaster);
                    await _context.SaveChangesAsync();
                }
            }

            var logoPath = this.Request.Headers["Origin"].ToString() + "/Chelsea-logo.png";
            //coverPage.Contractor.CityName = cityObj.Name;
            var fileInfo = _docUtility.SaveCoverPage(coverPage, modelList, logoPath);
            string fileName = Path.GetFileName(fileInfo.Path);

            //var fileInfo = await _azureBlobServices.UploadFile(stream, "/Content/"+ fileName, _appSetting.AzureBlobDocContainer, false);

            Submittal entity = new Submittal();
            entity.Id = Convert.ToInt64(coverPage.Id);
            entity.AddressId = coverPage.AddressId;
            entity.SubmittedDate = submittalDate;
            entity.JobName = coverPage.JobName;
            entity.Submittals = coverPage.Submittals;
            entity.ProjectManagerName = coverPage.ProjectManager.Name;
            entity.Phone = coverPage.ProjectManager.Phone;
            entity.Email = coverPage.ProjectManager.Email;
            entity.ContractorName = coverPage.Contractor.Name;
            entity.AddressLine1 = coverPage.Contractor.AddressLine1;
            entity.AddressLine2 = coverPage.Contractor.AddressLine2;
            entity.StateId = stateId;
            entity.City = coverPage.Contractor.City;
            entity.IsTempRecord = true;
            entity.CoverPageName = fileName;
            entity.Zip = coverPage.Contractor.PostalCode;
            entity.Status = coverPage.Status;
            
            if (entity.Id > 0)
            {
                entity.UpdatedDate = DateTime.Now;
                _context.Submittal.Update(entity);
            }
            else
            {
                entity.CreatedDate = entity.UpdatedDate= DateTime.Now;
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
            var fileUrl = string.Format("{0}/{1}", "Content", modelList.FileName);
            var thuUrl = string.Format("{0}/{1}", "Content", modelList.Thumbnail);
            modelList.FileUrl = await _azureBlobServices.GetPath(fileUrl, _appSetting.AzureBlobDocContainer);
            modelList.ThumbnailUrl = await _azureBlobServices.GetPath(thuUrl, _appSetting.AzureBlobMainImageContainer);

            var pdfFiles = await _context.PdfFiles.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(id)).ToListAsync();
            var pdfFilesList = this._mapper.Map<List<PdfFileModel>>(pdfFiles);
            var pdfFilesDetails = await _context.PdfFileDetails.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(id)).ToListAsync();

            foreach (var pdfFile in pdfFilesList)
            {
                var detailList = pdfFilesDetails.Where(t => t.PdfFileId == pdfFile.Id).ToList();
                pdfFile.Files = this._mapper.Map<List<FileModel>>(detailList);
                foreach (var model in pdfFile.Files)
                {
                    var thuFileUrl = string.Format("{0}/{1}", "Content", model.Thumbnail);
                    model.Thumbnail = await _azureBlobServices.GetPath(thuFileUrl, _appSetting.AzureBlobMainImageContainer);
                    fileUrl = string.Format("{0}/{1}", "Content", model.FileName);
                    model.FilePath = await _azureBlobServices.GetPath(fileUrl, _appSetting.AzureBlobDocContainer);
                }

            }

            modelList.PdfFiles = pdfFilesList;
            return Ok(modelList);
        }

        [HttpGet("submittal/get/{submittalId}/{sectionId}/{fileId}")]
        public async Task<ActionResult> GetSubmittalFile(string submittalId, string sectionId, string fileId)
        {
           
            var pdfFiles = await _context.PdfFiles.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(submittalId) && t.Id == Convert.ToInt32(sectionId)).FirstOrDefaultAsync();
            var pdfFileObject = this._mapper.Map<PdfFileAutoSaveModel>(pdfFiles);
            if (pdfFileObject != null)
            {
                var pdfFilesDetail = await _context.PdfFileDetails.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(submittalId) && t.PdfFileId == Convert.ToInt32(sectionId) && t.Id == Convert.ToInt32(fileId)).FirstOrDefaultAsync();

                pdfFileObject.Files = this._mapper.Map<FileModel>(pdfFilesDetail);
                if (pdfFileObject.Files != null)
                {
                    var thuFileUrl = string.Format("{0}/{1}", "Content", pdfFileObject.Files.Thumbnail);
                    pdfFileObject.Files.Thumbnail = await _azureBlobServices.GetPath(thuFileUrl, _appSetting.AzureBlobMainImageContainer);
                    var fileUrl = string.Format("{0}/{1}", "Content", pdfFileObject.Files.FileName);
                    pdfFileObject.Files.FilePath = await _azureBlobServices.GetPath(fileUrl, _appSetting.AzureBlobDocContainer);
                }
            }
            return Ok(pdfFileObject);
        }

        [HttpPost("upload/header")]
        public async Task<ActionResult> UploadHeader(IFormFile file, [FromForm]string fileName)

        {
            byte[] fileBytes = new byte[file.Length];
            file.OpenReadStream().Read(fileBytes, 0, int.Parse(file.Length.ToString()));

            Stream stream = new MemoryStream(fileBytes);

            var fileExtension = Path.GetExtension(fileName).ToLower();
            var fileNameNew = Path.GetFileNameWithoutExtension(fileName);
            string fileId = fileNameNew + "_" + Guid.NewGuid().ToString();

            var newFileName = string.Format("{0}{1}", fileId, fileExtension);
            var fileUrl = string.Format("{0}/{1}", "Content", newFileName);

            await _azureBlobServices.UploadFile(stream, fileUrl, _appSetting.AzureBlobTempContainer, false);
            return Ok(new FileModel { FileName = newFileName, OrgFileName = fileName });

        }

        [HttpPost("upload")]
        public async Task<ActionResult> Upload(IFormFile file)
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
            return this.Ok(new FileModel { FileName = newFileName, FilePath = pdfPath, FileSize = fileSize, Thumbnail = thumbnail, OrgFileName = orgFileName });
        }

        [HttpGet("download")]
        public async Task<ActionResult> Download(string bloburl)
        {
            var fileName = Path.GetFileName(bloburl);
            var fileUrl = string.Format("{0}/{1}", "Content", fileName);
            var fileStream = await _azureBlobServices.DownloadFile(fileUrl, _appSetting.AzureBlobTempContainer);

            return this.File(fileStream, "application/octet-stream", fileName);
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
            string pdfFileName = String.Empty;
            var thumbnail = string.Empty;
            var blobpdffileUrl = string.Empty;
            var fileSize = 0;
            if (!pdfFileMaster.IsDraft)
            {
                List<PdfReader> files = new List<PdfReader>();
                List<PdfFileModel> finalfiles = new List<PdfFileModel>();
                List<BookmarkModel> bookmarks = new List<BookmarkModel>(); 

                var coverfileUrl = string.Format("{0}/{1}", "Content", modelList.CoverPageName);
                var coverfileStream = await _azureBlobServices.DownloadFile(coverfileUrl, _appSetting.AzureBlobDocContainer);
                //files.Add(coverfileStream);

                var coverPageBytes = StreamHelper.ReadToEnd(coverfileStream);
                var coverFilePath = this._environment.WebRootPath + "/TempPdf/Cover_" + Guid.NewGuid().ToString() + ".pdf";
                finalfiles.Add(new PdfFileModel() { FileTmpPath = coverFilePath, Name = "Cover Page" });
                bookmarks.Add(new BookmarkModel() { Name = "Cover Page", Stream = coverfileStream });

                System.IO.File.WriteAllBytes(coverFilePath, coverPageBytes);
                List<string> pages = new List<string>();
                var allfiles = pdfFileMaster.PdfFiles;//.SelectMany(t => t.Files).ToList();
                foreach (var filesList in allfiles)
                {
                    foreach (var fdetails in filesList.Files)
                    {
                        if (!string.IsNullOrEmpty(fdetails.ExpressKey))
                        {
                            var fileStream = this.GetMergedPdf(fdetails.ExpressKey, fdetails.ExpressUrl);                            
                            var reader = new iTextSharp.text.pdf.PdfReader(fileStream);
                            var numberOfPages = reader.NumberOfPages;
                            fdetails.NumberOfPages = numberOfPages;
                            files.Add(reader);

                            bookmarks.Add(new BookmarkModel() { Name = Path.GetFileNameWithoutExtension(fdetails.OrgFileName), Stream = fileStream, ParentName = filesList.Name });
                        }
                        else
                        {
                            var fileUrl = string.Format("{0}/{1}", "Content", !string.IsNullOrEmpty(fdetails.TempFileName) ? fdetails.TempFileName : fdetails.FileName);
                            var fileStream = await _azureBlobServices.DownloadFile(fileUrl, _appSetting.AzureBlobTempContainer);
                            //files.Add(fileStream);
                            var reader = new iTextSharp.text.pdf.PdfReader(fileStream);
                            var numberOfPages = reader.NumberOfPages;
                            fdetails.NumberOfPages = numberOfPages;
                            files.Add(reader);

                            bookmarks.Add(new BookmarkModel() { Name = Path.GetFileNameWithoutExtension(fdetails.OrgFileName), Stream = fileStream, ParentName = filesList.Name });
                            if (!string.IsNullOrEmpty(fdetails.TempFileName))
                            {
                                await _azureBlobServices.DeleteFile(fileUrl, _appSetting.AzureBlobTempContainer);
                            }
                        }
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
                    files = new List<PdfReader>();

                }



                pages = _docUtility.CreateIndexPage(finalfiles); // _docUtility.CreateBookMarks(bookmarks); //

                //pages.Insert(0, coverFilePath);
                files = new List<PdfReader>();

                byte[] mergedByte = System.IO.File.ReadAllBytes(pages[0]);  //_docUtility.CombineMultiplePDFFiles(pages);
                pdfFileName = "MergedFile_" + Guid.NewGuid().ToString() + ".pdf";
                using (MemoryStream pdfStream = new MemoryStream())
                {
                    pdfStream.Write(mergedByte, 0, mergedByte.Length);
                    fileSize = mergedByte.Length;
                    var pdffileUrl = string.Format("{0}/{1}", "Content", pdfFileName);
                    var fileInfo = await _azureBlobServices.UploadFile(pdfStream, pdffileUrl, _appSetting.AzureBlobDocContainer, false);
                    thumbnail = _docUtility.ConvertPDFtoJPG(pdfStream, Path.GetFileNameWithoutExtension(pdfFileName) + ".png", 2);
                    blobpdffileUrl = fileInfo.Path;
                }

                foreach(var file in finalfiles)
                {
                    if (System.IO.File.Exists(file.FileTmpPath))
                    {
                        System.IO.File.Delete(file.FileTmpPath);
                    }
                }
                foreach (var file in pages)
                {
                    if (System.IO.File.Exists(file))
                    {
                        System.IO.File.Delete(file);
                    }
                }
            }

            var sectionIds = pdfFileMaster.PdfFiles.Select(t => t.Id).ToList();
            var subSectionIds = pdfFileMaster.PdfFiles.SelectMany(t => t.Files).Select(t => t.Id).ToList();

            var pdfEntities = _context.PdfFiles.Where(t => t.SubmittalId == dataList.Id).ToList();
            var pdfEntitiesNew = pdfEntities.Where(t => !sectionIds.Any(s => s == t.Id)).ToList();
            var pdfDetailEntities = _context.PdfFileDetails.Where(t => t.SubmittalId == dataList.Id).ToList();
            var pdfDetailEntitiesNew = pdfDetailEntities.Where(t => !subSectionIds.Any(s => s == t.Id)).ToList();
            _context.PdfFiles.RemoveRange(pdfEntitiesNew);
            _context.PdfFileDetails.RemoveRange(pdfDetailEntitiesNew);

            var submittalModel = this._mapper.Map<Submittal>(dataList);
            submittalModel.Thumbnail = Path.GetFileName(thumbnail);
            submittalModel.FileName = pdfFileName;
            submittalModel.FileSize = fileSize;
            submittalModel.IsDraft = pdfFileMaster.IsDraft;
            submittalModel.IsTempRecord = false;
            submittalModel.UpdatedDate = DateTime.Now;
            _context.Submittal.Update(submittalModel);
            await _context.SaveChangesAsync();


            foreach (var model in pdfFileMaster.PdfFiles)
            {
                var upDateObj = pdfEntities.Where(t => t.Id == model.Id).FirstOrDefault();
                var modeObj = this._mapper.Map<PdfFiles>(model);
                modeObj.SubmittalId = pdfFileMaster.SubmittalId;
                modeObj.FileName = pdfFileName;
                if (upDateObj!=null)
                {
                    upDateObj.Status = modeObj.Status;
                    upDateObj.Name = modeObj.Name;
                    upDateObj.MFG = modeObj.MFG;
                    upDateObj.Part = modeObj.Part;
                    upDateObj.Description = modeObj.Description;
                    upDateObj.FileName = modeObj.FileName;
                    upDateObj.Volt = modeObj.Volt;
                    upDateObj.Lamp = modeObj.Lamp;
                    upDateObj.Dim = modeObj.Dim;
                    upDateObj.Runs = modeObj.Runs;
                    _context.PdfFiles.Update(upDateObj);
                }
                else
                {
                    _context.PdfFiles.Add(modeObj);
                }
                await _context.SaveChangesAsync();

                foreach (var file in model.Files)
                {
                    var pdfFile = pdfDetailEntities.Where(t => t.Id == file.Id).FirstOrDefault();
                    if (pdfFile == null)
                    {
                        pdfFile = new PdfFileDetails();
                    }

                    pdfFile.Id = file.Id;
                    pdfFile.FileName = Path.GetFileName(file.FileName);
                    pdfFile.SubmittalId = pdfFileMaster.SubmittalId;
                    pdfFile.PdfFileId = modeObj.Id;
                    pdfFile.Annotations = file.Annotations;
                    pdfFile.FileName = Path.GetFileName(file.FileName);
                    pdfFile.FileSize = file.FileSize;
                    pdfFile.Thumbnail = Path.GetFileName(file.Thumbnail);
                    pdfFile.OrgFileName = file.OrgFileName;
                    if (pdfFile.Id > 0)
                    {
                        _context.PdfFileDetails.Update(pdfFile);
                    }
                    else
                    {
                        _context.PdfFileDetails.Add(pdfFile);
                    }
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
        public async Task<ActionResult> AutoSaveFile(PdfFileAutoSaveModel saveModel)
        {
            /*var message = string.Empty;
            var newFileName = string.Empty;
            string thumbnail = string.Empty;
            string pdfPath = string.Empty;
            string fileSize = string.Empty;
            string orgFileName = string.Empty;*/
            /*try
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

            }*/

            var modeObj = this._mapper.Map<PdfFiles>(saveModel);
            if (modeObj.Id > 0)
            {
                _context.PdfFiles.Update(modeObj);
            }
            else
            {
                _context.PdfFiles.Add(modeObj);
            }
            await _context.SaveChangesAsync();
            saveModel.Id = modeObj.Id;
            var pdfitem = saveModel.Files;
            //foreach ()
            //{
            PdfFileDetails pdfFile = new PdfFileDetails();
            pdfFile.FileName = Path.GetFileName(pdfitem.FileName);
            pdfFile.SubmittalId = saveModel.SubmittalId;
            pdfFile.PdfFileId = modeObj.Id;
            pdfFile.Id = pdfitem.Id;
            pdfFile.FileSize = pdfitem.FileSize;
            pdfFile.Thumbnail = Path.GetFileName(pdfitem.Thumbnail);
            pdfFile.OrgFileName = pdfitem.OrgFileName;
            pdfFile.Annotations = pdfitem.Annotations;
            if (pdfFile.Id > 0)
            {
                _context.PdfFileDetails.Update(pdfFile);
            }
            else
            {
                _context.PdfFileDetails.Add(pdfFile);
            }
            await _context.SaveChangesAsync();
            //}
            saveModel.Files.Id = pdfFile.Id;
            saveModel.Files.PdfFileId = pdfFile.PdfFileId;
            return this.Ok(saveModel);
        }

        [HttpGet("submittal/clone/{id}")]
        public async Task<ActionResult> CloneSubmittal(string id)
        {
            var dataList = await _context.vwSubmittals.AsQueryable().Where(t => t.Id == Convert.ToInt32(id)).FirstOrDefaultAsync();
            var modelList = this._mapper.Map<Submittal>(dataList);
            modelList.JobName = modelList.JobName + "-Copy";
            modelList.Submittals = modelList.Submittals + "-Copy";
            if (!string.IsNullOrEmpty(modelList.FileName))
            {
                string fileId = "MergedFile_" + Guid.NewGuid().ToString();
                string newfileName = fileId + ".pdf";
                string newThuName = fileId + ".png";
                var newfileUrl = string.Format("{0}/{1}", "Content", newfileName);
                var newThumbUrl = string.Format("{0}/{1}", "Content", newThuName);

                var fileUrl = string.Format("{0}/{1}", "Content", modelList.FileName);
                var thuUrl = string.Format("{0}/{1}", "Content", modelList.Thumbnail);
                
                await _azureBlobServices.CloneBlob(fileUrl, newfileUrl, _appSetting.AzureBlobDocContainer, false);
                modelList.FileName = newfileName;

                await _azureBlobServices.CloneBlob(thuUrl, newThumbUrl, _appSetting.AzureBlobDocContainer, false);
                modelList.Thumbnail = newThuName;
            }

            modelList.Id = 0;
            modelList.CreatedDate = modelList.UpdatedDate= DateTime.Now;
            await _context.Submittal.AddAsync(modelList);
            await _context.SaveChangesAsync();

            var pdfFiles = await _context.PdfFiles.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(id)).ToListAsync();
            var pdfFilesList = this._mapper.Map<List<PdfFiles>>(pdfFiles);
            var pdfFilesDetails = await _context.PdfFileDetails.AsQueryable().Where(t => t.SubmittalId == Convert.ToInt32(id)).ToListAsync();

            foreach (var pdfFile in pdfFilesList)
            {
                var oldId = pdfFile.Id;
                pdfFile.SubmittalId = Convert.ToInt32(modelList.Id);
                pdfFile.Id = 0;                
                await _context.PdfFiles.AddAsync(pdfFile);
                await _context.SaveChangesAsync();

                var detailList = pdfFilesDetails.Where(t => t.PdfFileId == oldId).ToList();
                var files = this._mapper.Map<List<PdfFileDetails>>(detailList);
                foreach (var model in files)
                {
                    if (!string.IsNullOrEmpty(model.FileName))
                    {
                        var fileId = Guid.NewGuid().ToString();
                        var newfileName = fileId + ".pdf";
                        var newThuName = fileId + ".png";
                        var newfileUrl = string.Format("{0}/{1}", "Content", newfileName);
                        var newThumbUrl = string.Format("{0}/{1}", "Content", newThuName);

                        var thuFileUrl = string.Format("{0}/{1}", "Content", model.Thumbnail);
                        var fileUrl = string.Format("{0}/{1}", "Content", model.FileName);

                        await _azureBlobServices.CloneBlob(thuFileUrl, newThumbUrl, _appSetting.AzureBlobDocContainer, false);
                        model.Thumbnail = newThuName;

                        await _azureBlobServices.CloneBlob(fileUrl, newfileUrl, _appSetting.AzureBlobDocContainer, false);
                        model.FileName = newfileName;
                    }
                    model.Id = 0;
                    model.SubmittalId = pdfFile.SubmittalId;
                    model.PdfFileId = pdfFile.Id;
                    await _context.PdfFileDetails.AddAsync(model);
                    await _context.SaveChangesAsync();
                }

            }
            return Ok(true);
        }
        private Stream GetMergedPdf(string key, string url)
        {
            WebRequest myWebRequest = WebRequest.Create(url);
            myWebRequest.Method = "GET";
            myWebRequest.Headers.Add("Authorization", key);
            WebResponse myWebResponse = myWebRequest.GetResponse();
            var stream = myWebResponse.GetResponseStream();
            return stream;
        }
    }
}
