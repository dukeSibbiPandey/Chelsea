using ChelseaApp.Model;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ChelseaApp.DocHelper
{
    public interface IDocUtility
    {
        FileUploadInfo SaveCoverPage(CoverPageModel coverPage, AddressModel addressModel);
        string CombineMultiplePDFs(PdfFileModel model, List<Stream> fileNames);
        string ConvertPDFtoJPG(Stream fileStream, string fileName, int pageNumber);
        List<string> CreateIndexPage(List<PdfFileModel> streams);
        byte[] CombineMultiplePDFFiles(List<string> fileNames);
    }
}
