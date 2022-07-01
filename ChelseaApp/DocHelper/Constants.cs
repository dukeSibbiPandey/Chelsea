namespace ChelseaApp.DocHelper
{
    public static class Constants
    {
        public const int DefaultPageLimit = 10;
        public const string DefaultPrefixRoute = "api/v{version:apiVersion}";
        public const string Swagger_Security_Password = "oauth.password";
        public const string Swagger_Security_ClientCredentials = "oauth.clientCredentials";
        public const string Swagger_Security_Implicit = "oauth.implicit";
        public const string Authorization = "Authorization";
        public const string AuthenticationScheme = "Bearer";
        public const string AuthenticationAzureAdScheme = "AzureAd";
        public const string DateFormat = "MM-dd-yyyy hh:mm tt";
        public const string Empty = "";

        public const int STATUS_PENDING = 1;
        public const int STATUS_InProgress = 2;
        public const int STATUS_Done = 3;
        public static class Scope
        {
            public const string All = "All";
            public const string Product = "Cutomer";
        }
        public static class URLHelper
        {
            public static string UserResetPasswordUrl { get; set; }
            public static string UserEmailConfirmUrl { get; set; }

        }
        public static class Policy
        {
            public const string Product = "Customer";
            //public const string Product_Insert = "Product.Get";
            //public const string Product_GetById = "Product.GetById";
            //public const string Product_Insert = "Product.Insert";
            //public const string Product = "Product";
        }
        public static class Strings
        {
            public static class JwtClaimIdentifiers
            {
                public const string Rol = "rol", Id = "id", UserId = "UserId", Email = "Email";
            }
            public static class AuthType
            {
                public const string Token = "Token", Cookies = "id";
            }
            public static class JwtClaims
            {
                public const string ApiAccess = "api_access";
            }
        }
    }

    public enum EntityType
    {
        Customer = 1,
        Item = 2
    }
}
