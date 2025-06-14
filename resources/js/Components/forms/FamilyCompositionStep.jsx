"use client"
import { useState, useEffect } from "react"
import { PlusCircle, Trash2 } from "lucide-react"

export default function FamilyCompositionStep({
  householdData = [],
  setHouseholdData = () => console.warn("setHouseholdData not provided"),
  errors = {},
}) {
  const [manualEntry, setManualEntry] = useState(false)
  const [hasFetchedData, setHasFetchedData] = useState(householdData.length > 0)

  // Track if we have any data (either fetched or manually entered)
  const hasData = householdData.length > 0

  useEffect(() => {
    // If we receive pre-filled data, treat it as fetched data
    if (householdData.length > 0 && !manualEntry) {
      setHasFetchedData(true)
    }
  }, [householdData, manualEntry])

  const handleAddMember = () => {
    setManualEntry(true)
    setHouseholdData([
      ...householdData,
      {
        id: Date.now(),
        name: "",
        relationship: "",
        age: "",
        civilStatus: "",
        education: "",
        birthDate: "",
        occupation: "",
      },
    ])
  }

  const handleRemoveMember = (id) => {
    const newData = householdData.filter((member) => member.id !== id)
    setHouseholdData(newData)

    // If no members left, reset to initial state
    if (newData.length === 0) {
      setManualEntry(false)
      setHasFetchedData(false)
    }
  }

  const handleInputChange = (id, field, value) => {
    setHouseholdData(householdData.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  const enableManualEntry = () => {
    setManualEntry(true)
    handleAddMember() // Add first empty member
  }

  // Render different views based on state
  const renderContent = () => {
    // 1. Show fetched data in read-only table
    if (hasFetchedData && !manualEntry) {
      return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Relationship
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Birthday
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupation/Income
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {householdData.map((member) => (
                <tr key={member.id}>
                  <td className="px-4 py-4 whitespace-nowrap">{member.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{member.relationship}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{member.age}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{member.civilStatus}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{member.education}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{member.birthDate}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{member.occupation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    // 2. Show manual entry form
    if (manualEntry && hasData) {
      return (
        <div className="space-y-6">
          {householdData.map((member, index) => (
            <div key={member.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Family Member {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-white text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-all shadow-sm hover:shadow-md"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label htmlFor={`name-${member.id}`} className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`name-${member.id}`}
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={member.name}
                    onChange={(e) => handleInputChange(member.id, "name", e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>

                {/* Relationship Field */}
                <div className="space-y-1.5">
                  <label htmlFor={`relationship-${member.id}`} className="block text-sm font-medium text-gray-700">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    id={`relationship-${member.id}`}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={member.relationship}
                    onChange={(e) => handleInputChange(member.id, "relationship", e.target.value)}
                    required
                  >
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Age Field */}
                <div className="space-y-1.5">
                  <label htmlFor={`age-${member.id}`} className="block text-sm font-medium text-gray-700">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`age-${member.id}`}
                    type="number"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={member.age}
                    onChange={(e) => handleInputChange(member.id, "age", e.target.value)}
                    placeholder="Age"
                    required
                  />
                </div>

                {/* Civil Status Field */}
                <div className="space-y-1.5">
                  <label htmlFor={`civilStatus-${member.id}`} className="block text-sm font-medium text-gray-700">
                    Civil Status
                  </label>
                  <select
                    id={`civilStatus-${member.id}`}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={member.civilStatus}
                    onChange={(e) => handleInputChange(member.id, "civilStatus", e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>

                {/* Education Field */}
                <div className="space-y-1.5">
                  <label htmlFor={`education-${member.id}`} className="block text-sm font-medium text-gray-700">
                    Educational Attainment
                  </label>
                  <input
                    id={`education-${member.id}`}
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={member.education}
                    onChange={(e) => handleInputChange(member.id, "education", e.target.value)}
                    placeholder="Educational Attainment"
                  />
                </div>

                {/* Birth Date Field */}
                <div className="space-y-1.5">
                  <label htmlFor={`birthDate-${member.id}`} className="block text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <input
                    id={`birthDate-${member.id}`}
                    type="date"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={member.birthDate}
                    onChange={(e) => handleInputChange(member.id, "birthDate", e.target.value)}
                  />
                </div>

                {/* Occupation Field */}
                <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                  <label htmlFor={`occupation-${member.id}`} className="block text-sm font-medium text-gray-700">
                    Occupation/Monthly Income
                  </label>
                  <input
                    id={`occupation-${member.id}`}
                    type="text"
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    value={member.occupation}
                    onChange={(e) => handleInputChange(member.id, "occupation", e.target.value)}
                    placeholder="Occupation/Monthly Income"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    // 3. Show empty state (no data available)
    return (
      <div className="text-center py-10 px-6  bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="flex flex-col items-center  max-w-md mx-auto ">
          <div className="mb-6 p-6 bg-blue-50 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Family Members Added</h3>
          <p className="text-gray-600 mb-8">
            You haven't added any family members yet. Start by adding your household members manually.
          </p>
          <button
            onClick={enableManualEntry}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <PlusCircle size={20} />
            Add Family Members
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Family Composition</h2>
        {manualEntry && hasData && (
          <button
            type="button"
            onClick={handleAddMember}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <PlusCircle size={18} />
            Add Family Member
          </button>
        )}
      </div>

      {renderContent()}

      {errors.householdData && <p className="mt-4 text-sm text-red-600 font-medium">{errors.householdData}</p>}
    </div>
  )
}

