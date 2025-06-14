"use client"

import { useState } from "react"
import { route } from "ziggy-js"
import { useForm } from "@inertiajs/react"
import TextInput from "@/Components/TextInput"
import Button from "@/Components/Button"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DocumentRequestForm({
  documentType,
  requesterType,
  onClose,
  user,
  initialData,
  purposeOptions = [
    "Employment",
    "School Requirement",
    "Government Transaction",
    "Business Permit",
    "Travel",
    "Others",
  ],
}) {
  const { data, setData, post, processing, errors } = useForm({
    document_type: documentType,
    ...initialData,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setData(field, value)
  }

  const validateForm = () => {
    if (!data.name?.trim()) return "Name is required"
    if (!data.age) return "Age is required"
    if (!data.address?.trim()) return "Address is required"
    if (isNaN(data.age) || data.age < 1) return "Please enter a valid age"
    if (!data.block) return "Block is required"
    if (!data.purpose) return "Purpose is required"
    if (!data.copies || isNaN(data.copies) || data.copies < 1) return "Please enter a valid number of copies"

    // Add civil status validation for Certificate of Indigency
    if (documentType === "CERTIFICATE OF INDIGENCY" && !data.civil_status) {
      return "Civil Status is required"
    }

    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const error = validateForm()
    if (error) {
        toast.error(error, {
        position: "top-center",
        })
        return
    }

    setIsSubmitting(true)

    toast.promise(
        new Promise((resolve, reject) => {
        post(route("user.document-requests.store"), {
            preserveScroll: true,
            onSuccess: () => resolve(),
            onError: (errs) => reject(errs),
            onFinish: () => setIsSubmitting(false),
        })
        }),
        {
        pending: `Processing your ${documentType.toLowerCase()} request...`,
        success: {
            render() {
            setTimeout(() => {
                onClose()
                window.location.href = route("user.document-requests.index")
            }, 3000)
            return `${documentType} request submitted successfully!`
            },
            position: "top-center",
        },
        error: {
            render({ data: errs }) {
            if (typeof errs === "object" && errs !== null) {
                const errorMessages = Object.values(errs)
                if (errorMessages.length > 1) {
                errorMessages.forEach((msg, index) => {
                    setTimeout(() => {
                    toast.error(msg, {
                        position: "top-right",
                    })
                    }, index * 500)
                })
                return `Please fix ${errorMessages.length} errors in the form`
                } else {
                return errorMessages[0] || "Submission failed. Please try again."
                }
            }
            return "Failed to submit document request. Please check your connection and try again."
            },
        },
        },
    {
        position: "top-center",
    }
    )
    }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Document Request Form - {documentType}</h2>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <TextInput
                value={data.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full"
                error={errors.name}
                required
              />
            </div>
            <div className="mt-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                <TextInput
                value={data.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full"
                error={errors.address}
                required
                />
             </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <TextInput
                type="number"
                value={data.age}
                onChange={(e) => updateField("age", e.target.value)}
                className="w-full"
                error={errors.age}
                required
                min="1"
              />
            </div>
            {documentType === "CERTIFICATE OF INDIGENCY" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                <select
                  value={data.civil_status || ""}
                  onChange={(e) => updateField("civil_status", e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
                {errors.civil_status && <p className="text-sm text-red-500 mt-1">{errors.civil_status}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
              <select
                value={data.block || ""}
                onChange={(e) => updateField("block", e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Block</option>
                <option value="Block 1">Block 1</option>
                <option value="Block 2">Block 2</option>
                <option value="Block 3">Block 3</option>
                <option value="Block 4">Block 4</option>
                <option value="Block 5">Block 5</option>
                <option value="Block 6">Block 6</option>
                <option value="Block 7">Block 7</option>
              </select>
              {errors.block && <p className="text-sm text-red-500 mt-1">{errors.block}</p>}
            </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-4">Request Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <select
                value={data.purpose || ""}
                onChange={(e) => updateField("purpose", e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Purpose</option>
                {purposeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.purpose && <p className="text-sm text-red-500 mt-1">{errors.purpose}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Copies</label>
              <TextInput
                type="number"
                value={data.copies}
                onChange={(e) => {
                  const value = Math.max(1, Number.parseInt(e.target.value) || 1)
                  updateField("copies", value)
                }}
                className="w-full"
                error={errors.copies}
                required
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={processing || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
        <ToastContainer />
      </form>
    </div>
  )
}
