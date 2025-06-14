"use client"

import { useForm } from "@inertiajs/react"
import HeaderLayout from "@/Layouts/HeaderLayout"
import Footer from "@/Layouts/FooterLayout"
import ContactInfo from "@/Components/ContactInfo"

export default function ProfileVerification() {
  const { data, setData, post, processing, errors } = useForm({
    last_name: "",
    first_name: "",
    middle_name: "",
    suffix: "",
    birthdate: "",
    gender: "",
    email: "",
    contact_number: "",
    religion: "",
    civil_status: "",
    education: "",
    occupation: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_number: "",
    residency_type: "",
    block_lot: "",
    street: "",
    house_no: "",
    years_in_sawang: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post("/profile-verification")
  }

  return (
    <HeaderLayout>
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm mb-6">
            <span className="text-gray-600">Services {">"} Clearance</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            <div className="bg-[#1e1b4b] text-white px-6 py-3 clip-path-arrow">Personal</div>
            <div className="bg-[#e5e7eb] text-gray-700 px-6 py-3 clip-path-arrow ml-[-10px]">Proof of Identity</div>
          </div>

          <div className="bg-white rounded-lg">
            {/* Warning Message */}
            <p className="text-red-500 mb-6">
              * Please Make sure to provide your correct Contact Number and Email Address.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Lastname*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={data.last_name}
                    onChange={(e) => setData("last_name", e.target.value)}
                  />
                  {errors.last_name && <div className="text-red-500 text-sm mt-1">{errors.last_name}</div>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Firstname*</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={data.first_name}
                    onChange={(e) => setData("first_name", e.target.value)}
                  />
                  {errors.first_name && <div className="text-red-500 text-sm mt-1">{errors.first_name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Middlename</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={data.middle_name}
                    onChange={(e) => setData("middle_name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Suffix</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.suffix}
                    onChange={(e) => setData("suffix", e.target.value)}
                  >
                    <option value="">Select Suffix</option>
                    <option value="Jr">Jr.</option>
                    <option value="Sr">Sr.</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Birthdate*</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={data.birthdate}
                    onChange={(e) => setData("birthdate", e.target.value)}
                    placeholder="mm/dd/yyyy"
                  />
                  {errors.birthdate && <div className="text-red-500 text-sm mt-1">{errors.birthdate}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender*</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.gender}
                    onChange={(e) => setData("gender", e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <div className="text-red-500 text-sm mt-1">{errors.gender}</div>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-md"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                  />
                  {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Contact Number*</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md"
                    value={data.contact_number}
                    onChange={(e) => setData("contact_number", e.target.value)}
                  />
                  {errors.contact_number && <div className="text-red-500 text-sm mt-1">{errors.contact_number}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Religion</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.religion}
                    onChange={(e) => setData("religion", e.target.value)}
                  >
                    <option value="">Select Religion</option>
                    <option value="catholic">Catholic</option>
                    <option value="protestant">Protestant</option>
                    <option value="islam">Islam</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Civil Status*</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.civil_status}
                    onChange={(e) => setData("civil_status", e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="widowed">Widowed</option>
                    <option value="divorced">Divorced</option>
                  </select>
                  {errors.civil_status && <div className="text-red-500 text-sm mt-1">{errors.civil_status}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Highest Educational Attainment</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={data.education}
                    onChange={(e) => setData("education", e.target.value)}
                  >
                    <option value="">Select Education Level</option>
                    <option value="elementary">Elementary</option>
                    <option value="highschool">High School</option>
                    <option value="college">College</option>
                    <option value="postgraduate">Post Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Occupation</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={data.occupation}
                    onChange={(e) => setData("occupation", e.target.value)}
                  />
                </div>
              </div>

              {/* Emergency Details */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Emergency Details</h3>
                <div className="grid gap-6 md:grid-cols-1">
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact Full Name*</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={data.emergency_contact_name}
                      onChange={(e) => setData("emergency_contact_name", e.target.value)}
                    />
                    {errors.emergency_contact_name && (
                      <div className="text-red-500 text-sm mt-1">{errors.emergency_contact_name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact Relationship*</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={data.emergency_contact_relationship}
                      onChange={(e) => setData("emergency_contact_relationship", e.target.value)}
                    />
                    {errors.emergency_contact_relationship && (
                      <div className="text-red-500 text-sm mt-1">{errors.emergency_contact_relationship}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Contact Number*</label>
                    <input
                      type="tel"
                      className="w-full p-2 border rounded-md"
                      value={data.emergency_contact_number}
                      onChange={(e) => setData("emergency_contact_number", e.target.value)}
                    />
                    {errors.emergency_contact_number && (
                      <div className="text-red-500 text-sm mt-1">{errors.emergency_contact_number}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Address Details</h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Residency Type *</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={data.residency_type}
                      onChange={(e) => setData("residency_type", e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="owner">Owner</option>
                      <option value="renter">Renter</option>
                      <option value="boarder">Boarder</option>
                    </select>
                    {errors.residency_type && <div className="text-red-500 text-sm mt-1">{errors.residency_type}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Block No. *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={data.block_lot}
                      onChange={(e) => setData("block_lot", e.target.value)}
                    />
                    {errors.block_lot && <div className="text-red-500 text-sm mt-1">{errors.block_lot}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Street *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={data.street}
                      onChange={(e) => setData("street", e.target.value)}
                    />
                    {errors.street && <div className="text-red-500 text-sm mt-1">{errors.street}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">House No. *</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={data.house_no}
                      onChange={(e) => setData("house_no", e.target.value)}
                    />
                    {errors.house_no && <div className="text-red-500 text-sm mt-1">{errors.house_no}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Years in Sawang Calero *</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={data.years_in_sawang}
                      onChange={(e) => setData("years_in_sawang", e.target.value)}
                    />
                    {errors.years_in_sawang && (
                      <div className="text-red-500 text-sm mt-1">{errors.years_in_sawang}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    /* Add auto-fill logic */
                  }}
                >
                  Fill up form automatically
                </button>
                <button type="submit" className="px-8 py-2 bg-[#1e1b4b] text-white rounded hover:bg-[#2d2a5d]">
                  Next
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Reduced spacing before ContactInfo */}
      <div className="mt-8">
        <ContactInfo />
      </div>
      <Footer />
    </HeaderLayout>
  )
}
