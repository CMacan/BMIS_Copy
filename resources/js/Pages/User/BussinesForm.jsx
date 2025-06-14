"use client"

import { useState } from "react"
import { route } from "ziggy-js"
import { useForm } from "@inertiajs/react"
import { toast } from "react-hot-toast"
import TextInput from "@/Components/TextInput"
import Button from "@/Components/Button"

export default function BusinessClearanceForm({
  documentType,
  onClose,
  user,
  initialData,
  businessTypeOptions = [
    "Retail Store",
    "Restaurant/Food Service",
    "Service Business",
    "Manufacturing",
    "Online Business",
    "Others",
  ],
  businessNatureOptions = ["Sole Proprietorship", "Partnership", "Corporation", "Cooperative"],
}) {
  const { data, setData, post, processing, errors } = useForm({
    document_type: documentType,
    business_name: "",
    business_type: "",
    business_nature: "",
    business_address: "",
    capital_amount: "",
    assessment_form: null, 
    ...initialData,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field, value) => {
    setData(field, value)
  }

  const validateForm = () => {
    if (!data.name?.trim()) return "Name is required"
    if (!data.address?.trim()) return "Address is required"
    if (!data.business_name?.trim()) return "Business Name is required"
    if (!data.business_type) return "Business Type is required"
    if (!data.business_nature) return "Business Nature is required"
    if (!data.business_address?.trim()) return "Business Address is required"
    if (!data.capital_amount || isNaN(data.capital_amount)) return "Please enter a valid capital amount"
    if (!data.purpose) return "Purpose is required"
    if (!data.copies || isNaN(data.copies) || data.copies < 1) return "Please enter a valid number of copies"
    if (!data.assessment_form) return "Assessment Form is required"
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add debugging
    console.log("Business form submission started")
    console.log("Current data:", data)
    console.log("Route:", route("user.document-requests.store"))

    // Show loading toast
    const loadingToast = toast.loading("Processing your business clearance request...")

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
      forceFormData: true,
      onSuccess: (response) => {
        toast.dismiss(loadingToast)
        toast.success("Business clearance request submitted successfully! 🏢✅", {
          duration: 5000,
          position: "top-center",
        })
        toast.success("You will receive an email confirmation shortly.", {
          duration: 4000,
          position: "top-right",
        })
        setTimeout(() => {
          onClose()
          window.location.href = route("user.document-requests.index")
        }, 2000)
      },
      onError: (errs) => {
        toast.dismiss(loadingToast)

        if (typeof errs === "object" && errs !== null) {
          const errorMessages = Object.values(errs)
          if (errorMessages.length > 1) {
            toast.error(`Please fix ${errorMessages.length} errors in your business clearance form`, {
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
            toast.error(errorMessages[0] || "Business clearance submission failed. Please try again.", {
              duration: 4000,
              position: "top-center",
            })
          }
        } else {
          toast.error("Failed to submit business clearance request. Please check your connection and try again.", {
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
        <h3 className="text-lg font-medium text-gray-800 mb-2">Business Clearance Application</h3>
        <p className="text-sm text-gray-600">
          Please fill out all required information for your business clearance request.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <TextInput
                value={data.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full"
                error={errors.address}
                required
              />
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-4">Business Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <TextInput
                value={data.business_name}
                onChange={(e) => updateField("business_name", e.target.value)}
                className="w-full"
                error={errors.business_name}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select
                  value={data.business_type || ""}
                  onChange={(e) => updateField("business_type", e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Business Type</option>
                  {businessTypeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.business_type && <p className="text-sm text-red-500 mt-1">{errors.business_type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Nature</label>
                <select
                  value={data.business_nature || ""}
                  onChange={(e) => updateField("business_nature", e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Business Nature</option>
                  {businessNatureOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.business_nature && <p className="text-sm text-red-500 mt-1">{errors.business_nature}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
              <TextInput
                value={data.business_address}
                onChange={(e) => updateField("business_address", e.target.value)}
                className="w-full"
                error={errors.business_address}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capital Amount</label>
              <TextInput
                type="number"
                value={data.capital_amount}
                onChange={(e) => updateField("capital_amount", e.target.value)}
                className="w-full"
                error={errors.capital_amount}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Assessment Form <span className="text-red-500">*</span></label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setData("assessment_form", e.target.files[0])}
              required
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {errors.assessment_form && (
              <p className="text-sm text-red-500 mt-1">{errors.assessment_form}</p>
            )}
          </div>
          </div>
        </div>

        {/* Request Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <TextInput
              value={data.purpose}
              onChange={(e) => updateField("purpose", e.target.value)}
              className="w-full"
              error={errors.purpose}
              placeholder="e.g., Business Registration, Permit Renewal"
              required
            />
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
