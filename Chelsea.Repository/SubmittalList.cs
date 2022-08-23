using System;

namespace Chelsea.Repository
{
    public class SubmittalList
    {
        public long Id { get; set; }
        public string FileName { get; set; }
        public string Thumbnail { get; set; }
        public decimal FileSize { get; set; }
        public int? AddressId { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public string JobName { get; set; }
        public string Submittals { get; set; }
        public string ProjectManagerName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string ContractorName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public int? StateId { get; set; }
        public string City { get; set; }
        public string Zip { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CoverPageName { get; set; }
        public bool? IsTempRecord { get; set; }
        public string Status { get; set; }
        public bool? IsDraft { get; set; }
    }
}
