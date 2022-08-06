namespace ChelseaApp.Model
{
    public class CoverPageModel
    {
        public int Id { get; set; }
        public string SubmittalDate { get; set; }
        public string JobName { get; set; }
        public string Submittals { get; set; }
        public int AddressId { get; set; }
        public string Status { get; set; }
        public ProjectManagerModel ProjectManager { get; set; }
        public ContractorModel Contractor { get; set; }
    }

    public class ContractorModel
    {
        public string Name { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public int StateId { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string StateName { get; set; }
        public string CityName { get; set; }
    }

    public class ProjectManagerModel
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }
}
