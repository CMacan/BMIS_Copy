"use client"

import { useState, useEffect } from "react"
import { ChevronDown, LogOut, User, Repeat, Home } from "lucide-react"
import { usePage, router } from "@inertiajs/react"
import { useProfilePicture } from "@/Contexts/ProfilePictureContext"
import NotificationDropdown from "../NotificationDropdown"

export function Header() {
  const { auth } = usePage().props
  const profile = auth.user.profile || {}
  const { profilePicture } = useProfilePicture()

  const [isMobile, setIsMobile] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const currentProfilePicture =
    profilePicture || (profile.prof_picture ? `/storage/${profile.prof_picture}` : "/images/default-profile.jpg")

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".profile-dropdown")) setIsDropdownOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  const handleLogout = (e) => {
    e.preventDefault()
    router.post(route("logout"))
  }
  

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 fixed top-0 z-20 md:left-64 left-0 right-0">
      <div className="flex items-center"></div>

      <div className="flex items-center space-x-4">
        {/* Notifications Component */}
        <NotificationDropdown />

        {/* User Profile Dropdown */}
        <div className="relative profile-dropdown">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-4 py-2 mx-2 rounded-lg transition-colors"
            onClick={toggleDropdown}
          >
            <img
              src={currentProfilePicture || "/placeholder.svg"}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-gray-200"
            />
            <span className={`font-medium text-gray-700 ${isMobile ? "hidden sm:inline" : ""}`}>
              {profile?.prof_fname ?? "Guest"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              {auth.isSuperadmin && (
                <button
                  onClick={() => window.location.href = route('admin.dashboard')}
                  className="flex align-center text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Repeat className="w-6 h-6 mr-2" />
                  Switch to Admin View
                </button>
              )}
              <button
                onClick={() => window.location.href = route("landing")}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go back Home
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
