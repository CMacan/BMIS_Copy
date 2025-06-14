import { Upload, FileText, AlertTriangle } from "lucide-react";
import StepContainer from "./StepContainer";

export default function DocumentUploadStep({ 
  title = "Upload Document", 
  description = "Please upload a scanned copy of your PWD ID or medical certificate.", 
  acceptedFormats = ".jpg,.jpeg,.png,.pdf", 
  file, 
  setFile, 
  errors, 
  setErrors,  
  formSubmitted, // ✅ Passed from parent
}) {

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // ✅ Clear error when a file is selected
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.soloParentDocument; // Remove error for PWD document
        return newErrors;
      });
    }
  };

  return (
    <StepContainer icon={<FileText className="w-5 h-5 text-indigo-600" />} title={title} description={description}>
      <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center 
        ${errors.soloParentDocument ? "border-red-300 hover:border-red-400 from-red-50/50 to-red-100/50" : "border-indigo-200 hover:border-indigo-400 from-indigo-50/50 to-blue-50/50"}`}>
        <input 
          type="file" 
          accept={acceptedFormats} 
          onChange={handleFileChange} 
          className="hidden" 
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <Upload className="w-10 h-10 text-indigo-500 mb-2" />
            <span className="text-indigo-700 font-semibold">Click to upload</span>
            <p className="text-sm text-gray-500 mt-1">Accepted formats: {acceptedFormats}</p>
          </div>
        </label>
        
        {file && (
          <p className="mt-3 text-sm text-green-600">✅ Selected file: {file.name}</p>
        )}

        {/* ✅ Only display error if user has attempted to submit and no file is uploaded */}
        {formSubmitted && errors?.pwdDocument && !file && (
    <div className="mt-3 flex items-center bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 shadow-md">
        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
        <span className="text-sm font-semibold">{errors.pwdDocument}</span>
    </div>
)}
      </div>
    </StepContainer>
  );
}
