"use client"

import React, { useState } from "react"
import { useForm } from "@inertiajs/react"
import HeaderLayout from "@/Layouts/HeaderLayout"
import Footer from "@/Layouts/FooterLayout"
import ContactInfo from "@/Components/ContactInfo"
import SignaturePad from "react-signature-canvas"
import { Cloud, CheckCircle } from "lucide-react"

export default function ProofOfIdentity({ profile }) {
  const [submitting, setSubmitting] = useState(false)
  const { data, setData, errors } = useForm({
    signature: null,
    idImage: null,
    showTicket: false,
    ticketID: profile?.ticket_id || "",
    imagePreview: null,
    profile: profile?.id || null,
  })

  const sigPad = React.useRef(null)

  const clear = () => {
    sigPad.current.clear()
  }

  const checkSignature = () => {
    if (sigPad.current.isEmpty()) {
      alert("Please provide a signature")
      return
    }
    setData("signature", sigPad.current.toDataURL())
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setData("idImage", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setData("imagePreview", reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateTicketID = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase()
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    // Make sure we have all required data
    if (!data.signature) {
      alert("Please provide a signature")
      setSubmitting(false)
      return
    }

    if (!data.idImage) {
      alert("Please upload an ID image")
      setSubmitting(false)
      return
    }

    const newTicketID = data.ticketID || generateTicketID()

    // Create form data for file upload
    const formData = new FormData()
    formData.append("signature", data.signature)
    formData.append("idImage", data.idImage)
    formData.append("ticketID", newTicketID)

    if (data.profile) {
      formData.append("profile", data.profile)
    }

    // Send the data to the server
    fetch("/proof-of-identity", {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        "X-Requested-With": "XMLHttpRequest",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((responseData) => {
        console.log("Success response:", responseData)
        setData({
          ...data,
          ticketID: responseData.ticketID,
          showTicket: true,
        })
        setSubmitting(false)
      })
      .catch((error) => {
        console.error("Error:", error)
        alert("There was an error submitting your form. Please try again.")
        setSubmitting(false)
      })
  }

  const handleCompleteRequest = () => {
    // Submit the completed request to create a document request
    fetch("/proof-of-identity/complete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ ticketID: data.ticketID }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.json()
      })
      .then((responseData) => {
        console.log("Complete response:", responseData)
        // Redirect to services page
        window.location.href = "/services"
      })
      .catch((error) => {
        console.error("Error completing request:", error)
        alert("There was an error completing your request. Please try again.")
      })
  }

  return (
    <HeaderLayout>
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm mb-6">
            <span className="text-gray-600">Services {">"} Clearance</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            <div className="bg-[#e5e7eb] text-gray-700 px-6 py-3 clip-path-arrow">Personal</div>
            <div className="bg-[#1e1b4b] text-white px-6 py-3 clip-path-arrow ml-[-10px]">Proof of Identity</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Signature Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium mb-2">Input Signature:</label>
                <div className="border rounded-lg bg-white p-2">
                  <SignaturePad
                    ref={sigPad}
                    canvasProps={{
                      className: "signature-canvas w-full h-[200px] border rounded",
                    }}
                  />
                </div>
                <div className="mt-2 space-x-2">
                  <button type="button" onClick={clear} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={checkSignature}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Check Signature
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Signature:</label>
                <div className="border rounded-lg bg-gray-50 h-[200px]">
                  {data.signature && (
                    <img
                      src={data.signature || "/placeholder.svg"}
                      alt="Your signature"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ID Upload Section */}
            <div className="border-2 border-dashed rounded-lg p-8">
              <div className="text-center">
                {data.imagePreview ? (
                  <img
                    src={data.imagePreview || "/placeholder.svg"}
                    alt="ID Preview"
                    className="max-h-48 mx-auto mb-4"
                  />
                ) : (
                  <Cloud className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                )}
                <p className="text-red-500 mb-4">* Please provide a valid ID and a photo of you holding the ID</p>
                <label className="inline-block">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <span className="px-4 py-2 bg-[#1e1b4b] text-white rounded cursor-pointer hover:bg-[#2d2a5d]">
                    Choose Image
                  </span>
                </label>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-8 py-2 bg-[#e5e7eb] text-gray-700 rounded hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2 bg-[#1e1b4b] text-white rounded hover:bg-[#2d2a5d]"
              >
                {submitting ? "Processing..." : "Finish"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Ticket Modal */}
      {data.showTicket && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md w-full">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Request Submitted</h2>
            <p className="text-gray-600 mb-4">Your request has been successfully submitted.</p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold">Your Ticket ID:</p>
              <p className="text-2xl font-bold text-[#1e1b4b]">{data.ticketID}</p>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Please save this ticket ID for future reference. You can use it to track the status of your request.
            </p>
            <button
              type="button"
              onClick={handleCompleteRequest}
              className="w-full px-6 py-3 bg-[#1e1b4b] text-white rounded hover:bg-[#2d2a5d] transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Info & Footer */}
      <div className="mt-8">
        <ContactInfo />
      </div>
      <Footer />
    </HeaderLayout>
  )
}
