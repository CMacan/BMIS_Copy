"use client"
import { lazy, Suspense, useState, useEffect } from "react"
import UserLayout from "@/Layouts/UserLayout"
import { Head, usePage, useForm, router } from "@inertiajs/react" // Import router
import { Home, UserPlus, Check, Copy, EditIcon, Settings } from "lucide-react"
import JoinHouseholdModal from "@/Components/Profile/JoinHouseholdModal"
import Button from "@/Components/Button"
import { useToast } from "@/Contexts/ToastContext"
import ProfilePictureCircle from "@/Components/Profile/ProfilePictureCircle"
import InfoField from "@/Components/InfoField"
import CreateHouseholdForm from "@/Pages/Profile/Partials/CreateHouseholdForm"
import ResidentUpdateForm from "@/Pages/Profile/Partials/ResidentUpdateForm"
import Modal from "@/Components/Modal"
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm" // <-- Add this import

// Lazy load components
const UpdateHouseholdForm = lazy(() => import("@/Pages/Profile/Partials/UpdateHouseholdForm"))
const FamilyTab = lazy(() => import("@/Pages/Profile/Partials/FamilyTab"))

export default function Edit({ mustVerifyEmail, status }) {
  const [activeTab, setActiveTab] = useState("personal")
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false) // <-- Add this state
  const { auth } = usePage().props
  const user = auth.user
  const profile = auth.profile || {}
  const household = auth.household || {}
  const address = auth.address || {}
  const householdMembers = auth.householdMembers || []
  const prof_full_name =
    `${profile.prof_fname || ""} ${profile.prof_mname ? `${profile.prof_mname.charAt(0)}.` : ""} ${profile.prof_lname || ""} ${profile.prof_suffix || ""}`.trim()

  const { data, setData, post, processing, errors } = useForm({
    addr_city: "Cebu City",
    addr_barangay: "Sawang Calero",
    addr_region: "VII",
    addr_block: address.addr_block || "",
    addr_sitio: address.addr_sitio || "",
    addr_street: address.addr_street || "",
    addr_houseno: address.addr_houseno || "",
    addr_province: "Cebu",
    addr_type: address.addr_type || "",
    house_type: household.house_type || "",
    house_ownership: "owner",
    house_year: household.house_year || "",
  })

  const showToast = useToast()

  // Function to reload data without reloading the page
  const reloadData = () => {
    router.reload({
      only: ["auth"], // Specify which props to reload (e.g., "auth" contains user and profile data)
      preserveScroll: true, // Keep the scroll position
      preserveState: true, // Keep the current state
    });
  };

  const [copied, setCopied] = useState(false) // Add state to track copy status
  const handleCopy = (e) => {
    const text = profile.id.toString() //e.target.innerText;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true) // Set copied to true on success
        setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
      })
      .catch(() => alert("Failed to copy"))
  }

  // Close mobile tabs dropdown when a tab is selected
  useEffect(() => {
    setIsMobileTabsOpen(false)
  }, [activeTab])

  const addressList = Array.isArray(address) ? address : []
  const userAddress = addressList.length > 0 ? addressList[0] : {}

  return (
    <UserLayout>
      <Head title="Resident Profile" />

      <div className="max-w-7xl mx-auto py-3 sm:py-4 px-3 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Picture Section */}
            <ProfilePictureCircle profile={profile} className="relative" />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{prof_full_name}</h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">Resident Profile ID: {profile.id ? profile.id.toString() : "N/A"}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 mt-4">
                <button
                  onClick={() => {
                    console.log("Opening modal...");
                    setIsUpdateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                >
                  <EditIcon className="w-4 h-4" />
                  Update Information
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy ID"}
                </button>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white-100 absolute top-2 right-2 h-10 w-10 sm:h-12 sm:w-12"
            aria-label="Settings"
            onClick={() => setIsPasswordModalOpen(true)} // <-- Add this handler
          >
            <Settings className="h-32 w-32 sm:h-60 sm:w-60" />
          </Button>
        </div>

        {/* Add a toggle for mobile tabs */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setIsMobileTabsOpen(!isMobileTabsOpen)}
            className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg"
          >
            <span className="font-medium">
              {activeTab === "personal"
                ? "Personal Information"
                : activeTab === "household"
                  ? "Household Information"
                  : "Create Household"}
            </span>
            <svg
              className={`w-5 h-5 transform transition-transform ${isMobileTabsOpen ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isMobileTabsOpen && (
            <div className="mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                className={`block w-full text-left px-4 py-3 text-sm ${
                  activeTab === "personal" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Information
              </button>
              {/* <button
                className={`block w-full text-left px-4 py-3 text-sm ${
                  activeTab === "household" || activeTab === "createHousehold" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("household")}
              >
                Household Information
              </button> */}
            </div>
          )}
        </div>

        {/* Adjust tab navigation for larger screens */}
        <div className="hidden sm:flex border-b border-gray-200 mb-6">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "personal"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </button>
          {/* <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "household"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("household")}
          >
            Household Information
          </button> */}
        </div>

        {/* Tab Content */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            {/* Personal Details */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Personal Details</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Your basic information registered with the barangay
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InfoField label="Full Name" value={prof_full_name || "N/A"} />
                <InfoField label="Date of Birth" value={profile.prof_birthdate || "N/A"} />
                <InfoField label="Gender" value={profile.prof_gender || "N/A"} />
                <InfoField label="Civil Status" value={profile.prof_cstatus || "N/A"} />
                <InfoField label="Age" value={profile.prof_age || "N/A"} />
                <InfoField label="Religion" value={profile.prof_religion || "N/A"} />
{/* <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="mt-1 text-gray-900">
                    {format(new Date(profile.prof_birthdate || Date.now()), "MMMM d, yyyy")}
                  </p>
                </div> */}
{/* <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="mt-1 text-gray-900">
                    {format(new Date(profile.prof_birthdate || Date.now()), "MMMM d, yyyy")}
                  </p>
                </div> */}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Contact Information</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Your contact information registered with the barangay
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InfoField label="Contact Number" value={profile?.prof_contact || "N/A"} />
                <InfoField label="Email" value={user.email || "N/A"} />
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Additional Information</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">Other important details about you</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InfoField label="Occupation" value={profile?.prof_occupation || "N/A"} />
                <InfoField label="Educational Attainment" value={profile?.prof_educattain || "N/A"} />
                <InfoField label="4P's member" value={profile.prof_is_4ps ? "Yes" : "No"} />
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Address Information</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                Your registered address in the barangay
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <InfoField label="City" value={userAddress.addr_city || "N/A"} />
                <InfoField label="Barangay" value={userAddress.addr_barangay || "N/A"} />
                <InfoField label="Region" value={userAddress.addr_region || "N/A"} />
                <InfoField label="Block" value={userAddress.addr_block || "N/A"} />
                {/* <InfoField label="Sitio" value={userAddress.addr_sitio || "N/A"} /> */}
                <InfoField label="Street" value={userAddress.addr_street || "N/A"} />
                <InfoField label="House No." value={userAddress.addr_houseno || "N/A"} />
                {/* <InfoField label="Province" value={userAddress.addr_province || "N/A"} /> */}
                {/* <InfoField label="Address Type" value={userAddress.addr_type || "N/A"} /> */}
              </div>
            </div>
          </div>
        )}

      {/* Render the dynamically loaded components wrapped in Suspense */}
      {activeTab === "household" && (
        <div className="space-y-6">
          {!household.id ? (
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Household Status</h2>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                You are currently not part of any household
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div
                  onClick={() => setActiveTab("createHousehold")}
                  className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Home className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900">Create New Household</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Start a new household as the head</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  <div className="text-center">
                    <h3 className="font-medium text-gray-900">Join Existing Household</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Join as a family member</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <Suspense fallback={<div>Loading Household Form...</div>}>
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Household Details</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                  Your household information registered with the barangay
                </p>

                <UpdateHouseholdForm
                  data={data}
                  setData={setData}
                  post={post}
                  processing={processing}
                  errors={errors}
                  showToast={showToast}
                  household={household}
                  address={address}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Family Members</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">People registered in your household</p>

                <FamilyTab householdMembers={householdMembers} />
              </div>
            </Suspense>
          )}
        </div>
      )}

      {activeTab === "createHousehold" && (
        <CreateHouseholdForm
          data={data}
          setData={setData}
          post={post}
          processing={processing}
          errors={errors}
          showToast={showToast}
          setActiveTab={setActiveTab}
        />
      )}
      
      </div>

      {/* Modal */}
      {showJoinModal && <JoinHouseholdModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />}
      {isUpdateModalOpen && (
        <Modal show={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
          <div className="p-6 pt-0">
            <div className="sticky top-0 z-10 bg-white pt-6 pb-4">
              <h2 className="text-lg font-semibold text-gray-900">Update Resident Information</h2>
            </div>
            <ResidentUpdateForm
              mustVerifyEmail={mustVerifyEmail}
              status={status}
              profile={profile}
              user={user}
              onSuccess={reloadData}
            />
          </div>
        </Modal>
      )}
      {isPasswordModalOpen && (
        <Modal show={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
          <div className="p-7 pt-0 ">
            <div className="sticky top-0 z-10 bg-white pt-6 pb-4 pr-2">
              {/* <h2 className="text-lg font-semibold text-gray-900">Update Password</h2> */}
            </div>
            <UpdatePasswordForm />
          </div>
        </Modal>
      )}
    </UserLayout>
  )
}

