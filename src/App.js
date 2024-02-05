import React, { useState } from 'react';
import './App.css';
import UploadToAzure from './UploadToAzure';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import react-pdf-viewer components
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';

function App() {
  const [viewPdf, setViewPdf] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleFileUploadSuccess = (pdfUrl) => {
    setViewPdf(pdfUrl);
  };

  return (
    <div className="App">
      <ToastContainer />
      <h1>Upload PDF</h1>
      <div className="App">
        <header className="nav">
          {/* Pass the success handler as a prop to UploadToAzure */}
          <UploadToAzure onUploadSuccess={handleFileUploadSuccess} />
        </header>
        <div className='pdf-container'>
          {/* Show PDF Viewer if there's a PDF URL */}
          {viewPdf ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
              <Viewer fileUrl={viewPdf} plugins={[defaultLayoutPluginInstance]} />
            </Worker>
          ) : (
            <>No pdf file selected</>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
