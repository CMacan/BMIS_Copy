"use client"

import { useState, useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  FileSignature,
  UserCog,
  MessageSquare,
  Landmark,
  Clock,
  User,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

const submenuItems = {
  residents: [
    { name: "View Residents", href: "/admin/residents" },
    { name: "View Voters", href: "/admin/voters" },
    // { name: "Households", href: "/admin/households" },
  ],
  applications: [
    { name: "View Applications", href: "/admin/applications" },
    { name: "View Sectoral", href: "/admin/sectoral-forms" },
  ],
  "all-accounts": [
    { name: "View User Accounts", href: "/admin/all-accounts" },
    // { name: "Role Management", href: "/admin/all-accounts/roles" },
    { name: "View Sign Up Requests", href: "/admin/sign-up-requests" },
  ],
}

export function Sidebar({ isCollapsed }) {
  const { barangay } = usePage().props
  const [openDropdowns, setOpenDropdowns] = useState({})

  const logo = barangay?.bar_logo && barangay.bar_logo !== "" ? `/${barangay.bar_logo}` : "/images/defaultlogo.jpg"

  // Close all dropdowns when sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) {
      setOpenDropdowns({})
    }
  }, [isCollapsed])

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <aside
      className={`sidebar bg-[#0f172a] text-white h-screen flex flex-col fixed z-40 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className={`p-3 border-b border-gray-700 flex items-center ${isCollapsed ? "justify-center" : "gap-2"}`}>
        {!isCollapsed && (
          <img src={logo || "/placeholder.svg"} alt="Barangay Logo" className="h-14 w-14 object-cover rounded-full" />
        )}
        {isCollapsed && (
          <img src={logo || "/placeholder.svg"} alt="Barangay Logo" className="h-6 w-6 object-cover rounded-full" />
        )}
        {!isCollapsed && (
          <div>
            <h2 className="text-sm font-bold text-white">{barangay?.bar_name || ""}</h2>
            <p className="text-xs text-gray-400">Information Management</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <SidebarSection title="GENERAL" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/dashboard" icon={LayoutDashboard} isCollapsed={isCollapsed}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/admin/brgy-officials" icon={Users} isCollapsed={isCollapsed}>
            Barangay Officials
          </SidebarLink>
          {/* <SidebarLink href="/admin/committees" icon={Users} isCollapsed={isCollapsed}>
            Committees
          </SidebarLink> */}
          <SidebarLink
            href="/admin/residents"
            icon={UserCircle}
            hasSubmenu
            isCollapsed={isCollapsed}
            submenuKey="residents"
            isOpen={openDropdowns.residents}
            onToggle={() => toggleDropdown("residents")}
          >
            Residents
          </SidebarLink>
          <SidebarLink
            href="/admin/applications"
            icon={FileText}
            hasSubmenu
            isCollapsed={isCollapsed}
            submenuKey="applications"
            isOpen={openDropdowns.applications}
            onToggle={() => toggleDropdown("applications")}
          >
            Sectoral
          </SidebarLink>
          <SidebarLink href="/admin/document-requests" icon={FileSignature} isCollapsed={isCollapsed}>
            Document Requests
          </SidebarLink>
          <SidebarLink
            href="/admin/all-accounts"
            icon={UserCog}
            hasSubmenu
            isCollapsed={isCollapsed}
            submenuKey="all-accounts"
            isOpen={openDropdowns["all-accounts"]}
            onToggle={() => toggleDropdown("all-accounts")}
          >
            All Accounts
          </SidebarLink>
          <SidebarLink href="/admin/announcements" icon={MessageSquare} isCollapsed={isCollapsed}>
            Announcements
          </SidebarLink>
        </SidebarSection>

        <SidebarSection title="REPORT" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/activity-logs" icon={Clock} isCollapsed={isCollapsed}>
            Activity Logs
          </SidebarLink>
        </SidebarSection>

        {/* <SidebarSection title="COMPLAINT" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/complaints" icon={ClipboardList} isCollapsed={isCollapsed}>
            Complaints
          </SidebarLink>
        </SidebarSection> */}

        <SidebarSection title="SETTINGS" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/barangaydetails" icon={Landmark} isCollapsed={isCollapsed}>
            Barangay Details
          </SidebarLink>
          <SidebarLink href="/admin/account" icon={User} isCollapsed={isCollapsed}>
            Account
          </SidebarLink>
        </SidebarSection>
      </nav>
    </aside>
  )
}

function SidebarSection({ title, children, isCollapsed }) {
  if (isCollapsed) return <div className="py-1">{children}</div>
  return (
    <div className="mb-2 mt-2">
      <h3 className="px-7 mb-2 text-xs font-semibold text-gray-400 uppercase">{title}</h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  )
}

function SidebarLink({ href, icon: Icon, children, hasSubmenu, isCollapsed, submenuKey, isOpen, onToggle }) {
  const handleClick = (e) => {
    if (hasSubmenu && !isCollapsed) {
      e.preventDefault()
      onToggle()
    }
  }

  const LinkContent = () => (
    <div
      className={`flex items-center ${
        isCollapsed ? "justify-center px-1" : "px-3 pl-6"
      } py-2 text-xs transition-colors hover:bg-gray-700 rounded-lg cursor-pointer`}
      onClick={handleClick}
    >
      <Icon className="w-5 h-5 text-gray-300" />
      {!isCollapsed && (
        <>
          <span className="flex-1 ml-2">{children}</span>
          {hasSubmenu && (
            <div className="ml-auto">
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 transition-transform duration-200" />
              )}
            </div>
          )}
        </>
      )}
    </div>
  )

  return (
    <li className="list-none">
      {hasSubmenu && !isCollapsed ? (
        <LinkContent />
      ) : (
        <Link href={href}>
          <LinkContent />
        </Link>
      )}

      {hasSubmenu && submenuItems[submenuKey] && !isCollapsed && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="ml-8 border-l border-gray-600 pl-4 space-y-1 py-2">
            {submenuItems[submenuKey].map((item) => (
              <li key={item.href} className="list-none">
                <Link
                  href={item.href}
                  className="block px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
