using ChelseaApp.Model;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Options;
using OpenXmlPowerTools;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace ChelseaApp.DocHelper
{
    public class DocUtility : IDocUtility
    {
        [System.Obsolete]
        public readonly IHostingEnvironment _environment;
        private readonly IAzureBlobServices _azureBlobServices;
        public readonly AppConfig _appSetting;

        [System.Obsolete]
        public DocUtility(IHostingEnvironment environment, IAzureBlobServices azureBlobServices, IOptions<AppConfig> appSettings)
        {
            this._environment = environment;
            _azureBlobServices = azureBlobServices;
            _appSetting = appSettings.Value;
        }

        [System.Obsolete]
        public FileUploadInfo SaveCoverPage(CoverPageModel coverPage, AddressModel addressModel)
        {
            string sourceDoc = this._environment.ContentRootPath + "/Content/Template/CoverPage_Pdf.docx";
            Stream document = new MemoryStream();

            using (var source = WordprocessingDocument.Open(sourceDoc, false))
            {
                using (var newDoc = source.Clone(document))
                {
                    newDoc.Save();
                }
            }

            using (WordprocessingDocument doc = WordprocessingDocument.Open(document, true))
            {
                var doct = doc.MainDocumentPart.Document;
                foreach (var table in doct.Body.Descendants<DocumentFormat.OpenXml.Wordprocessing.Table>())
                {
                    var rows = table.Descendants<DocumentFormat.OpenXml.Wordprocessing.TableRow>().ToList();
                    foreach (var row in rows)
                    {
                        foreach (var cell in row.Elements<DocumentFormat.OpenXml.Wordprocessing.TableCell>())
                        {
                            foreach (var para in cell.Elements<Paragraph>())
                            {
                                foreach (var runNew in para.Elements<Run>())
                                {
                                    foreach (var text in runNew.Elements<Text>())
                                    {
                                        if (para.InnerText.Contains("#ADTYPE#"))
                                        {
                                            text.Text = text.Text.Replace("#ADTYPE#", addressModel.Name);
                                        }

                                        if (para.InnerText.Contains("#ADDRESS#"))
                                        {
                                            text.Text = text.Text.Replace("#ADDRESS#", addressModel.Address);
                                        }

                                        if (para.InnerText.Contains("#STATE#"))
                                        {
                                            text.Text = text.Text.Replace("#STATE#", addressModel.State);
                                        }

                                        if (para.InnerText.Contains("#CITY#"))
                                        {
                                            text.Text = text.Text.Replace("#CITY#", addressModel.City);
                                        }

                                        if (para.InnerText.Contains("#ZIP#"))
                                        {
                                            text.Text = text.Text.Replace("#ZIP#", addressModel.ZipCode);
                                        }
                                        if (para.InnerText.Contains("#PHONE#"))
                                        {
                                            text.Text = text.Text.Replace("#PHONE#", addressModel.Phone);
                                        }
                                        if (para.InnerText.Contains("#FAX#"))
                                        {
                                            text.Text = text.Text.Replace("#FAX#", addressModel.Fax);
                                        }
                                        if (para.InnerText.Contains("#SDATE#"))
                                        {
                                            text.Text = text.Text.Replace("#SDATE#", Convert.ToDateTime(coverPage.SubmittalDate).ToString("MMM dd, yyyy"));
                                        }
                                        if (para.InnerText.Contains("#JOB#"))
                                        {
                                            text.Text = text.Text.Replace("#JOB#", coverPage.JobName);
                                        }
                                        if (para.InnerText.Contains("#SBCNT#"))
                                        {
                                            text.Text = text.Text.Replace("#SBCNT#", coverPage.Submittals);
                                        }
                                        if (para.InnerText.Contains("#PNAME#"))
                                        {
                                            text.Text = text.Text.Replace("#PNAME#", coverPage.ProjectManager?.Name);
                                        }
                                        if (para.InnerText.Contains("#PPHONE#"))
                                        {
                                            text.Text = text.Text.Replace("#PPHONE#", coverPage.ProjectManager?.Phone);
                                        }
                                        if (para.InnerText.Contains("#EEMAIL#"))
                                        {
                                            text.Text = text.Text.Replace("#EEMAIL#", coverPage.ProjectManager?.Email);
                                        }
                                        if (para.InnerText.Contains("#CNAME#"))
                                        {
                                            text.Text = text.Text.Replace("#CNAME#", coverPage.Contractor?.Name);
                                        }
                                        if (para.InnerText.Contains("#CNAME#"))
                                        {
                                            text.Text = text.Text.Replace("#CNAME#", coverPage.Contractor?.Name);
                                        }
                                        if (para.InnerText.Contains("#CADDRESS#"))
                                        {
                                            text.Text = text.Text.Replace("#CADDRESS#", coverPage.Contractor?.AddressLine1 + " " + coverPage.Contractor?.AddressLine2);
                                        }
                                        if (para.InnerText.Contains("#CSTATE#"))
                                        {
                                            text.Text = text.Text.Replace("#CSTATE#", coverPage.Contractor?.StateName + " " + coverPage.Contractor?.CityName + " " + coverPage.Contractor?.PostalCode);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            byte[] tempms = StreamHelper.ReadToEnd(document);

            //var docFile = this._environment.ContentRootPath + "/Content/cover_" + Guid.NewGuid().ToString() + ".doc";
            var pdfFile = this._environment.ContentRootPath + "/Content/cover_" + Guid.NewGuid().ToString() + ".pdf";
            //var outputDir = this._environment.ContentRootPath + "/Content/temppdf";
            //if(!Directory.Exists(outputDir))
            //{
            //    Directory.CreateDirectory(outputDir);
            //}
            //File.WriteAllBytes(docFile, tempms);
            var pdfInfo = ConvertToHtml(tempms, pdfFile, "letter");
            return pdfInfo;
        }

        [System.Obsolete]
        public void ConvertPdf(string inputFile, string outputFile, string outputDir, string imgPath, string type)
        {
            EndProcess();
            string exePath = this._environment.ContentRootPath + "/Content/WordToPdfConverter/WordToPDF.exe";

            var commandArgs = new List<string>();
            commandArgs.Add(inputFile);
            commandArgs.Add(outputFile);
            commandArgs.Add(outputDir);
            commandArgs.Add(imgPath);
            commandArgs.Add(type);
            // Use ProcessStartInfo class
            ProcessStartInfo startInfo = new ProcessStartInfo();
            startInfo.CreateNoWindow = false;
            startInfo.UseShellExecute = false;
            startInfo.FileName = exePath;
            startInfo.WindowStyle = ProcessWindowStyle.Normal;
            startInfo.Arguments = string.Join(" ", commandArgs);
            try
            {
                // Start the process with the info we specified.
                // Call WaitForExit and then the using statement will close.
                using (Process exeProcess = Process.Start(startInfo))
                {
                    exeProcess.WaitForExit();
                }
            }
            catch
            {
                // Log error.
                EndProcess();
            }
        }

        public static void EndProcess()
        {
            try
            {
                System.Diagnostics.Process[] pro = System.Diagnostics.Process.GetProcessesByName("WordToPDF.exe");
                foreach (System.Diagnostics.Process p in pro)
                {
                    p.Kill();
                }
            }
            catch (Exception ex)
            {

            }
        }

        public FileUploadInfo ConvertToHtml(byte[] byteArray, string pdfFile, string type)
        {
            //var fi = new FileInfo(file);

            //byte[] byteArray = File.ReadAllBytes(fi.FullName);
            FileUploadInfo fileUploadInfo = new FileUploadInfo();
            using (MemoryStream memoryStream = new MemoryStream())
            {
                memoryStream.Write(byteArray, 0, byteArray.Length);
                using (WordprocessingDocument wDoc = WordprocessingDocument.Open(memoryStream, true))
                {
                    /*var destFileName = new FileInfo("tempfile_" + Guid.NewGuid().ToString() + ".html");
                    if (outputDirectory != null && outputDirectory != string.Empty)
                    {
                        DirectoryInfo di = new DirectoryInfo(outputDirectory);
                        if (!di.Exists)
                        {
                            throw new OpenXmlPowerToolsException("Output directory does not exist");
                        }
                        destFileName = new FileInfo(Path.Combine(di.FullName, destFileName.Name));
                    }
                    var imageDirectoryName = destFileName.FullName.Substring(0, destFileName.FullName.Length - 5) + "_files";*/

                    int imageCounter = 0;

                    var pageTitle = "Pdf File Converter";
                    var part = wDoc.CoreFilePropertiesPart;
                    if (part != null)
                    {
                        pageTitle = (string)part.GetXDocument().Descendants(DC.title).FirstOrDefault() ?? "Pdf File Converter";
                    }

                    // TODO: Determine max-width from size of content area.
                    HtmlConverterSettings settings = new HtmlConverterSettings()
                    {
                        AdditionalCss = "body { margin: 1cm auto; max-width: 20cm; padding: 0; }",
                        PageTitle = pageTitle,
                        FabricateCssClasses = true,
                        CssClassPrefix = "pt-",
                        RestrictToSupportedLanguages = false,
                        RestrictToSupportedNumberingFormats = false,
                        ImageHandler = imageInfo =>
                        {
                            //DirectoryInfo localDirInfo = new DirectoryInfo(imageDirectoryName);
                            //if (!localDirInfo.Exists)
                            //    localDirInfo.Create();

                            ++imageCounter;
                            string extension = imageInfo.ContentType.Split('/')[1].ToLower();
                            ImageFormat imageFormat = null;
                            if (extension == "png")
                                imageFormat = ImageFormat.Png;
                            else if (extension == "gif")
                                imageFormat = ImageFormat.Gif;
                            else if (extension == "bmp")
                                imageFormat = ImageFormat.Bmp;
                            else if (extension == "jpeg")
                                imageFormat = ImageFormat.Jpeg;
                            else if (extension == "tiff")
                            {
                                // Convert tiff to gif.
                                extension = "gif";
                                imageFormat = ImageFormat.Gif;
                            }
                            else if (extension == "x-wmf")
                            {
                                extension = "wmf";
                                imageFormat = ImageFormat.Wmf;
                            }

                            // If the image format isn't one that we expect, ignore it,
                            // and don't return markup for the link.
                            if (imageFormat == null)
                                return null;

                            //string imageFileName = imageDirectoryName + "/image" +
                            //    imageCounter.ToString() + "." + extension;
                            //try
                            //{
                            //    imageInfo.Bitmap.Save(imageFileName, imageFormat);
                            //}
                            //catch (System.Runtime.InteropServices.ExternalException)
                            //{
                            //    return null;
                            //}
                            string imageSource = "https://chelsea.skdedu.in/Chelsea-logo.png";

                            XElement img = new XElement(Xhtml.img,
                                new XAttribute(NoNamespace.src, imageSource),
                                imageInfo.ImgStyleAttribute,
                                imageInfo.AltText != null ?
                                    new XAttribute(NoNamespace.alt, imageInfo.AltText) : null);
                            return img;
                        }
                    };
                    XElement htmlElement = HtmlConverter.ConvertToHtml(wDoc, settings);

                    // Produce HTML document with <!DOCTYPE html > declaration to tell the browser
                    // we are using HTML5.
                    var html = new XDocument(
                        new XDocumentType("html", null, null, null),
                        htmlElement);

                    // Note: the xhtml returned by ConvertToHtmlTransform contains objects of type
                    // XEntity.  PtOpenXmlUtil.cs define the XEntity class.  See
                    // http://blogs.msdn.com/ericwhite/archive/2010/01/21/writing-entity-references-using-linq-to-xml.aspx
                    // for detailed explanation.
                    //
                    // If you further transform the XML tree returned by ConvertToHtmlTransform, you
                    // must do it correctly, or entities will not be serialized properly.

                    var htmlString = html.ToString(SaveOptions.DisableFormatting);
                    //File.WriteAllText(destFileName.FullName, htmlString, Encoding.UTF8);

                    //var files = Directory.GetFiles(imageDirectoryName);
                    //foreach (var item in files)
                    //{
                    //    byte[] imageArray = System.IO.File.ReadAllBytes(DefaultImagePath);
                    //    string base64ImageRepresentation = Convert.ToBase64String(imageArray);
                    //}

                    /*iText.Html2pdf.ConverterProperties converterProperties = new iText.Html2pdf.ConverterProperties();
                    using (MemoryStream pdfStream = new MemoryStream(pdfFile))
                    {
                        //pdfStream.Write(byteArray, 0, byteArray.Length);
                        fileUploadInfo = _azureBlobServices.UploadFile(pdfStream, "/Content/" + fileName, "chelseadoc", false).GetAwaiter().GetResult();

                        iText.Kernel.Pdf.PdfDocument pdfDocument = new iText.Kernel.Pdf.PdfDocument(new iText.Kernel.Pdf.PdfWriter(pdfFile));
                        if (type == "landscape")
                        {
                            pdfDocument.SetDefaultPageSize(iText.Kernel.Geom.PageSize.LETTER.Rotate());
                        }
                        else
                        {
                            pdfDocument.SetDefaultPageSize(iText.Kernel.Geom.PageSize.LETTER);
                        }

                        iText.Html2pdf.HtmlConverter.ConvertToPdf(htmlString, pdfDocument, converterProperties);
                        pdfDocument.Close();
                    }*/

                    string fileName = "cover_" + Guid.NewGuid().ToString() + ".pdf";

                    //FileInfo fileInfo = new FileInfo(pdfFile);
                    //byte[] pdfArray = File.ReadAllBytes(fileInfo.FullName);


                    //File.Delete(pdfFile);


                    Byte[] pdfByte;
                    using (var ms = new MemoryStream())
                    {
                        iText.Html2pdf.HtmlConverter.ConvertToPdf(htmlString, ms);
                        pdfByte = ms.ToArray();
                    }
                    using (MemoryStream pdfStream = new MemoryStream())
                    {
                        pdfStream.Write(pdfByte, 0, pdfByte.Length);
                        fileUploadInfo = _azureBlobServices.UploadFile(pdfStream, "/Content/" + fileName, _appSetting.AzureBlobDocContainer, false).GetAwaiter().GetResult();
                    }

                    //string pdfName = @"D:\Data_Imp\Projects\StartingPoint\WordToPDF\WordToPDF\Quaterlyreport.pdf";
                    //File.WriteAllBytes(pdfFile, pdfByte);
                }
            }

            return fileUploadInfo;
        }

        [Obsolete]
        public Stream CombineMultiplePDFs(List<Stream> fileNames)
        {
            //if (File.Exists(outFile))
            //{
            //    File.Delete(outFile);
            //}

            Stream stream = new MemoryStream();

            iTextSharp.text.Document document = new iTextSharp.text.Document();
            iTextSharp.text.pdf.PdfCopy pdf = new iTextSharp.text.pdf.PdfCopy(document, stream);
            iTextSharp.text.pdf.PdfReader reader = null;
            try
            {
                document.Open();

                foreach (Stream file in fileNames)
                {
                    reader = new iTextSharp.text.pdf.PdfReader(file);
                    pdf.AddDocument(reader);
                    reader.Close();
                }
            }
            catch (Exception ex)
            {

                if (reader != null)
                {
                    reader.Close();
                }
            }
            finally
            {
                if (document != null)
                {
                    document.Close();
                }
            }
            /*string reportPath = "Content/MergePdf";
            string contentRootPath = _environment.ContentRootPath;
            if (!Directory.Exists(contentRootPath + reportPath))
            {
                Directory.CreateDirectory(contentRootPath + reportPath);
            }

            string rooPath = contentRootPath + reportPath;


            string pdfFileName = "MergedFile_" + Guid.NewGuid().ToString() + ".pdf";

            string pdfFileUrl = string.Format("{0}/{1}", rooPath, pdfFileName);
            var fileByte = StreamHelper.ReadToEnd(stream);
            System.IO.File.WriteAllBytes(pdfFileUrl, fileByte);*/
            return stream;
        }
        public string ConvertPDFtoJPG(Stream fileStream, string fileName, int pageNumber)
        {
            if(Environment.Is64BitOperatingSystem)
            {
                return ConvertPDFtoJPG32Bit(fileStream, fileName, pageNumber);
            }
            else
            {
                return ConvertPDFtoJPG32Bit(fileStream, fileName, pageNumber);
            }
        }

        public string ConvertPDFtoJPG32Bit(Stream fileStream, string fileName, int pageNumber)
        {
            PDFLibNet32.PDFWrapper _pdfDoc = new PDFLibNet32.PDFWrapper();
            _pdfDoc.LoadPDF(fileStream);

            Image img = RenderPage32Bit(_pdfDoc, pageNumber);

            Stream stream = new MemoryStream();

            img.Save(stream, ImageFormat.Png);

            var fileUploadInfo = _azureBlobServices.UploadFile(stream, "/Content/" + fileName, _appSetting.AzureBlobMainImageContainer, false).GetAwaiter().GetResult();

            //for (int i = 0; i < _pdfDoc.PageCount; i++)
            //{

            //    Image img = RenderPage(_pdfDoc, i);

            //    img.Save(Path.Combine(dirOut, string.Format("{0}{1}.jpg", i, DateTime.Now.ToString("mmss"))));

            //}
            _pdfDoc.Dispose();
            return fileUploadInfo.Path;
        }

        public string ConvertPDFtoJPG64Bit(Stream fileStream, string fileName, int pageNumber)
        {
            PDFLibNet64.PDFWrapper _pdfDoc = new PDFLibNet64.PDFWrapper();
            _pdfDoc.LoadPDF(fileStream);

            Image img = RenderPage64Bit(_pdfDoc, pageNumber);

            Stream stream = new MemoryStream();

            img.Save(stream, ImageFormat.Png);

            var fileUploadInfo = _azureBlobServices.UploadFile(stream, "/Content/" + fileName, _appSetting.AzureBlobMainImageContainer, false).GetAwaiter().GetResult();

            //for (int i = 0; i < _pdfDoc.PageCount; i++)
            //{

            //    Image img = RenderPage(_pdfDoc, i);

            //    img.Save(Path.Combine(dirOut, string.Format("{0}{1}.jpg", i, DateTime.Now.ToString("mmss"))));

            //}
            _pdfDoc.Dispose();
            return fileUploadInfo.Path;
        }
        public Image RenderPage64Bit(PDFLibNet64.PDFWrapper doc, int page)
        {
            doc.CurrentPage = page + 1;
            doc.CurrentX = 0;
            doc.CurrentY = 0;

            doc.RenderPage(IntPtr.Zero);

            // create an image to draw the page into
            var buffer = new Bitmap(doc.PageWidth, doc.PageHeight);
            doc.ClientBounds = new Rectangle(0, 0, doc.PageWidth, doc.PageHeight);
            using (var g = Graphics.FromImage(buffer))
            {
                var hdc = g.GetHdc();
                try
                {
                    doc.DrawPageHDC(hdc);
                }
                finally
                {
                    g.ReleaseHdc();
                }
            }
            return buffer;

        }

        public Image RenderPage32Bit(PDFLibNet32.PDFWrapper doc, int page)
        {
            doc.CurrentPage = page + 1;
            doc.CurrentX = 0;
            doc.CurrentY = 0;

            doc.RenderPage(IntPtr.Zero);

            // create an image to draw the page into
            var buffer = new Bitmap(doc.PageWidth, doc.PageHeight);
            doc.ClientBounds = new Rectangle(0, 0, doc.PageWidth, doc.PageHeight);
            using (var g = Graphics.FromImage(buffer))
            {
                var hdc = g.GetHdc();
                try
                {
                    doc.DrawPageHDC(hdc);
                }
                finally
                {
                    g.ReleaseHdc();
                }
            }
            return buffer;

        }
    }
}
