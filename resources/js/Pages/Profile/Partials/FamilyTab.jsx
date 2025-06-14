"use client"

import { useState, useEffect } from "react"
import ProfileInfoCard from "@/Components/Profile/ProfileInfoCard"
import ProfileFamilyMemberCard from "@/Components/Profile/ProfileFamilyMemberCard"
import AddHouseholdMember from "./AddHouseholdMember"
import { Users, Search, UserPlus, Plus } from "lucide-react"

export default function FamilyTab({ householdMembers }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const filteredMembers = householdMembers.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.relationship?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <ProfileInfoCard
        title="Family Members"
        subtitle="Manage your family members and their information"
        icon={Users}
        actions={
          <button
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            onClick={() => setShowAddMemberForm(true)}
          >
            {isMobile ? (
              <>
                <Plus className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only">Add Member</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Add Member</span>
              </>
            )}
          </button>
        }
      >
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search family members..."
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">
                {searchTerm ? "No family members match your search" : "No family members found"}
              </p>
              <button
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={() => setShowAddMemberForm(true)}
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Family Member</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredMembers.map((member) => (
                <ProfileFamilyMemberCard
                  key={member.id}
                  member={member}
                  onEdit={(member) => console.log("Edit member:", member)}
                />
              ))}
            </div>
          )}
        </div>
      </ProfileInfoCard>
      {showAddMemberForm && (
        <AddHouseholdMember
          showToast={(message, type) => console.log(message, type)}
          setActiveTab={setShowAddMemberForm}
        />
      )}
    </>
  )
}

