"use client"

import { useState } from "react"
import { route } from "ziggy-js"
import { useForm } from "@inertiajs/react"
import { toast } from "react-hot-toast"
import TextInput from "@/Components/TextInput"
import Button from "@/Components/Button"

export default function SKCertificateForm({
  documentType,
  onClose,
  user,
  initialData,
  purposeOptions = ["School Enrollment", "Job Application", "Government Transaction", "Legal Proceedings", "Others"],
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
    if (!data.address?.trim()) return "Address is required"
    if (!data.age || isNaN(data.age) || data.age < 1) return "Please enter a valid age"
    if (!data.block) return "Block is required"
    if (!data.purpose) return "Purpose is required"
    if (!data.copies || isNaN(data.copies) || data.copies < 1) return "Please enter a valid number of copies"
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add debugging
    console.log("SK form submission started")
    console.log("Current data:", data)
    console.log("Route:", route("user.document-requests.store"))

    // Show loading toast
    const loadingToast = toast.loading("Processing your SK certificate request...")

    const error = validateForm()
    if (error) {
      toast.dismiss(loadingToast)
      toast.error(error, {
        duration: 4000,
        position: "top-center",
      })
      return
    }

    setIsSubmitting(true)

    post(route("user.document-requests.store"), {
      preserveScroll: true,
      onSuccess: (response) => {
        toast.dismiss(loadingToast)
        toast.success("SK certificate request submitted successfully! ", {
          duration: 5000,
          position: "top-center",
        })

        setTimeout(() => {
          onClose()
          window.location.href = route("user.document-requests.index")
        }, 2000)
      },
      onError: (errs) => {
        console.error("SK form submission errors:", errs)
        toast.dismiss(loadingToast)

        if (typeof errs === "object" && errs !== null) {
          const errorMessages = Object.values(errs)
          if (errorMessages.length > 1) {
            toast.error(`Please fix ${errorMessages.length} errors in your SK certificate form`, {
              duration: 4000,
              position: "top-center",
            })
            errorMessages.forEach((error, index) => {
              setTimeout(() => {
                toast.error(error, {
                  duration: 3000,
                  position: "top-right",
                })
              }, index * 500)
            })
          } else {
            toast.error(errorMessages[0] || "SK certificate submission failed. Please try again.", {
              duration: 4000,
              position: "top-center",
            })
          }
        } else {
          toast.error("Failed to submit SK certificate request. Please check your connection and try again.", {
            duration: 4000,
            position: "top-center",
          })
        }
        setIsSubmitting(false)
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">SK Certificate Application</h3>
        <p className="text-sm text-gray-600">
          Please provide the required information for your SK certificate request.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={processing || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  )
}
