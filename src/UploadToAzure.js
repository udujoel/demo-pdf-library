import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadToAzure(props) {
    const [file, setFile] = useState(null);

    const onFileChange = event => {
        setFile(event.target.files[0]);
    };

    const onUpload = async () => {
        if (!file) return;

        try {
            // Fetch the SAS token from your backend
            const { data: { token } } = await axios.get('https://sas-backend.agreeableglacier-350650a2.australiaeast.azurecontainerapps.io:3001/sas-token');

            // Instantiate a new BlobServiceClient with the SAS URL
            const blobServiceClient = new BlobServiceClient(token);

            const date = new Date();
            const dateString = date.toISOString().split('T')[0];
            // Get a container client from the BlobServiceClient
            const containerClient = blobServiceClient.getContainerClient(dateString);

            // Get a block blob client
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);

            // Upload the file
            await blockBlobClient.uploadBrowserData(file, {
                // You can add options here like progress updates
                onProgress: (progressEvent) => {
                    console.log(`Uploaded ${progressEvent.loadedBytes} of ${file.size}`);
                }
            });
            // Assuming the blobs are publicly accessible, construct the URL
            // You might need to adjust this URL based on your Azure Storage configuration
            const uploadedFileUrl = `https://${blobServiceClient.accountName}.blob.core.windows.net/${containerClient.containerName}/${dateString}/${file.name}`;
            console.log(uploadedFileUrl)
            // Call the onUploadSuccess prop with the URL of the uploaded PDF
            props.onUploadSuccess(uploadedFileUrl);
            toast.success('File uploaded to Azure Blob Storage.');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed', error);
        }
    };

    return (
            <div className='container'>
                <input type="file" className='form-control' onChange={onFileChange} accept=".pdf" />
                <button onClick={onUpload} className='btn btn-success btn-lg'>Upload PDF</button>
            </div>
    );
}

export default UploadToAzure;
