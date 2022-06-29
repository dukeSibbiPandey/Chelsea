using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chelsea.Repository
{
    public class PdfFiles
    {
        public int Id { get; set; }
        public int SubmittalId { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public string MFG { get; set; }
        public string Part { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
    }
}
