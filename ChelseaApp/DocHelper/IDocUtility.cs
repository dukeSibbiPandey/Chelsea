using ChelseaApp.Model;
using System.Collections.Generic;
using System.IO;

namespace ChelseaApp.DocHelper
{
    public interface IDocUtility
    {
        FileUploadInfo SaveCoverPage(CoverPageModel coverPage, AddressModel addressModel);
        byte[] CombineMultiplePDFs(List<Stream> fileNames);
        string ConvertPDFtoJPG(Stream fileStream, string fileName, int pageNumber);
    }
}
