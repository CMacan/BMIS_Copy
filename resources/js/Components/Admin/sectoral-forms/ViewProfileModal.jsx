"use client"

import { useEffect, useState } from "react"

export default function ViewProfileModal({ memberId, onClose, initialData = null }) {
  const [profileData, setProfileData] = useState(initialData || {})
  const [isLoading, setIsLoading] = useState(!initialData)
  const [profileImageError, setProfileImageError] = useState(false)

  useEffect(() => {
    if (!initialData) {
      fetchProfileData()
    }
  }, [memberId, initialData])

  const currentProfilePicture = profileData?.profile_picture_url
    ? `/storage/${profileData.profile_picture_url.replace("/storage/", "")}`
    : "/images/default-profile.jpg"

  const fetchProfileData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/admin/residents/${memberId}/profile-data`)
      const data = await response.json()
      setProfileData(data)
    } catch (error) {
      console.error("Error fetching profile data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format full name with proper handling of empty values
  const fullName =
    [profileData?.prof_fname || "", profileData?.prof_mname || "", profileData?.prof_lname || ""]
      .filter(Boolean)
      .join(" ") || "No Name Provided"

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with gradient */}
        <div className="bg-white p-5 flex items-center justify-between text-black">
          <h3 className="text-lg font-medium">{isLoading ? "Loading Profile..." : "Resident Profile"}</h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors rounded-full p-1 hover:bg-white/10"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Personal Information Section with enhanced styling */}
            <div className="relative bg-black pt-6 pb-12">
              <div className="absolute inset-0 bg-black-600"></div>
              <div className="px-6 flex flex-col items-center">
                <div className="relative mb-3">
                  {!profileImageError ? (
                    <img
                      src={currentProfilePicture || "/images/default-profile.jpg"}
                      alt="Profile"
                      className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-lg"
                      onError={() => setProfileImageError(true)}
                    />
                  ) : (
                    <div className="h-28 w-28 flex items-center justify-center bg-blue-200 rounded-full border-4 border-white shadow-lg">
                      <span className="text-blue-600 text-3xl">👤</span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">{fullName}</h2>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <span>{profileData?.prof_occupation || "No Occupation"}</span>
                  {profileData?.is_voter && (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-100"></span>
                      <span>Registered Voter</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="px-6 pt-6 space-y-6 pb-6">
              {/* Personal Details Card */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h4 className="text-sm font-medium text-blue-700 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Birth Date</p>
                    <p className="text-gray-900 font-medium">{profileData?.prof_birthdate || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Gender</p>
                    <p className="text-gray-900 font-medium">{profileData?.prof_gender || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Civil Status</p>
                    <p className="text-gray-900 font-medium">{profileData?.prof_civil_status || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Education Level</p>
                    <p className="text-gray-900 font-medium">{profileData?.prof_education || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h4 className="text-sm font-medium text-blue-700 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-gray-900 font-medium">{profileData?.prof_phone || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{profileData?.prof_email || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Sectoral Groups Card */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                <h4 className="text-sm font-medium text-blue-700 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Sectoral Groups
                </h4>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.sectoral_groups?.length > 0 ? (
                      profileData.sectoral_groups.map((group) => (
                        <span
                          key={group}
                          className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-sm"
                        >
                          {group}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No sectoral groups</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
