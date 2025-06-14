"use client"

import { useState, useEffect } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import RealTimeClock from "@/Components/RealTimeClock"
import { Menu, X, Clock, Facebook, Phone, Mail, ChevronDown, LogOut, LayoutDashboard, Bell, Users } from "lucide-react"
import { Head } from "@inertiajs/react"

import "../../css/header.css";
import {
  MapPin,
} from "lucide-react"
import axios from 'axios';
export default function HeaderLayout({ children }) {
  const { url } = usePage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { barangay, auth } = usePage().props

  // Ensure auth.user and profile exist before accessing properties
  const user = auth?.user || null
  const profile = auth?.profile || {}

  const currentProfilePicture = profile.prof_picture
    ? `/storage/${profile.prof_picture}`
    : "/images/default-profile.jpg"

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const handleLogout = (e) => {
    e.preventDefault()
    router.post(route("logout"))
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <>
      <Head title="Welcome to Barangay Sawang Calero" />

      {/* Top Bar - Fixed to match the screenshot */}
      <div className="bg-blue-800 text-white py-2 px-4 md:px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <div className="flex items-center bg-blue-700 bg-opacity-50 rounded-full px-3 py-1">
              <MapPin className="h-4 w-4 text-yellow-300 mr-2" />
              <span className="text-sm font-medium">
                {barangay?.bar_location ? `${barangay.bar_location}` : "Sawang Calero, Cebu City"}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href={`mailto:${barangay?.bar_email || "sawangcalero@cebucity.gov.ph"}`}
              className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 tooltip-container"
            >
              <Mail className="w-4 h-4 text-white" />
            </a>
            <a
              href={`tel:${barangay?.bar_contact || "09123456789"}`}
              className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 tooltip-container"
            >
              <Phone className="w-4 h-4 text-white" />
            </a>
            <a
              href={barangay?.bar_fb_link || "https://facebook.com/sawangcalero"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 tooltip-container"
            >
              <Facebook className="w-4 h-4 text-white" />
            </a>
            <div className="hidden md:flex items-center bg-blue-700 bg-opacity-50 rounded-full px-3 py-1 ml-2">
              <Clock className="h-4 w-4 text-yellow-300 mr-2" />
              <RealTimeClock className="text-sm font-medium" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`bg-white shadow-md transition-all duration-300 ${isScrolled ? "fixed top-0 left-0 w-full z-50 animate-slideDown" : ""}`}
      >
        <div className="container mx-auto px-4">
          <nav className="flex mx-auto justify-between items-center">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
            <img
                src={
                  barangay?.bar_logo
                    ? `/${barangay.bar_logo}`
                    : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-dCH0dgueFDjMlXqmOpalriQzqROWNV.png"
                }
                alt="Barangay Logo"
                className="w-20 h-20 max-w-[100px] max-h-[100px] p-3 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-800 group-hover:text-red-600 transition-colors duration-300">
                  {barangay?.bar_systname || "Barangay Sawang Calero"}
                </span>
                <span className="text-xs text-gray-500">Official Government Portal</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <NavLink href="/" label="Home" currentUrl={url} />
              <NavLink href="/about" label="About" currentUrl={url} />
              <NavLink href="/services" label="Services" currentUrl={url} />
              <NavLink href="/announcements" label="Announcements" currentUrl={url} />
            </div>

            {/* Auth Section */}
            <div className="flex items-center">
              {auth?.user ? (
                <div className="relative profile-dropdown">
                  <div
                    className="flex items-center space-x-2 cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                    onClick={toggleDropdown}
                  >
                    <div className="relative">
                      <img
                        src={currentProfilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-blue-100"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-medium text-gray-700 text-sm leading-tight">
                        {profile?.prof_fname ?? "Guest"}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">{user?.email ?? ""}</p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-sm text-gray-700">
                          {profile?.prof_fname} {profile?.prof_lname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>

                      {/* <Link
                        href="/dashboard"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2 text-blue-600" />
                        Dashboard
                      </Link> */}

                      <Link
                        href="/profile"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                        Profile
                      </Link>

                      {/* <Link
                        href="/notifications"
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                      >
                        <Bell className="w-4 h-4 mr-2 text-blue-600" />
                        Notifications
                      </Link> */}

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-blue-700 font-medium text-sm rounded-md border border-blue-200 hover:bg-blue-50 transition duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-white font-medium text-sm rounded-md bg-blue-600 hover:bg-blue-700 shadow-sm transition duration-300"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="ml-4 md:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} className="text-red-600" /> : <Menu size={24} className="text-blue-800" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50 animate-fadeIn"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-3/4 h-full bg-white shadow-xl animate-slideInRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100">
              {auth?.user ? (
                <div className="flex items-center space-x-3 p-2">
                  <img
                    src={currentProfilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {profile?.prof_fname} {profile?.prof_lname}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 p-2">
                  <Link
                    href="/login"
                    className="w-full py-2 text-center font-medium rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="w-full py-2 text-center font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            <div className="py-2">
              <MobileNavLink href="/" label="Home" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/about" label="About" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/services" label="Services" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink href="/announcements" label="Announcements" onClick={() => setIsMenuOpen(false)} />

              {auth?.user && (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <MobileNavLink href="/dashboard" label="Dashboard" onClick={() => setIsMenuOpen(false)} />
                  <MobileNavLink href="/profile" label="Profile" onClick={() => setIsMenuOpen(false)} />
                  <MobileNavLink href="/notifications" label="Notifications" onClick={() => setIsMenuOpen(false)} />
                  <MobileNavLink href="/calendar" label="Calendar" onClick={() => setIsMenuOpen(false)} />

                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </button>
                </>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <RealTimeClock className="text-sm text-gray-700" />
                </div>
                <div className="flex space-x-3">
                  <a
                    href={`mailto:${barangay?.bar_email || "sawangcalero@cebucity.gov.ph"}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={`tel:${barangay?.bar_contact || "09123456789"}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                  <a
                    href={barangay?.bar_fb_link || "https://facebook.com/sawangcalero"}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`main-container ${isScrolled ? "pt-16" : ""}`}>{children}</main>
    </>
  )
}

// Desktop Navigation Link Component
function NavLink({ href, label, currentUrl }) {
  const isActive = currentUrl === href

  return (
    <Link
      href={href}
      className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 group
        ${isActive ? "text-blue-700 bg-blue-50" : "text-gray-700 hover:text-blue-700 hover:bg-blue-50"}`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-yellow-400 rounded-full"></span>
      )}
    </Link>
  )
}

// Mobile Navigation Link Component
function MobileNavLink({ href, label, onClick }) {
  return (
    <Link
      href={href}
      className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  )
}

