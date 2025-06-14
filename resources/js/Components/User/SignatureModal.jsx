"use client"

import { useRef, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import SignatureCanvas from "react-signature-canvas"
import { X, RefreshCw, Check } from "lucide-react"

const SignatureModal = ({ isOpen, onClose, onSave }) => {
  const [isMounted, setIsMounted] = useState(false)
  const sigCanvas = useRef()

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const handleClear = () => {
    sigCanvas.current.clear()
  }

  const handleSave = () => {
    if (sigCanvas.current.isEmpty()) {
      onSave(null);
      return;
    }
  
    // Convert signature canvas to a Blob
    sigCanvas.current.getTrimmedCanvas().toBlob((blob) => {
      if (!blob) return;
  
      // Generate a unique filename
      const uniqueFileName = `signature_${Date.now()}.png`;
  
      // Convert Blob to File
      const signatureFile = new File([blob], uniqueFileName, { type: "image/png" });
  
      // Pass file to parent component
      onSave(signatureFile);
    }, "image/png");
  };
  
  if (!isMounted) return null

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300 ease-in-out`}
    >
      <div className="fixed inset-0 bg-black bg-opacity-30"></div>
      <div className="bg-white rounded-lg shadow-xl z-10 w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 translate-y-4 sm:scale-100 sm:opacity-100 sm:translate-y-0">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Signature</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          <div className="border-2 border-gray-200 rounded-lg mb-6 overflow-hidden">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 600,
                height: 300,
                className: "signature-canvas w-full h-full",
              
              }}
              backgroundColor="rgba(255, 255, 255, 0)"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleClear}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Clear
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              <Check className="w-5 h-5 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default SignatureModal
