import React, { useState } from 'react';
import { BlobServiceClient } from '@azure/storage-blob';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadToAzure() {
    const [file, setFile] = useState(null);

    const onFileChange = event => {
        setFile(event.target.files[0]);
    };

    const onUpload = async () => {
        if (!file) return;

        try {
            // Fetch the SAS token from your backend
            const { data: { token } } = await axios.get('http://localhost:3001/sas-token');

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

            toast.success('File uploaded to Azure Blob Storage.');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={onFileChange} accept=".pdf" />
            <button onClick={onUpload}>Upload to Azure</button>
        </div>
    );
}

export default UploadToAzure;
