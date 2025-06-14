"use client"
import { useState } from "react"
import { Link } from "@inertiajs/react"
import HeaderLayout from "@/Layouts/HeaderLayout"
import Landingbg from "../../Layouts/landingbg"
import Footer from "@/Layouts/FooterLayout"
import ContactInfo from "@/Components/ContactInfo"
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

export default function TicketCheck() {
  const [formData, setFormData] = useState({
    ticketID: "",
    last_name: "",
    first_name: "",
    birthdate: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showStatus, setShowStatus] = useState(false)
  const [profile, setProfile] = useState(null)

  // Status display configurations
  const statusConfig = {
    approved: {
      icon: <CheckCircle className="w-24 h-24 text-green-500" />,
      title: "Approved",
      color: "text-green-600",
      message: "Please visit Barangay Hall",
    },
    declined: {
      icon: <XCircle className="w-24 h-24 text-red-500" />,
      title: "Declined",
      color: "text-red-600",
      message: "Your request has been declined. Please contact the Barangay Office for more information.",
    },
    pending: {
      icon: <Clock className="w-24 h-24 text-yellow-500" />,
      title: "Pending",
      color: "text-yellow-600",
      message: "Your request is still being processed. Please check back later.",
    },
    submitted: {
      icon: <Clock className="w-24 h-24 text-blue-500" />,
      title: "Submitted",
      color: "text-blue-600",
      message: "Your request has been submitted and is awaiting review.",
    },
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // If ticketID is empty, check that other fields are filled
    if (!formData.ticketID) {
      if (!formData.last_name) newErrors.last_name = "Last name is required when ticket ID is not provided"
      if (!formData.first_name) newErrors.first_name = "First name is required when ticket ID is not provided"
      if (!formData.birthdate) newErrors.birthdate = "Birthdate is required when ticket ID is not provided"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute("content")

      const response = await fetch("/ticket-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setProfile(data.profile)
        setShowStatus(true)
      } else {
        // Handle validation errors from server
        if (data.errors) {
          setErrors(data.errors)
        }
      }
    } catch (error) {
      console.error("Error checking ticket status:", error)
    } finally {
      setLoading(false)
    }
  }

  const closeStatusModal = () => {
    setShowStatus(false)
  }

  // Determine current status display
  const currentStatus = profile ? profile.status || "pending" : "not_found"
  const statusDisplay = statusConfig[currentStatus] || {
    icon: <AlertCircle className="w-24 h-24 text-gray-500" />,
    title: "Not Found",
    color: "text-gray-600",
    message: "We couldn't find any request matching your information. Please check your details and try again.",
  }

  return (
    <HeaderLayout>
      {/* Hero Section */}
      <Landingbg height="min-h-[40vh]" />
      <div className="min-h-screen bg-[#E6EEF9] py-12">
        <div className="max-w-3xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm mb-6">
            <Link href="/services" className="text-gray-600 hover:text-gray-800">
              Services
            </Link>{" "}
            {">"} Ticket Status
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h1 className="text-2xl font-bold mb-8 text-center">Check Ticket</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <p className="text-red-500 text-center">
                  *Enter your Ticket ID for Status Checking. It was sent to your Phone Number
                </p>
                <label htmlFor="ticketID" className="block font-medium">
                  Ticket ID
                </label>
                <input
                  id="ticketID"
                  name="ticketID"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={formData.ticketID}
                  onChange={handleChange}
                />
                {errors.ticketID && <div className="text-red-500 text-sm">{errors.ticketID}</div>}
              </div>

              <div className="text-center my-6">
                <div className="inline-block bg-gray-300 h-px w-1/3"></div>
                <span className="mx-4 text-gray-500 font-medium">Or</span>
                <div className="inline-block bg-gray-300 h-px w-1/3"></div>
              </div>

              <div className="space-y-4">
                <p className="text-center font-medium">Enter Full name and Birthdate</p>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="block font-medium">
                    Lastname*
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && <div className="text-red-500 text-sm">{errors.last_name}</div>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="first_name" className="block font-medium">
                    Firstname*
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && <div className="text-red-500 text-sm">{errors.first_name}</div>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="birthdate" className="block font-medium">
                    Birthdate*
                  </label>
                  <input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={formData.birthdate}
                    onChange={handleChange}
                  />
                  {errors.birthdate && <div className="text-red-500 text-sm">{errors.birthdate}</div>}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#002366] text-white rounded hover:bg-[#001a4d] transition-colors"
                >
                  {loading ? "Checking..." : "Check"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Status Modal Overlay */}
      {showStatus && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md w-full">
            <div className="flex justify-center mb-6">{statusDisplay.icon}</div>

            <h1 className="text-2xl font-bold mb-2">Your Ticket Status:</h1>
            <p className={`text-3xl font-bold mb-6 ${statusDisplay.color}`}>{statusDisplay.title}</p>

            <p className="text-lg mb-8">{statusDisplay.message}</p>

            <button
              onClick={closeStatusModal}
              className="w-full px-6 py-3 bg-[#002366] text-white rounded hover:bg-[#001a4d] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <ContactInfo />
      <Footer />
    </HeaderLayout>
  )
}
