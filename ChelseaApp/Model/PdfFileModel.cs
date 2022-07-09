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
        public int Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string MFG { get; set; }
        public string Part { get; set; }
        public string Description { get; set; }
        public string FileTmpPath { get; set; }
        public string Volt { get; set; }
        public string Lamp { get; set; }
        public string Dim { get; set; }
        public string Runs { get; set; }
        public List<FileModel> Files { get; set; }
    }

    public class FileModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PdfFileId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileSize { get; set; }
        public string Thumbnail { get; set; }
        public string OrgFileName { get; set; }
    }
}
