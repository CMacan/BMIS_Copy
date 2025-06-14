"use client"

import { useState } from "react"
import { useForm } from "@inertiajs/react"
import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import SecondaryButton from "@/Components/SecondaryButton"
import { router } from "@inertiajs/react"

export default function CreateHouseholdForm({ showToast, setActiveTab }) {
  const { data, setData, post, processing, errors } = useForm({
    addr_city: "Cebu City",
    addr_barangay: "Sawang Calero",
    addr_region: "VII",
    addr_block: "",
    addr_sitio: "",
    addr_street: "",
    addr_houseno: "",
    addr_province: "Cebu",
    addr_type: "",
    house_name: "",
    house_type: "",
  })

  const [requiredFields, setRequiredFields] = useState({
    house_name: true,
    addr_street: true,
    addr_houseno: true,
    addr_type: true,
    house_type: true,
  })

  const handleInputChange = (field, value) => {
    setData(field, value)
    setRequiredFields({
      ...requiredFields,
      [field]: value === "",
    })
  }

  const handleCreateHousehold = (e) => {
    e.preventDefault();
    post(route('household.create'), {
      onSuccess: () => {
        showToast("Household created successfully!", "success")
        setActiveTab("household")
      },
      onError: (error) => {
        showToast("Failed to create household.", "error")
      },
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Household</h2>
      <p className="text-sm text-gray-500 mb-6">Please fill in the details to register your household</p>

      <form className="space-y-6" onSubmit={handleCreateHousehold}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Household Name {requiredFields.house_name && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              onChange={(e) => handleInputChange("house_name", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <InputError message={errors.house_name} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value="Cebu City"
              onChange={(e) => setData("addr_city", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly
            />
            <InputError message={errors.addr_city} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Barangay</label>
            <input
              type="text"
              value="Sawang Calero"
              onChange={(e) => setData("addr_barangay", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly
            />
            <InputError message={errors.addr_barangay} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <input
              type="text"
              value="VII"
              onChange={(e) => setData("addr_region", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readOnly
            />
            <InputError message={errors.addr_region} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Block <span className="text-red-500">*</span>
            </label>
            <select
              value={data.addr_block}
              onChange={(e) => setData("addr_block", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Block</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7A">7A</option>
              <option value="7B">7B</option>
            </select>
            <InputError message={errors.addr_block} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sitio</label>
            <input
              type="text"
              value={data.addr_sitio}
              onChange={(e) => setData("addr_sitio", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <InputError message={errors.addr_sitio} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Street {requiredFields.addr_street && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={data.addr_street}
              onChange={(e) => handleInputChange("addr_street", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <InputError message={errors.addr_street} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              House Number {requiredFields.addr_houseno && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={data.addr_houseno}
              onChange={(e) => handleInputChange("addr_houseno", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <InputError message={errors.addr_houseno} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Province</label>
            <input
              type="text"
              value="Cebu"
              onChange={(e) => handleInputChange("addr_province", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <InputError message={errors.addr_province} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address Type {requiredFields.addr_type && <span className="text-red-500">*</span>}
            </label>
            <select
              value={data.addr_type}
              onChange={(e) => handleInputChange("addr_type", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="permanent">Permanent</option>
              <option value="temporary">Temporary</option>
            </select>
            <InputError message={errors.addr_type} className="mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              House Type {requiredFields.house_type && <span className="text-red-500">*</span>}
            </label>
            <select
              value={data.house_type}
              onChange={(e) => handleInputChange("house_type", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="singlefamily">Single Family</option>
              <option value="apartment">Apartment</option>
              <option value="townhouse">Townhouse</option>
            </select>
            <InputError message={errors.house_type} className="mt-2" />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200 mt-8">
          <SecondaryButton disabled={processing} className="mr-4" onClick={() => setActiveTab("household")}>
            Cancel
          </SecondaryButton>
          <PrimaryButton disabled={processing} type="submit">
            Save Changes
          </PrimaryButton>
        </div>
      </form>
    </div>
  )
}

