"use client"

import { useState, useEffect } from "react"
import { useForm } from "@inertiajs/react"
import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import { UserPlus, X, Calendar, Users, User } from "lucide-react"
import { router } from "@inertiajs/react"

export default function AddHouseholdMember({ showToast, setActiveTab }) {
  const { data, setData, post, processing, errors } = useForm({
    fname: "",
    lname: "",
    birthdate: "",
    relationship: "",
    gender: "",
    cstatus: "",
  })

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (field, value) => {
    setData(field, value)
    setRequiredFields({
      ...requiredFields,
      [field]: value === "",
    })
  }

  const [requiredFields, setRequiredFields] = useState({
    fname: true,
    lname: true,
    birthdate: true,
    relationship: true,
    gender: true,
    cstatus: true,
  })

  const handleAddMember = (e) => {
    e.preventDefault()
  
    post(route("household.member.add"), {
      onSuccess: () => {
        showToast("Household member added successfully!", "success")
        setActiveTab(false)
      },
      onError: () => {
        showToast("Failed to add household member.", "error")
      },
    })
  }
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className={`bg-white rounded-xl shadow-xl w-full max-w-md mx-auto transform transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        } flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add Household Member</h2>
          </div>
          <button
            onClick={() => setActiveTab(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form className="p-5 overflow-y-auto flex-1" onSubmit={handleAddMember}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[
              { label: "First Name", icon: <User className="w-4 h-4 text-gray-500" />, field: "fname", placeholder: "Enter first name" },
              { label: "Last Name", icon: <User className="w-4 h-4 text-gray-500" />, field: "lname", placeholder: "Enter last name" },
            ].map(({ label, icon, field, placeholder }) => (
              <div key={field} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  {icon} {label} {requiredFields[field] && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                  required
                  placeholder={placeholder}
                />
                <InputError message={errors[field]} className="mt-1" />
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                Birthdate {requiredFields.birthdate && <span className="text-red-500">*</span>}
              </label>
              <input
                type="date"
                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                required
              />
              <InputError message={errors.birthdate} className="mt-1" />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-500" />
                Relationship {requiredFields.relationship && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                onChange={(e) => handleInputChange("relationship", e.target.value)}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                required
                placeholder="e.g. Son, Daughter, Spouse"
              />
              <InputError message={errors.relationship} className="mt-1" />
            </div>

            {[
              { label: "Gender", field: "gender", options: ["Male", "Female", "Other"] },
              { label: "Civil Status", field: "cstatus", options: ["Single", "Married", "Widowed", "Divorced"] },
            ].map(({ label, field, options }) => (
              <div key={field} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label} {requiredFields[field] && <span className="text-red-500">*</span>}
                </label>
                <select
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                  required
                >
                  <option value="">Select {label}</option>
                  {options.map((option) => (
                    <option key={option.toLowerCase()} value={option.toLowerCase()}>
                      {option}
                    </option>
                  ))}
                </select>
                <InputError message={errors[field]} className="mt-1" />
              </div>
            ))}
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 p-4 border-t border-gray-100">
          <SecondaryButton
            disabled={processing}
            className="w-full sm:w-auto order-2 sm:order-1"
            onClick={() => setActiveTab(false)}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton disabled={processing} onClick={handleAddMember} type="submit" className="w-full sm:w-auto order-1 sm:order-2">
            {processing ? "Adding..." : "Add Member"}
          </PrimaryButton>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 p-4 rounded-b-xl text-xs text-gray-500 text-center">
          All fields marked with <span className="text-red-500">*</span> are required
        </div>
      </div>
    </div>
  )
}
