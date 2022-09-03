using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ChelseaApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string connectionString = Configuration.GetConnectionString("DefaultDatabaseConnection");
            var columnOptions = new ColumnOptions
            {
                AdditionalColumns = new Collection<SqlColumn>
                 {
                   new SqlColumn("UserName", SqlDbType.NVarChar)
                 }
            };
            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext().WriteTo.File("log/log.txt", rollingInterval: RollingInterval.Day)
                .WriteTo.MSSqlServer(connectionString, sinkOptions: new MSSqlServerSinkOptions { TableName = "AuditLog" }
                , null, null, LogEventLevel.Error, null, columnOptions: columnOptions, null, null)
                .CreateLogger();
            CreateHostBuilder(args).Build().Run();
        }

        public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
        .SetBasePath(Directory.GetCurrentDirectory())
        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
        .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
        .Build();
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                }).UseSerilog();
    }
}
