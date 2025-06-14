'use client';

import { useState, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import { X,Edit, Save, Image} from 'lucide-react';
import { useToast } from '@/Contexts/ToastContext';
import Modal from '@/Components/Modal';

export default function BarangayLogoSection({ barangay }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);
  const showToast = useToast();

  const { data, processing, setData, post, reset } = useForm({
    bar_logo: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

      // Set file to form data
    setData('bar_logo', file);
  };
    

  const handleSave = (e) => {
    e.preventDefault();

    if (!data.bar_logo) {
      showToast('Please select a file first.', 'error');
      return;
    }
  
  const formData = new FormData();
  formData.append('bar_logo', data.bar_logo);


  post(route('update.logo'), {
      data: formData,
      forceFormData: true, 
      onSuccess: () => {
        showToast('Barangay logo updated successfully.', 'success');
        setIsModalOpen(false);
        reset();
      },
      onError: () => {
        showToast('Failed to update logo. Please try again.', 'error');
      },
    });
  };

    const currentBarangayLogo = barangay?.bar_logo && barangay.bar_logo !== ''
    ? `/${barangay.bar_logo}`
    : '/images/defaultlogo.jpg'; // Default logo

  return (
    <div className="bg-white rounded-lg p-6 border-1">
      <div className="flex flex-col items-center">

        {/* Clickable Barangay Logo */}
        <div className="relative group">
          <div
            className={`w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg 
            transition-transform duration-300 ease-in-out 
            group-hover:shadow-[0_0_25px_5px_rgba(59,150,246,0.5)]
            cursor-pointer`}
            onClick={() => setIsPreviewOpen(true)} // Only Preview
          >
            <img
              src={previewUrl || currentBarangayLogo}
              alt="Barangay Logo"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Edit Button */}
        <p
          onClick={() => setIsModalOpen(true)}
          className="mt-3 text-lg text-blue-500 flex items-center gap-1 cursor-pointer hover:text-blue-900 transition-colors duration-200 ease-in-out"
        >
          <Edit className="w-4 h-4" />
          <span className="font-semibold">Edit Logo</span>
        </p>
      </div>
      <hr className="mt-4 border-t border-gray-400" />

      {/* Modal for Viewing Image in Full Size */}
      <Modal show={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} maxWidth="lg">
        <div className="p-10 bg-white flex flex-col items-center relative">
             <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-2 right-2 p-2 bg-gray-500/50 backdrop-blur-md rounded-full text-white hover:bg-gray-700 transition" >
                <X className="w-5 h-5" />
            </button>
          <div className="relative">
            <img
              src={previewUrl || currentBarangayLogo}
              alt="BarangayLogo"
              className="w-96 h-96 object-cover rounded-lg"
            />
          </div>
        </div>
      </Modal>

      {/* Modal for Changing Logo */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
        <div className="p-6 bg-white">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-black mb-5">Barangay Logo</h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-6 relative group">
              <div
                className={`relative overflow-hidden rounded-full border-4 border-white shadow-lg
                  transition-all duration-300 ease-in-out w-48 h-48 
                  ${processing ? 'opacity-50' : ''}`}
              >
                <img
                  src={previewUrl || currentBarangayLogo}
                  alt="Barangay Logo Preview"
                  className="w-full h-full object-cover rounded-full transition-all duration-300 ease-in-out"
                />
              </div>

              {/* Upload Button Overlay */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`absolute inset-0 flex items-center justify-center rounded-full
                  bg-black/60 opacity-0 group-hover:opacity-100
                  transition-all duration-200 ease-in-out
                  cursor-pointer backdrop-blur-sm
                  ${processing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Image className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={processing}
            />
          </div>

         
          <div className="flex flex-row w-full gap-3">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors w-1/2"
              disabled={processing}
            >
              <Save className="w-5 h-5" />
              {processing ? 'Saving...' : 'Save New Logo'}
            </button>
            <button
              onClick={() => {
                setPreviewUrl(null);
                setIsModalOpen(false);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-black hover:bg-red-600 hover:text-white transition-colors w-1/2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
