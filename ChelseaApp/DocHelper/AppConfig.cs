namespace ChelseaApp.DocHelper
{
    public class AppConfig
    {
        public string AppName { get; set; }
        public string AzureBlobDocContainer { get; set; }
        public string AzureBlobTempContainer { get; set; }
        public string AzureBlobMainImageContainer { get; set; }
        public ConnectionString ConnectionStrings { get; set; }
        public AzureAd AzureAd { get; set; }
        
    }
    public class ConnectionString
    {
        public string DefaultDatabaseConnection { get; set; }
        public string AzureBlobConnection { get; set; }
    }
    public class AzureAd
    {
        public string ClientId { get; set; }
        public string Authority { get; set; }
        public string RedirectUri { get; set; }
        public string CacheLocation { get; set; }
    }
}
