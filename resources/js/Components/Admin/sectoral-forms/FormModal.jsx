"use client"

import { useState, useEffect } from "react"
import { X, Upload, Info, FileText, CheckCircle } from "lucide-react"

export default function FormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isEdit = false,
  formErrors,
  isSubmitting,
  categories,
}) {
  const [activeTab, setActiveTab] = useState("basic")
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
  if (isOpen && formData) {
    if (formData.image) {
      if (typeof formData.image === "string") {
        // Changed from `/storage/${formData.image}` to `/${formData.image}`
        setPreviewImage(`/${formData.image.replace(/^storage\//, 'images/')}`)
      } else if (formData.image instanceof File) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewImage(e.target.result)
        }
        reader.readAsDataURL(formData.image)
      }
    } else {
      setPreviewImage(null)
    }
  } else if (!isOpen) {
    setPreviewImage(null)
    setActiveTab("basic")
  }
}, [isOpen, formData])

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
        setFormData({
          ...formData,
          image: file,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const triggerFileInput = () => {
    document.getElementById(isEdit ? "edit-image-upload" : "add-image-upload").click()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl w-full max-w-3xl transform transition-all">
          <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-indigo-600 to-yellow-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white" id="modal-title">
                {isEdit ? "Edit Form" : "Create New Form"}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-indigo-100 transition-colors focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-indigo-50 px-6">
              <nav className="flex space-x-4" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("basic")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "basic"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveTab("requirements")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "requirements"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  Requirements
                </button>
                <button
                  onClick={() => setActiveTab("image")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === "image"
                      ? "border-indigo-600 text-indigo-700"
                      : "border-transparent text-indigo-400 hover:text-indigo-600"
                  }`}
                >
                  Image
                </button>
              </nav>
            </div>

            <div className="p-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onSubmit()
                }}
                className="space-y-6"
              >
                {/* Basic Information Tab */}
                {activeTab === "basic" && (
                  <>
                    <div>
                      <label
                        htmlFor={`${isEdit ? "" : "new-"}name`}
                        className="block text-sm font-medium text-indigo-700 mb-1"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`${isEdit ? "" : "new-"}name`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 border ${
                          formErrors.name ? "border-red-300 ring-1 ring-red-300" : "border-indigo-200"
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                        placeholder="Enter form name"
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label
                        htmlFor={`${isEdit ? "" : "new-"}description`}
                        className="block text-sm font-medium text-indigo-700 mb-1"
                      >
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id={`${isEdit ? "" : "new-"}description`}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className={`w-full px-4 py-3 border ${
                          formErrors.description ? "border-red-300 ring-1 ring-red-300" : "border-indigo-200"
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                        placeholder="Enter form description"
                      ></textarea>
                      {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                    </div>
                    <div>
                      <label
                        htmlFor={`${isEdit ? "" : "new-"}category`}
                        className="block text-sm font-medium text-indigo-700 mb-1"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`${isEdit ? "" : "new-"}category`}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-4 py-3 border ${
                          formErrors.category ? "border-red-300 ring-1 ring-red-300" : "border-indigo-200"
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors`}
                        placeholder="Enter or select a category"
                        list="categories"
                      />
                      <datalist id="categories">
                        {categories.map((category, index) => (
                          <option key={index} value={category} />
                        ))}
                      </datalist>
                      {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                    </div>
                    <div>
                      <label
                        htmlFor={`${isEdit ? "" : "new-"}addtl_detail`}
                        className="block text-sm font-medium text-indigo-700 mb-1"
                      >
                        Additional Details
                      </label>
                      <input
                        type="text"
                        id={`${isEdit ? "" : "new-"}addtl_detail`}
                        value={formData.addtl_detail || ""}
                        onChange={(e) => setFormData({ ...formData, addtl_detail: e.target.value })}
                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Enter additional details (optional)"
                      />
                    </div>
                  </>
                )}

                {/* Requirements Tab */}
                {activeTab === "requirements" && (
                  <div>
                    <label
                      htmlFor={`${isEdit ? "" : "new-"}requirements`}
                      className="block text-sm font-medium text-indigo-700 mb-1"
                    >
                      Requirements
                    </label>
                    <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <p className="text-sm text-indigo-700 flex items-start">
                        <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-indigo-500" />
                        Enter each requirement separated by commas. For example: "Valid ID, Birth Certificate, Barangay
                        Clearance"
                      </p>
                    </div>
                    <textarea
                      id={`${isEdit ? "" : "new-"}requirements`}
                      value={formData.requirements?.map((req) => req.requirement).join(", ") || ""}
                      onChange={(e) => {
                        const updatedRequirements = e.target.value.split(", ").map((requirement) => ({ requirement }))
                        setFormData({ ...formData, requirements: updatedRequirements })
                      }}
                      rows={4}
                      className="w-full px-4 py-3 border border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter requirements separated by commas"
                    ></textarea>

                    {/* Preview Requirements */}
                    {formData.requirements &&
                      formData.requirements.length > 0 &&
                      formData.requirements[0].requirement && (
                        <div className="mt-6 bg-white p-4 border border-indigo-100 rounded-lg">
                          <h4 className="text-sm font-semibold text-indigo-700 mb-3 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-indigo-500" />
                            Requirements Preview
                          </h4>
                          <ul className="space-y-2">
                            {formData.requirements.map((req, index) => (
                              <li
                                key={index}
                                className="flex items-center text-sm text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg"
                              >
                                <span className="h-5 w-5 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full mr-2 text-xs font-bold">
                                  {index + 1}
                                </span>
                                {req.requirement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                )}

                {/* Image Tab */}
                {activeTab === "image" && (
                  <div>
                    <label className="block text-sm font-medium text-indigo-700 mb-3">Form Image</label>

                    <div
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-200 border-dashed rounded-lg hover:border-indigo-400 transition-colors cursor-pointer bg-indigo-50"
                      onClick={triggerFileInput}
                    >
                      <div className="space-y-2 text-center">
                        {previewImage ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={previewImage || "/placeholder.svg"}
                              alt="Preview"
                              className="h-48 w-auto object-contain mb-4 rounded-lg shadow-md"
                            />
                            <p className="text-sm text-indigo-600 flex items-center">
                              <Upload className="h-4 w-4 mr-1" />
                              Click to change image
                            </p>
                          </div>
                        ) : (
                          <>
                            <FileText className="mx-auto h-16 w-16 text-indigo-300" />
                            <div className="flex text-sm text-indigo-600 justify-center">
                              <Upload className="h-4 w-4 mr-1 mt-1" />
                              <p>Click to upload an image or drag and drop</p>
                            </div>
                            <p className="text-xs text-indigo-400">PNG, JPG, GIF up to 10MB</p>
                          </>
                        )}
                        <input
                          id={isEdit ? "edit-image-upload" : "add-image-upload"}
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="bg-indigo-50 px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors mr-3 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEdit ? "Saving..." : "Creating..."}
                  </span>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create Form"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

