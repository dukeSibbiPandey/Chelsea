using ChelseaApp.Model;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Hosting;
using OpenXmlPowerTools;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace ChelseaApp.DocHelper
{
    public class DocUtility
    {
        [System.Obsolete]
        public readonly IHostingEnvironment _environment;

        [System.Obsolete]
        public DocUtility(IHostingEnvironment environment)
        {
            this._environment = environment;
        }

        [System.Obsolete]
        public Stream SaveCoverPage(CoverPageModel coverPage, AddressModel addressModel)
        {
            string sourceDoc = this._environment.ContentRootPath + "/Content/Template/CoverPage.docx";
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
                foreach (var run in doct.Descendants<TextBoxContent>())
                {
                    var paras = run.Elements<Paragraph>();
                    foreach (var para in paras)
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
                                    text.Text = text.Text.Replace("#SDATE#", coverPage.SubmittalDate);
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

            /*byte[] tempms = StreamHelper.ReadToEnd(document);

            var docFile = this._environment.ContentRootPath + "/Content/cover_" + Guid.NewGuid().ToString() + ".doc";
            var pdfFile = this._environment.ContentRootPath + "/Content/cover.pdf";
            var outputDir = this._environment.ContentRootPath + "/Content/temppdf";
            if(!Directory.Exists(outputDir))
            {
                Directory.CreateDirectory(outputDir);
            }
            File.WriteAllBytes(docFile, tempms);*/
            //ConvertPdf(docFile, pdfFile, outputDir, outputDir + "/images", "letter");
            return document;
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

        public static void ConvertToHtml(string file, string pdfFile, string outputDirectory, string imagePath, string type)
        {
            var fi = new FileInfo(file);
           
            byte[] byteArray = File.ReadAllBytes(fi.FullName);
            using (MemoryStream memoryStream = new MemoryStream())
            {
                memoryStream.Write(byteArray, 0, byteArray.Length);
                using (WordprocessingDocument wDoc = WordprocessingDocument.Open(memoryStream, true))
                {
                    var destFileName = new FileInfo(fi.Name.Replace(".doc", ".html"));
                    if (outputDirectory != null && outputDirectory != string.Empty)
                    {
                        DirectoryInfo di = new DirectoryInfo(outputDirectory);
                        if (!di.Exists)
                        {
                            throw new OpenXmlPowerToolsException("Output directory does not exist");
                        }
                        destFileName = new FileInfo(Path.Combine(di.FullName, destFileName.Name));
                    }
                    var imageDirectoryName = destFileName.FullName.Substring(0, destFileName.FullName.Length - 5) + "_files";
                    int imageCounter = 0;

                    var pageTitle = fi.FullName;
                    var part = wDoc.CoreFilePropertiesPart;
                    if (part != null)
                    {
                        pageTitle = (string)part.GetXDocument().Descendants(DC.title).FirstOrDefault() ?? fi.FullName;
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
                            DirectoryInfo localDirInfo = new DirectoryInfo(imageDirectoryName);
                            if (!localDirInfo.Exists)
                                localDirInfo.Create();
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

                            string imageFileName = imageDirectoryName + "/image" +
                                imageCounter.ToString() + "." + extension;
                            try
                            {
                                imageInfo.Bitmap.Save(imageFileName, imageFormat);
                            }
                            catch (System.Runtime.InteropServices.ExternalException)
                            {
                                return null;
                            }
                            string imageSource = "http://localhost:4450/" + imagePath + "/" + localDirInfo.Name + "/image" +
                                imageCounter.ToString() + "." + extension;

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
                    File.WriteAllText(destFileName.FullName, htmlString, Encoding.UTF8);

                    //var files = Directory.GetFiles(imageDirectoryName);
                    //foreach (var item in files)
                    //{
                    //    byte[] imageArray = System.IO.File.ReadAllBytes(DefaultImagePath);
                    //    string base64ImageRepresentation = Convert.ToBase64String(imageArray);
                    //}

                    iText.Html2pdf.ConverterProperties converterProperties = new iText.Html2pdf.ConverterProperties();

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

                    /*Byte[] pdfByte;
                    using (var ms = new MemoryStream())
                    {
                        iText.Html2pdf.HtmlConverter.ConvertToPdf(htmlString, ms);
                        pdfByte = ms.ToArray();
                    }
                    //string pdfName = @"D:\Data_Imp\Projects\StartingPoint\WordToPDF\WordToPDF\Quaterlyreport.pdf";
                    File.WriteAllBytes(pdfFile, pdfByte);*/
                }
            }
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
    }
}
