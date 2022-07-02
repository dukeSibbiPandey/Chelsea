using System.Collections.Generic;

namespace ChelseaApp.Model
{
    public class PdfFileMasterModel
    {
        public int SubmittalId { get; set; }
        public List<PdfFileModel> PdfFiles { get; set; }
    }
    public class PdfFileModel
    {
        public string Name { get; set; }
        public string Status { get; set; }
        public string MFG { get; set; }
        public string Part { get; set; }
        public string Description { get; set; }
        public List<FileModel> Files { get; set; }
    }

    public class FileModel
    {
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileSize { get; set; }
        public string Thumbnail { get; set; }
        public string OrgFileName { get; set; }
    }
}
