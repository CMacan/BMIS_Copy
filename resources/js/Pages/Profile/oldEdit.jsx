"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import UserLayout from "@/Layouts/UserLayout"
import { Head, usePage, useForm } from "@inertiajs/react"
import {
  User,
  Home,
  Users,
  Lock,
  MapPin,
  Calendar,
  Building,
  Key,
  UserPlus,
  AlertCircle,
  ChevronRight,
} from "lucide-react"
import UpdatePasswordForm from "./Partials/UpdatePasswordForm"
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm"
import JoinHouseholdModal from "@/Components/Profile/JoinHouseholdModal"
import ProfileTabButton from "@/Components/Profile/ProfileTabButton"
import ProfileInfoCard from "@/Components/Profile/ProfileInfoCard"
import ProfileQuickInfoCard from "@/Components/Profile/ProfileQuickInfoCard"
import { useToast } from "@/Contexts/ToastContext"
import CreateHouseholdForm from "@/Pages/Profile/Partials/CreateHouseholdForm"
import UpdateHouseholdForm from "@/Pages/Profile/Partials/UpdateHouseholdForm"
import FamilyTab from "@/Pages/Profile/Partials/FamilyTab"

export default function Edit({ mustVerifyEmail, status }) {
  const [activeTab, setActiveTab] = useState("profile")
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [householdId, setHouseholdId] = useState("")
  const [isMobileTabsOpen, setIsMobileTabsOpen] = useState(false)
  const { auth } = usePage().props
  const user = auth.user
  const profile = auth.profile || {}
  const household = auth.household || {}
  const address = auth.address || {}
  const householdMembers = auth.householdMembers || []

  const { data, setData, post, processing, errors } = useForm({
    addr_city: "Cebu City", //address.addr_city || "",
    addr_barangay: "Sawang Calero", //address.addr_barangay || "",
    addr_region: "VII", //address.addr_region || "",
    addr_block: address.addr_block || "",
    addr_sitio: address.addr_sitio || "",
    addr_street: address.addr_street || "",
    addr_houseno: address.addr_houseno || "",
    addr_province: "Cebu", //address.addr_province || "",
    addr_type: address.addr_type || "",
    house_type: household.house_type || "",
    house_ownership: "owner",
    house_year: household.house_year || "",
  })

  const showToast = useToast()

  // Get current tab label for mobile view
  const getCurrentTabLabel = () => {
    switch (activeTab) {
      case "profile":
        return "Personal Info"
      case "household":
        return "Household"
      case "createHousehold":
        return "Create Household"
      case "family":
        return "Household Members"
      case "security":
        return "Security"
      default:
        return "Profile"
    }
  }

  // Close mobile tabs dropdown when a tab is selected
  useEffect(() => {
    setIsMobileTabsOpen(false)
  }, [activeTab])

  return (
    <UserLayout>
      <Head title="Profile" />

      <div className="max-w-7xl mx-auto py-4 px-2 sm:px-6 lg:px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account and household information</p>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <ProfileQuickInfoCard
              icon={MapPin}
              label="Current Address"
              value={`${address.addr_street || ""}, ${address.addr_barangay || ""}, ${address.addr_city || ""}`}
            />
            <ProfileQuickInfoCard icon={Users} label="Family Members" value={`${householdMembers.length} members`} />
            <ProfileQuickInfoCard
              icon={Calendar}
              label="Member Since"
              value={format(new Date(user.created_at), "MMMM yyyy")}
            />
          </div>
        </div>

        {/* Mobile Tab Dropdown */}
        <div className="md:hidden mb-4 relative">
          <button
            onClick={() => setIsMobileTabsOpen(!isMobileTabsOpen)}
            className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2">
              {activeTab === "profile" && <User className="w-5 h-5 text-blue-600" />}
              {(activeTab === "household" || activeTab === "createHousehold") && (
                <Home className="w-5 h-5 text-blue-600" />
              )}
              {activeTab === "family" && <Users className="w-5 h-5 text-blue-600" />}
              {activeTab === "security" && <Lock className="w-5 h-5 text-blue-600" />}
              <span className="font-medium">{getCurrentTabLabel()}</span>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${isMobileTabsOpen ? "rotate-90" : ""}`} />
          </button>

          {isMobileTabsOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <button
                className={`w-full text-left px-4 py-3 flex items-center gap-2 ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-5 h-5" />
                <span>Personal Info</span>
              </button>
              <button
                className={`w-full text-left px-4 py-3 flex items-center gap-2 ${activeTab === "household" || activeTab === "createHousehold" ? "bg-blue-50 text-blue-600" : ""}`}
                onClick={() => setActiveTab("household")}
              >
                <Home className="w-5 h-5" />
                <span>Household</span>
              </button>
              {household.id && (
                <button
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 ${activeTab === "family" ? "bg-blue-50 text-blue-600" : ""}`}
                  onClick={() => setActiveTab("family")}
                >
                  <Users className="w-5 h-5" />
                  <span>Household Members</span>
                  <span className="ml-auto bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
                    {householdMembers.length}
                  </span>
                </button>
              )}
              <button
                className={`w-full text-left px-4 py-3 flex items-center gap-2 ${activeTab === "security" ? "bg-blue-50 text-blue-600" : ""}`}
                onClick={() => setActiveTab("security")}
              >
                <Lock className="w-5 h-5" />
                <span>Security</span>
              </button>
            </div>
          )}
        </div>

        {/* Horizontal Tab Navigation - Desktop */}
        <div className="hidden md:flex gap-2 mb-8 overflow-x-auto pb-2">
          <ProfileTabButton
            active={activeTab === "profile"}
            icon={User}
            label="Personal Info"
            onClick={() => setActiveTab("profile")}
          />
          <ProfileTabButton
            active={activeTab === "household" || activeTab === "createHousehold"}
            icon={Home}
            label="Household"
            onClick={() => setActiveTab("household")}
          />
          {household.id && (
            <ProfileTabButton
              active={activeTab === "family"}
              icon={Users}
              label="Household Members"
              onClick={() => setActiveTab("family")}
              count={householdMembers.length}
            />
          )}
          <ProfileTabButton
            active={activeTab === "security"}
            icon={Lock}
            label="Security"
            onClick={() => setActiveTab("security")}
          />
        </div>

        {/* Tab Content */}
        <div className="">
          {activeTab === "profile" && (
            <ProfileInfoCard
              title="Profile Information"
              subtitle="Update your personal information and email address"
              icon={User}
            >
              <UpdateProfileInformationForm
                mustVerifyEmail={mustVerifyEmail}
                status={status}
                profile={profile}
                user={user}
              />
            </ProfileInfoCard>
          )}
          {activeTab === "household" && (
            <ProfileInfoCard
              title="Household Information"
              subtitle="Manage your household details and contact information"
              icon={Building}
            >
              {!household.id ? (
                <div className="space-y-6">
                  <div className="border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 text-blue-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <h3 className="font-medium">No Household Found</h3>
                    </div>
                    <p className="text-blue-600 text-sm mb-4">
                      You are currently not part of any household. Choose one of the options below:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => setActiveTab("createHousehold")}
                        className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <Home className="w-8 h-8 text-blue-600" />
                        <div className="text-center">
                          <h3 className="font-medium text-gray-900">Create New Household</h3>
                          <p className="text-sm text-gray-500">Start a new household as the head</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setShowJoinModal(true)}
                        className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <UserPlus className="w-8 h-8 text-blue-600" />
                        <div className="text-center">
                          <h3 className="font-medium text-gray-900">Join Existing Household</h3>
                          <p className="text-sm text-gray-500">Join as a family member</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </ProfileInfoCard>
          )}

          {activeTab === "createHousehold" && (
            <ProfileInfoCard title="Create Household" subtitle="Create a new household and become the head" icon={Home}>
              <CreateHouseholdForm
                data={data}
                setData={setData}
                post={post}
                processing={processing}
                errors={errors}
                showToast={showToast}
              />
            </ProfileInfoCard>
          )}
          {/* Include the JoinHouseholdModal component */}
          {showJoinModal && (
            <JoinHouseholdModal
              isOpen={showJoinModal}
              onClose={() => setShowJoinModal(false)}
              //onSubmit={handleJoinHousehold}
              //householdId={householdId}
              //setHouseholdId={setHouseholdId}
            />
          )}

          {activeTab === "family" && <FamilyTab householdMembers={householdMembers} />}

          {activeTab === "security" && (
            <>
              <ProfileInfoCard
                title="Update Password"
                subtitle="Ensure your account is using a strong password"
                icon={Key}
              >
                <UpdatePasswordForm />
              </ProfileInfoCard>
              {/* <ProfileInfoCard
                title="Delete Account"
                subtitle="Permanently delete your account and all associated data"
                icon={AlertCircle}
              >
                <DeleteUserForm />
              </ProfileInfoCard> */}
            </>
          )}
        </div>
      </div>
    </UserLayout>
  )
}

