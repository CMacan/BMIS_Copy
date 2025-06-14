"use client"

import { useState, useRef, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import { Camera, Loader2, X, Upload, ZoomIn, Crop } from "lucide-react"
import { useToast } from "@/Contexts/ToastContext"
import Modal from "@/Components/Modal"
import { useProfilePicture } from "@/Contexts/ProfilePictureContext"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/utils/cropImage" // Utility function to crop the image
import clsx from "clsx" // Import clsx for merging class names

export default function ProfilePictureSection({ profile, className }) {
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const fileInputRef = useRef(null)
  const showToast = useToast()
  const { setProfilePicture } = useProfilePicture()

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const { processing, setData, post, reset } = useForm({
    prof_picture: null,
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Preview Image
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result)
      setIsCropModalOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropCancel = () => {
    setIsCropModalOpen(false)
    setPreviewUrl(null) // Reset the preview URL to avoid temporary changes
  }

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(previewUrl, croppedAreaPixels)
      const formData = new FormData()
      formData.append("prof_picture", croppedImage)

      fetch(route("profile.update.picture"), {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data)
          showToast("Profile picture updated successfully!", "success")
          setProfilePicture(`/storage/${data.prof_picture}`)
          setIsCropModalOpen(false)
          setIsModalOpen(false)
        })
        .catch((error) => {
          console.error("Error:", error)
          showToast("Failed to update profile picture.", "error")
        })
    } catch (error) {
      console.error("Error cropping image:", error)
      showToast("Failed to crop image.", "error")
    }
  }

  const currentProfilePicture = profile.prof_picture
    ? `/storage/${profile.prof_picture}`
    : "/images/default-profile.jpg"

  return (
    <div className={clsx("bg-white rounded-xl shadow-sm p-4 sm:p-6", className)}>
      <h3 className="text-md font-medium text-gray-900 mb-4">Profile Picture</h3>

      <div className="flex flex-col items-center">
        <div className="relative group">
          <div
            className={`
              w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg 
              ${processing ? "opacity-50" : ""}
              transition-transform duration-200 ease-in-out
              group-hover:ring-4 group-hover:ring-blue-100
            `}
          >
            <img
              src={previewUrl || currentProfilePicture}
              alt="Profile"
              className="w-full h-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
            />
          </div>

          {/* Upload Button Overlay */}
          <div
            onClick={() => setIsModalOpen(true)}
            className={`
              absolute inset-0 flex items-center content-center justify-center rounded-full
              bg-black/60 opacity-0 group-hover:opacity-100
              transition-all duration-200 ease-in-out
              cursor-pointer backdrop-blur-sm
              ${processing ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {processing ? (
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={processing}
        />

        {/* Helper Text */}
        <p className="mt-3 text-sm text-gray-500 text-center">Click the image to change your profile picture</p>
      </div>

      {/* Enhanced Modal for Viewing or Uploading Profile Picture */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center w-full ">
          <div className="mb-4">
            <h3 className="text-lg text-black">Profile Picture</h3>
          </div>

          <div className="flex flex-col items-center">
            {/* Image Preview Container */}
            <div className="relative group mb-4 sm:mb-6 flex justify-center">
              <div
                className={`
                  relative overflow-hidden rounded-lg border-4 border-white shadow-lg
                  transition-all duration-300 ease-in-out
                  ${isZoomed ? "w-full h-64 sm:h-96" : "w-40 h-40 sm:w-48 sm:h-48"}
                `}
              >
                <img
                  src={previewUrl || currentProfilePicture}
                  alt="Profile"
                  className={`
                    w-full h-full object-cover
                    transition-all duration-300 ease-in-out
                    ${isZoomed ? "scale-110" : "scale-100"}
                  `}
                />
                {/* Zoom Button */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors w-full"
              >
                <Upload className="w-5 h-5" />
                Upload New Picture
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 border bg-gray-600 border-gray-200 rounded-lg text-white hover:bg-gray-800  transition-colors w-full"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Crop Modal */}
      <Modal show={isCropModalOpen} onClose={handleCropCancel} maxWidth="md">
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center w-full">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Crop Profile Picture</h3>
          </div>
          <div className="relative w-full h-56 sm:h-64 bg-gray-200">
            <Cropper
              image={previewUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>

          {/* Zoom Slider */}
          <div className="mt-4 px-2 w-full">
            <label className="block text-sm text-gray-500 mb-1">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number.parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4 w-full">
            <button
              onClick={handleCropCancel}
              className="order-2 sm:order-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-black hover:bg-gray-600 hover:text-white transition-colors w-full sm:w-auto"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              onClick={handleCropSave}
              className="order-1 sm:order-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Crop className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

