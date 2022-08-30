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
        List<string> CreateIndexPage(List<PdfFileModel> streams, SubmittalList submittal);
        byte[] CombineMultiplePDFFiles(List<string> fileNames);
        List<string> CreateBookMarks(List<BookmarkModel> streams);
    }
}
