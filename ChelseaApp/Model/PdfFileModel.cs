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
        public List<string> Files { get; set; }
    }
}
