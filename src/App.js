import React from 'react';
import './App.css';
import UploadToAzure from './UploadToAzure'; // Import the component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <h1>Upload PDF</h1>
        <div className="App">
          <header className="nav">
            <UploadToAzure />
          </header>
        </div>
    </div>

  );
}

export default App;
