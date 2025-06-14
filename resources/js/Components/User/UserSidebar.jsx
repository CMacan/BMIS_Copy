"use client"

import { Link, usePage } from "@inertiajs/react"
import { Home, FileText, ClipboardList, Bell, FileStack, UserCircle, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function UserSidebar() {
  const { url } = usePage()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { barangay } = usePage().props;
  const logo = barangay?.bar_logo && barangay.bar_logo !== ''
  ? `/${barangay.bar_logo}`
  : '/images/defaultlogo.jpg';


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

  const navigation = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/user_request", icon: FileText, label: "Requests" },
    { href: "/forms", icon: ClipboardList, label: "Forms" },
    { href: "/dashboard/announcements", icon: Bell, label: "Announcements" },
    // { href: "/program", icon: FileStack, label: "Programs" },
    { href: "/profile", icon: UserCircle, label: "Profile" },
    // { href: "/history", icon: Clock, label: "History" },
  ]

  // Close mobile menu when clicking a link
  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out" : "w-64 h-full"} 
          ${isMobileMenuOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : ""} 
          bg-white shadow-lg flex flex-col
        `}
      >
        <div className="flex flex-col items-center pt-8 pb-6">
          <img
            src={logo}
            alt="Barangay Logo"
            className="w-24 h-24 mb-4 rounded-full border-4 border-blue-100 shadow-md"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-1">{barangay?.bar_name|| ""}</h2>
          <p className="text-sm text-gray-600 mb-4">Resident Portal</p>
          <div className="w-3/4 h-px bg-gray-200 mb-6"></div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => (
              <NavItem 
                key={item.href} 
                {...item} 
                isActive={url === item.href || url === item.href + "/"} 
                onClick={handleNavClick} 
              />  
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}

function NavItem({ href, icon: Icon, label, isActive, onClick }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
          isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        onClick={onClick}
      >
        <Icon className={`w-7 h-7 mr-3 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
        <span className="text-base font-medium">{label}</span>
      </Link>
    </li>
  )
}

