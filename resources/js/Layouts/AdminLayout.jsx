"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/Components/Admin/Sidebar"
import { Menu, ChevronDown, LogOut, Repeat, X } from "lucide-react"
import { useLocation } from "react-router-dom"
import { usePage, router } from "@inertiajs/react"
import { ProfilePictureProvider } from "@/Contexts/ProfilePictureContext"
import { NotificationProvider } from "@/Contexts/NotificationContext"
import AdminNotificationDropdown from "@/Components/Admin/AdminNotificationDropdown"

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true) // Default to open
  const [isMobileView, setIsMobileView] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

//   const location = useLocation()
  const { auth } = usePage().props
  const user = auth.user || {}
  const profile = auth.profile || {}
  const initialProfilePicture = 
  (profile.prof_picture || user.profile?.prof_picture)
    ? `/storage/${profile.prof_picture || user.profile.prof_picture}`
    : "/images/default-profile.jpg";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileView(isMobile)

      // Close sidebar by default on mobile
      if (isMobile && sidebarOpen) {
        setSidebarOpen(false)
      } else if (!isMobile && !sidebarOpen) {
        // Open sidebar by default on desktop
        setSidebarOpen(true)
      }
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const handleLogout = (e) => {
    e.preventDefault()
    router.post(window.route("logout"))
    setIsDropdownOpen(false)
  }

  const toggleSidebar = () => {
    if (isMobileView) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen)
    } else {
      setSidebarOpen(!sidebarOpen)
    }
  }

  const getPageTitle = () => {
    const path = location.pathname
    switch (path) {
      case "/announcements":
        return "Manage Announcements"
      case "/users":
        return "User Management"
      case "/admin/document-requests":
        return "Document Requests"
      case "/admin/complaints":
        return "Complaints"
      case "/admin/barangaydetails":
        return "Barangay Settings"
      case "/admin/committees":
        return "Committees"
      default:
        return "Dashboard"
    }
  }

  return (
    <NotificationProvider>
      <ProfilePictureProvider>
      <div className="relative">
        <div className="flex h-screen overflow-hidden">
          {/* Mobile Sidebar Toggle Button */}
          {isMobileView && (
            <button
              onClick={toggleSidebar}
              className="fixed top-3 left-4 z-50 bg-[#0f172a] text-white p-2 rounded-md shadow-lg"
              aria-label="Toggle sidebar"
            >
              {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}

          {/* Mobile overlay */}
          {isMobileView && isMobileSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsMobileSidebarOpen(false)} />
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 transform bg-[#0f172a] transition-all duration-300 ease-in-out z-40
              ${
                isMobileView
                  ? isMobileSidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                  : sidebarOpen
                    ? "w-72"
                    : "w-20"
              }
              ${isMobileView ? "w-72" : ""} 
              overflow-y-auto`}
            style={{ height: "100vh" }}
          >
            <Sidebar isCollapsed={isMobileView ? false : !sidebarOpen} />
          </div>

          {/* Main Content Wrapper */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
              ${isMobileView ? "ml-0" : sidebarOpen ? "ml-72" : "ml-20"}`}
          >
            {/* Header */}
            <header
              className={`bg-[#002060] text-white h-16 flex items-center justify-between px-4 sm:px-6 fixed top-0 z-20 transition-all duration-300
                ${
                  isMobileView
                    ? "left-0 w-full"
                    : sidebarOpen
                      ? "left-72 w-[calc(100%-18rem)]"
                      : "left-20 w-[calc(100%-5rem)]"
                }`}
            >
              {!isMobileView && (
                <button
                  onClick={toggleSidebar}
                  className="text-white hover:text-gray-200 transition-transform duration-300"
                >
                  <Menu className={`w-6 h-6 transform ${!sidebarOpen ? "rotate-180" : ""}`} />
                </button>
              )}

              {/* Title visible on mobile */}
              {isMobileView && <div className="ml-14 text-lg font-semibold">{getPageTitle()}</div>}

              <div className="flex items-center gap-4 relative profile-dropdown">
                <AdminNotificationDropdown />
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:bg-[#001a4d] px-3 py-2 rounded-md transition-colors"
                  onClick={toggleDropdown}
                >
                  <img
                    src={initialProfilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                  />
                  <span className={`font-medium ${isMobileView ? "hidden sm:inline" : ""}`}>Administrator</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>

                {/* Dropdown Modal */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => (window.location.href = route("dashboard"))}
                      className="flex items-center text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Repeat className="w-6 h-6 mr-2" />
                      Switch to Resident View
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
            </header>

            {/* Main Content */}
            <main className={`flex-1 relative bg-white transition-all duration-300 pt-16 overflow-auto max-w-full`}>
              {/* Main Content */}
              <div className="p-4 h-full">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </ProfilePictureProvider>
    </NotificationProvider>
  )
}

