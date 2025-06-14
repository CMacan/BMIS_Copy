import React, { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";
import { useToast } from "@/Contexts/ToastContext";

const ImportButton = ({ onImportSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const showToast = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      if (!validTypes.includes(selectedFile.type)) {
        showToast("Please select a valid CSV or Excel file.", "error");
        e.target.value = ''; // Reset the input
        return;
      }
      
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast("File size exceeds 10MB limit.", "error");
        e.target.value = ''; // Reset the input
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();

    if (!file) {
      showToast("Please select a file to import.", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    
    // Add CSRF token if Laravel requires it
    const token = document.querySelector('meta[name="csrf-token"]');
    if (token) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
    }

    try {
      const response = await axios.post('/admin/voters/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setIsUploading(false);
      setShowModal(false);
      setFile(null);
      setUploadProgress(0);

      if (response.data.success) {
        showToast(response.data.message, "success");

        if (response.data.warnings) {
          console.warn("Import warnings:", response.data.warning_messages || response.data.warningMessages);
        }

        if (onImportSuccess) {
          // Check various property names the backend might use
          const importedData = response.data.voters || 
                              response.data.imported_voters || 
                              response.data.imported_count || 
                              [];
          onImportSuccess(importedData);
        }
      } else {
        showToast(response.data.message || "Import failed.", "error");
      }
    } catch (error) {
      setIsUploading(false);
      setUploadProgress(0);
      
      console.error("Import error details:", error);
      
      // More detailed error handling
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        console.error("Server error response:", error.response.data);
        
        if (error.response.status === 422) {
          // Validation errors
          const errorMessages = error.response.data.errors 
            ? Object.values(error.response.data.errors).flat().join(', ')
            : error.response.data.message;
          showToast(errorMessages || "Validation failed.", "error");
        } else if (error.response.status === 500) {
            const serverError = error.response.data.message || "Server error";
            showToast(`${serverError}. Please check if your file format is correct and try again.`, "error");
            
            // Log full error details for debugging
            console.error('Full server error response:', error.response.data);
        } else {
          showToast(error.response.data.message || `Error (${error.response.status})`, "error");
        }
      } else if (error.request) {
        // The request was made but no response was received
        showToast("No response from server. Please check your connection.", "error");
      } else {
        // Something happened in setting up the request
        showToast("Request failed: " + error.message, "error");
      }
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get('/admin/voters/template-download', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voter_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      showToast("Failed to download template", "error");
    }
  };

  return (
    <>
      <button 
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
        onClick={() => setShowModal(true)}
      >
        <Upload className="w-4 h-4" />
        Import
      </button>

      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-6 pb-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-gray-900">Import Voters</h3>
                  <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a CSV or Excel file with voter information. 
                    Make sure it follows the required format.
                  </p>
                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Download template format
                  </button>
                </div>
                
                <form onSubmit={handleImport} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Accepted formats: .csv, .xlsx, .xls (Max 10MB)
                    </p>
                  </div>
                  
                  {isUploading && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 text-center">
                        {uploadProgress}% Uploaded
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading || !file}
                      className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-70"
                    >
                      {isUploading ? "Importing..." : "Import Voters"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImportButton;