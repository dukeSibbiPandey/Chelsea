using Chelsea.Repository;
using ChelseaApp.Model;
using iTextSharp.text.pdf;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ChelseaApp.DocHelper
{
    public interface IDocUtility
    {
        FileUploadInfo SaveCoverPage(CoverPageModel coverPage, AddressModel addressModel, string logoPath);
        string CombineMultiplePDFs(PdfFileModel model, List<PdfReader> fileNames);
        string ConvertPDFtoJPG(Stream fileStream, string fileName, int pageNumber);
        List<string> CreateIndexPage(List<PdfFileModel> streams, SubmittalList submittalList);
        byte[] CombineMultiplePDFFiles(List<string> fileNames);
        string CreateBookMarks(List<PdfFileModel> streams, byte[] filebyte);
    }
}
