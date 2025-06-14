import React, { useState, useEffect } from "react"
import { Link } from "@inertiajs/react"
import {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  FileSignature,
  BadgeIcon as Certificate,
  UserCog,
  MessageSquare,
  ClipboardList,
  Clock,
  Building2,
  LogOut,
  ChevronRight,
  User,
  Menu,
  X,
} from "lucide-react"

// Add submenu items data
const submenuItems = {
  // "barangay-officials": [
  //   { name: "View Officials", href: "/admin/barangay-officials" },
  //   { name: "Add Official", href: "/admin/barangay-officials/create" },
  //   { name: "Official Positions", href: "/admin/barangay-officials/positions" },
  // ],
  // committees: [
  //   { name: "View Committees", href: "/admin/committees" },
  //   { name: "Add Committee", href: "/admin/committees/create" },
  // ],
  residents: [
    { name: "View Voters", href: "/admin/voters" },
    { name: "Households", href: "/admin/households" },
  ],
  applications: [
    { name: "View Applications", href: "/admin/applications" },
    { name: "View Sectoral", href: "/admin/sectoral-forms" },
  ],
  // forms: [
  //   { name: "All Forms", href: "/admin/forms" },
  //   { name: "Create Form", href: "/admin/forms/create" },
  //   { name: "Form Templates", href: "/admin/forms/templates" },
  // ],
  // "document-requests": [
  //   { name: "Pending Requests", href: "/admin/document-requests" },
  //   { name: "Approved Requests", href: "/admin/document-requests/approved" },
  //   { name: "Rejected Requests", href: "/admin/document-requests/rejected" },
  // ],
  "all-accounts": [
    // { name: "View Accounts", href: "/admin/all-accounts" },
    { name: "Role Management", href: "/admin/all-accounts/roles" },
    { name: "Sign Up Requests", href: "/admin/sign-up-requests" },
  ],
}

export function Sidebar({ isCollapsed }) {
  const [isMobileView, setIsMobileView] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileView && isMobileOpen && !event.target.closest(".sidebar")) {
        setIsMobileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isMobileView, isMobileOpen])

  // Mobile toggle function
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Determine sidebar visibility based on device and state
  const sidebarVisible = isMobileView ? isMobileOpen : true

  return (
    <>
      {/* Mobile Toggle Button - Fixed position */}
      {isMobileView && (
        <button
          onClick={toggleMobileSidebar}
          className="fixed top-4 left-4 z-50 bg-[#0f172a] text-white p-2 rounded-md shadow-lg"
          aria-label="Toggle sidebar"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={0} />}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar bg-[#0f172a] text-white h-screen flex flex-col transition-all duration-300 ease-in-out z-40
          ${isCollapsed && !isMobileView ? "w-20" : "w-80"} 
          ${isMobileView ? "fixed" : "fixed"} 
          ${isMobileView && !isMobileOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div
          className={`p-5 border-b border-gray-700 flex items-center ${isCollapsed && !isMobileView ? "justify-center" : "gap-4"} whitespace-nowrap`}
        >
          {!isCollapsed || isMobileView ? (
            <>
              <img src="/images/officialseal.png" alt="Barangay Logo" className="h-18 w-24" />
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-white">Sawang Calero</h2>
                <p className="text-lg text-gray-400">Information</p>
                <p className="text-lg text-gray-400">Management</p>
              </div>
            </>
          ) : (
            <img src="/images/officialseal.png" alt="Barangay Logo" className="h-12 w-12" />
          )}
        </div>
        <nav className="flex-1 overflow-y-auto overflow-x-hidden mt-5 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <SidebarSection title="GENERAL" isCollapsed={isCollapsed && !isMobileView}>
            <SidebarLink href="/admin/dashboard" icon={LayoutDashboard} isCollapsed={isCollapsed && !isMobileView}>
              Dashboard
            </SidebarLink>
            <SidebarLink
              href="/admin/brgy-officials"
              icon={Users}
              hasSubmenu
              isCollapsed={isCollapsed && !isMobileView}
            >
              Barangay Officials
            </SidebarLink>
            <SidebarLink href="/admin/committees" icon={Users} hasSubmenu isCollapsed={isCollapsed && !isMobileView}>
              Committees
            </SidebarLink>
            <SidebarLink
              href="/admin/residents"
              icon={UserCircle}
              hasSubmenu
              isCollapsed={isCollapsed && !isMobileView}
            >
              Residents
            </SidebarLink>
            <SidebarLink
              href="/admin/applications"
              icon={FileText}
              hasSubmenu
              isCollapsed={isCollapsed && !isMobileView}
            >
              Sectoral
            </SidebarLink>
            <SidebarLink
              href="/admin/document-requests"
              icon={FileSignature}
              hasSubmenu
              isCollapsed={isCollapsed && !isMobileView}
            >
              Document Requests
            </SidebarLink>
            <SidebarLink
              href="/admin/all-accounts"
              icon={UserCog}
              hasSubmenu
              isCollapsed={isCollapsed && !isMobileView}
            >
              All Accounts
            </SidebarLink>
            <SidebarLink href="/admin/announcements" icon={MessageSquare} isCollapsed={isCollapsed && !isMobileView}>
              Announcements
            </SidebarLink>
          </SidebarSection>
          <SidebarSection title="REPORT" isCollapsed={isCollapsed && !isMobileView}>
            <SidebarLink href="/admin/activity-logs" icon={Clock} isCollapsed={isCollapsed && !isMobileView}>
              Activity Logs
            </SidebarLink>
          </SidebarSection>
          <SidebarSection title="COMPLAINT" isCollapsed={isCollapsed && !isMobileView}>
            <SidebarLink href="/admin/complaints" icon={ClipboardList} isCollapsed={isCollapsed && !isMobileView}>
              Complaints
            </SidebarLink>
          </SidebarSection>
          <SidebarSection title="SETTINGS" isCollapsed={isCollapsed && !isMobileView}>
            <SidebarLink href="/admin/barangaydetails" icon={Building2} isCollapsed={isCollapsed && !isMobileView}>
              Barangay Details
            </SidebarLink>
            <SidebarLink href="/admin/account" icon={User} isCollapsed={isCollapsed && !isMobileView}>
              My Account
            </SidebarLink>
          </SidebarSection>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileView && isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleMobileSidebar} />
      )}
    </>
  )
}

function SidebarSection({ title, children, isCollapsed }) {
  if (isCollapsed) {
    return <div className="py-4">{children}</div>
  }

  return (
    <div className="mb-5">
      <h3 className="px-7 mb-3 text-xs font-semibold pl-10 text-gray-400 uppercase">{title}</h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  )
}

function SidebarLink({ href, icon: Icon, children, hasSubmenu, isCollapsed }) {
  const [isOpen, setIsOpen] = useState(false)
  const submenuKey = Object.keys(submenuItems).find((key) => href.includes(key))

  return (
    <li className="list-none">
      <div className="flex items-center">
        {/* Main link (clickable, but doesn't toggle submenu) */}
        <Link
          href={href}
          className={`flex items-center flex-grow ${
            isCollapsed ? "justify-center px-2" : "px-4 pl-8"
          } py-3 text-xs transition-colors hover:bg-gray-700 hover:text-white rounded-lg`}
        >
          <Icon className="w-5 h-5 text-gray-300" />
          {!isCollapsed && <span className="flex-1 ml-3">{children}</span>}
        </Link>

        {/* Arrow button (toggles submenu) */}
        {hasSubmenu && submenuItems[submenuKey] && !isCollapsed && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-3 focus:outline-none hover:bg-gray-700 hover:text-white rounded-lg"
          >
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      {/* Submenu (only shown when arrow is clicked) */}
      {hasSubmenu && submenuItems[submenuKey] && isOpen && !isCollapsed && (
        <ul className="ml-8 border-l border-gray-600 pl-4 space-y-1">
          {submenuItems[submenuKey].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-3 text-xs text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  )
}

