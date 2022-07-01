using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace ChelseaApp.DocHelper
{
    public interface IAzureBlobServices
    {
        public string FileContainer { get; }
        Task<FileUploadInfo> UploadFile(Stream stream, string fileName, string subdirectory = Constants.Empty, bool isTemp = false);
        Task<FileUploadInfo> UploadFile(Stream stream, string fileName, string subdirectory, string connection);
        Task<IEnumerable<string>> GetListFile(string subdirectory = Constants.Empty);
        Task<Stream> DownloadFile(string fileName, string subdirectory = Constants.Empty);
        Task<FileUploadInfo> FinalProcess(string existfileName, string newFileName);
        Task DeleteFile(string fileName, string subdirectory = Constants.Empty);
        Task<string> GetPath(string fileName, string subdirectory = Constants.Empty);
    }
    public class FileUploadInfo
    {
        public string Path { get; set; }
        public string ContainetPath { get; set; }
    }
}
