namespace ChelseaApp.DocHelper
{
    using Azure.Storage.Blobs;
    using Azure.Storage.Blobs.Models;
    using Microsoft.Extensions.Options;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    public class AzureBlobServices: IAzureBlobServices
    {
        public readonly AppConfig _appSetting;

        public string FileContainer => _appSetting.AzureBlobDocContainer;

        public AzureBlobServices(IOptions<AppConfig> appSettings)
        {
            _appSetting = appSettings.Value;
        }
        public string GetEntityFileContainer(EntityType entityType, bool isTemp = false)
        {
            return entityType.ToString().ToLower() + "-" + FileContainer;
        }
        public async Task<BlobContainerClient> GetContainer(string subdirectory = Constants.Empty)
        {
            BlobServiceClient blobServiceClient = new(_appSetting.AzureBlobConnection);
            string containerName = _appSetting.AzureBlobContainer;
            if (!string.IsNullOrWhiteSpace(subdirectory))
                containerName = subdirectory;
            // Create the container and return a container client object
            BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient(containerName);
            await containerClient.CreateIfNotExistsAsync();
            return containerClient;
        }
        public async Task<FileUploadInfo> UploadFile(Stream stream, string fileName, string subdirectory = Constants.Empty, bool isTemp = false)
        {
            if (string.IsNullOrWhiteSpace(subdirectory))
                subdirectory = isTemp ? _appSetting.AzureBlobTempContainer : string.Empty;
            var containerClient = await GetContainer(subdirectory);
            // Get a reference to a blob
            BlobClient blobClient = containerClient.GetBlobClient(fileName);
            stream.Position = 0;
            // Open the file and upload its data
            var info = await blobClient.UploadAsync(stream, true);
            return new FileUploadInfo
            {
                Path = blobClient.Uri.AbsoluteUri
            };
        }

        public async Task<IEnumerable<string>> GetListFile(string subdirectory = Constants.Empty)
        {
            var list = new List<string>();
            var contain = await GetContainer(subdirectory);
            await foreach (BlobItem blobItem in contain.GetBlobsAsync())
            {
                list.Add(blobItem.Name);
            }
            return list;
        }
        public async Task<FileUploadInfo> FinalProcess(string existfileName, string newFileName)
        {
            var containerClient = await GetContainer(_appSetting.AzureBlobTempContainer);
            // Get a reference to a blob
            BlobClient blobClient = containerClient.GetBlobClient(existfileName);
            // Download the blob's contents and save it to a file
            BlobDownloadInfo download = await blobClient.DownloadAsync();
            var existingstream = download.Content;
            var desccontainerClient = await GetContainer();
            // Get a reference to a blob
            BlobClient blobClientd = desccontainerClient.GetBlobClient(newFileName);
            var d = await blobClientd.UploadAsync(existingstream);
            //var d =  await UploadFile(existingstream, newFileName);
            await blobClient.DeleteIfExistsAsync();
            return new FileUploadInfo
            {
                Path = blobClientd.Uri.AbsoluteUri
            };
        }
        public async Task<Stream> DownloadFile(string fileName, string subdirectory = Constants.Empty)
        {
            var containerClient = await GetContainer(subdirectory);
            // Get a reference to a blob
            fileName = GetRecognizeFileName(fileName);
            BlobClient blobClient = containerClient.GetBlobClient(fileName);
            try
            {
                BlobDownloadInfo download = await blobClient.DownloadAsync();
                return download.Content;
            }
            catch (Azure.RequestFailedException ex)
            {
                if (ex.ErrorCode?.ToLower() == "BlobNotFound".ToLower())
                {
                    blobClient = containerClient.GetBlobClient(fileName.Replace("jpg", "jpeg"));
                    BlobDownloadInfo download = await blobClient.DownloadAsync();
                    return download.Content;
                }
                else
                    throw ex;
            }
            // Download the blob's contents and save it to a file

        }
        public async Task DeleteFile(string fileName, string subdirectory = Constants.Empty)
        {
            var containerClient = await GetContainer(subdirectory);
            // Get a reference to a blob
            fileName = GetRecognizeFileName(fileName);
            BlobClient blobClient = containerClient.GetBlobClient(fileName);
            // Download the blob's contents and save it to a file
            await blobClient.DeleteIfExistsAsync();
        }
        private string GetRecognizeFileName(string fileName)
        {
            return fileName;
            if (Path.GetExtension(fileName) == null)
            {
                return fileName;
            }
            else
                return Path.GetFileName(fileName);
        }

        public Task<FileUploadInfo> UploadFile(Stream stream, string fileName, string subdirectory, string connection)
        {
            throw new NotImplementedException();
        }

        public Task<string> GetPath(string fileName, string subdirectory = "")
        {
            throw new NotImplementedException();
        }
    }
}
