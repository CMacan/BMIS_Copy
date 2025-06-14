"use client"

import { useState, useEffect } from "react"
import { usePage } from "@inertiajs/react"
import LandingBackground from "@/Layouts/LandingBackground" // Adjust the path based on your file structure
import "../../css/landingbg.css"
import "../../css/guestlayout.css"

export default function GuestLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false)
  const barangay = usePage().props.barangay
  const logo = barangay?.bar_logo && barangay.bar_logo !== ''
    ? `/${barangay.bar_logo}`
    : '/images/defaultlogo.jpg'

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div
      className={`relative flex min-h-screen flex-col items-center sm:justify-center sm:pt-0 overflow-hidden ${isMobile ? "justify-center" : ""}`}
    >
      {/* Background Component */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#1e1b4b] to-[#312e81]">
        <LandingBackground />
      </div>

      {/* Semi-transparent Barangay Seal as part of existing design */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10 z-10">
        <img src={logo} alt="Barangay Seal" className="w-3/4 sm:w-2/5 max-w-lg rounded-full" />
      </div>

      {/* Main Content Card */}
      <div
        className="relative mx-1 mt-20 w-full max-w-[95%] rounded-md px-3 sm:px-6 pb-6 pt-3
      sm:pt-6 shadow-md sm:w-auto sm:max-w-4xl sm:rounded-lg z-20 justify-center justify-self-center
       bg-slate-50 flex flex-col"
        style={{ maxHeight: "calc(100vh - 20px)", margin: "50px 10px 10px" }}
      >
        {/* Floating Logo */}
        <div className="absolute -translate-y-1/2 left-1/2 transform -translate-x-1/2 z-30 rounded-full" style={{ top: 0 }}>
          <a href="/">
            <img src={logo} alt="Another Logo" className="h-24 w-auto block mx-auto rounded-full" />
          </a>
        </div>

        {/* Fixed Header Area */}
        <div className="flex-shrink-0 mt-4 mb-5">
          {/* {title && <h2 className="text-2xl font-bold text-center text-gray-800">{title}</h2>} */}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto px-1 py-2">{children}</div>

        {/* Fixed Footer Area (if needed) */}
        <div className="flex-shrink-0"></div>
      </div>
    </div>
  )
}

