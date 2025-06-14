"use client"

import { useState, useEffect } from "react"
import { Head, usePage } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Check, X, Search, ChevronUp, ChevronDown } from "lucide-react"
import { useToast } from "@/Contexts/ToastContext"
import Loader from "@/Components/Loader"
import SignUpReject from "@/Components/Admin/Residents/SignUpReject" // Import the SignUpReject component

export default function SignUpRequests() {
  const { signUpRequests } = usePage().props
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfigs, setSortConfigs] = useState([]) // Array to allow multiple sort filters
  const [isLoading, setIsLoading] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [currentRequestId, setCurrentRequestId] = useState(null)
  const showToast = useToast()

  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestAttachments, setRequestAttachments] = useState([])

  // Pagination state
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const compareValues = (a, b, direction) => {
    const aValue = a ?? "" // Default to empty string if null or undefined
    const bValue = b ?? "" // Default to empty string if null or undefined

    if (aValue < bValue) return direction === "asc" ? -1 : 1
    if (aValue > bValue) return direction === "asc" ? 1 : -1
    return 0
  }

  // Filtered and sorted requests
  const filteredRequests = signUpRequests
    .filter((request) => {
      const searchTerm = searchQuery.toLowerCase()
      return (
        `${request.sign_up_fname} ${request.sign_up_lname}`
          .toLowerCase()
          .includes(searchTerm) ||
        request.sign_up_email?.toLowerCase().includes(searchTerm) ||
        request.sign_up_birthdate?.toLowerCase().includes(searchTerm)
      )
    })
    .sort((a, b) => {
      for (const config of sortConfigs) {
        const result = compareValues(a[config.key], b[config.key], config.direction)
        if (result !== 0) return result // Return as soon as a difference is found
      }
      return 0 // If all sort keys are equal, maintain original order
    })

  // Pagination logic
  const indexOfLastRequest = currentPage * entriesPerPage
  const indexOfFirstRequest = indexOfLastRequest - entriesPerPage
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest)
  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, entriesPerPage, sortConfigs])

  const handleSort = (key) => {
    setSortConfigs((prevConfigs) => {
      const existingConfig = prevConfigs.find((config) => config.key === key)

      if (!existingConfig) {
        // Add new sort key with ascending order
        return [...prevConfigs, { key, direction: "asc" }]
      }

      if (existingConfig.direction === "asc") {
        // Change to descending order
        return prevConfigs.map((config) => (config.key === key ? { ...config, direction: "desc" } : config))
      }

      if (existingConfig.direction === "desc") {
        // Remove the sort key (reset to no order)
        return prevConfigs.filter((config) => config.key !== key)
      }

      return prevConfigs
    })
  }

  const handleApprove = async (id, closeModal = true) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/admin/sign-up-requests/${id}/approve`, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
      })

      if (response.ok) {
        showToast("Sign-up request approved successfully.", "success")
        if (closeModal) setShowDetailsModal(false)
        window.location.reload()
      } else {
        const error = await response.json()
        showToast(error.message || "Failed to approve the request.", "error")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Error approving request:", error)
      showToast("An error occurred while approving the request.", "error")
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (request) => {
    setSelectedRequest(request)
    setShowDetailsModal(true)

    // Fetch attachments for this request
    try {
      const response = await fetch(`/admin/sign-up-requests/${request.id}`, {
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRequestAttachments(data.attachments || [])
      }
    } catch (error) {
      console.error("Error fetching request details:", error)
      setRequestAttachments([])
    }
  }

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800) // Short delay to show the loader

    return () => clearTimeout(timer)
  }, [])

  return (
    <AdminLayout
      header={<h2 className="text-2xl font-bold text-gray-800">Sign-Up Requests</h2>}
      user={usePage().props.auth.user}
    >
      <Head title="Sign-Up Requests" />
      <div className="relative">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Loader */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
              <Loader isLoading={isLoading} />
            </div>
          )}

          {/* Rejection Modal */}
          {showRejectionModal && (
            <SignUpReject
              requestId={currentRequestId}
              setShowRejectionModal={setShowRejectionModal}
              showToast={showToast}
              setIsLoading={setIsLoading}
            />
          )}

          {/* Details Modal */}
          {showDetailsModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Sign-Up Request Details</h3>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false)
                        setSelectedRequest(null)
                        setRequestAttachments([])
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">First Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_fname}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Last Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_lname}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Birthdate</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedRequest.sign_up_birthdate
                            ? new Date(selectedRequest.sign_up_birthdate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Gender</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {selectedRequest.sign_up_gender || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Civil Status</label>
                        <p className="mt-1 text-sm text-gray-900 capitalize">
                          {selectedRequest.sign_up_cstatus || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Voter Status</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedRequest.sign_up_is_voter ? "Registered Voter" : "Not a Registered Voter"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Request Date</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedRequest.created_at
                            ? new Date(selectedRequest.created_at).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Identity Proofs */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Identity Proofs</h4>
                    {requestAttachments.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {requestAttachments.map((attachment, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-blue-600 text-xs font-medium">
                                  {attachment.attach_type?.includes("pdf") ? "PDF" : "IMG"}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{attachment.attach_name}</p>
                                <p className="text-xs text-gray-500">{attachment.attach_type}</p>
                              </div>
                            </div>
                            <a
                              href={`/storage/${attachment.attach_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                            >
                              View File
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No identity proofs uploaded.</p>
                    )}
                  </div>

                  {/* Address Information */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">City</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_city || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Barangay</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_barangay || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Region</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_region || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Block</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_block || "N/A"}</p>
                      </div>
                      {/* <div>
                        <label className="block text-sm font-medium text-gray-500">Sitio</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_sitio || "N/A"}</p>
                      </div> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Street</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_street || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">House No.</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_houseno || "N/A"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Province</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.sign_up_province || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        e.preventDefault()
                        handleApprove(selectedRequest.id)
                      }}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Request
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        e.preventDefault()
                        setShowDetailsModal(false)
                        setCurrentRequestId(selectedRequest.id)
                        setShowRejectionModal(true)
                      }}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header with search */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>Show</span>
                <div className="relative mx-2">
                  <select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    className="appearance-none text-sm bg-white border border-gray-300 rounded px-5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
                <span>items of {filteredRequests.length} total</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    No.
                    {sortConfigs.find((config) => config.key === "id")?.direction === "asc" && (
                      <ChevronUp className="inline w-4 h-4 ml-1" />
                    )}
                    {sortConfigs.find((config) => config.key === "id")?.direction === "desc" && (
                      <ChevronDown className="inline w-4 h-4 ml-1" />
                    )}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("sign_up_fname")}
                  >
                    Name
                    {sortConfigs.find((config) => config.key === "sign_up_fname")?.direction === "asc" && (
                      <ChevronUp className="inline w-4 h-4 ml-1" />
                    )}
                    {sortConfigs.find((config) => config.key === "sign_up_fname")?.direction === "desc" && (
                      <ChevronDown className="inline w-4 h-4 ml-1" />
                    )}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("sign_up_email")}
                  >
                    Email
                    {sortConfigs.find((config) => config.key === "sign_up_email")?.direction === "asc" && (
                      <ChevronUp className="inline w-4 h-4 ml-1" />
                    )}
                    {sortConfigs.find((config) => config.key === "sign_up_email")?.direction === "desc" && (
                      <ChevronDown className="inline w-4 h-4 ml-1" />
                    )}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("sign_up_birthdate")}
                  >
                    Birthdate
                    {sortConfigs.find((config) => config.key === "sign_up_birthdate")?.direction === "asc" && (
                      <ChevronUp className="inline w-4 h-4 ml-1" />
                    )}
                    {sortConfigs.find((config) => config.key === "sign_up_birthdate")?.direction === "desc" && (
                      <ChevronDown className="inline w-4 h-4 ml-1" />
                    )}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(request)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indexOfFirstRequest + index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${request.sign_up_fname} ${request.sign_up_lname}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.sign_up_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.sign_up_birthdate ? new Date(request.sign_up_birthdate).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(request)
                        }}
                        className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200 transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApprove(request.id)
                        }}
                        className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentRequestId(request.id)
                          setShowRejectionModal(true)
                        }}
                        className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {currentRequests.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="rounded-full bg-gray-100 p-4 mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No sign-up requests found</h3>
                        <p className="text-sm text-gray-500 max-w-md">
                          Try adjusting your search to find what you're looking for.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 bg-gray-50">
            <div className="flex items-center text-sm text-gray-600 mb-4 sm:mb-0">
              <span>Show</span>
              <div className="relative mx-2">
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="appearance-none text-sm bg-white border border-gray-300 rounded px-5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
              <span>items of {filteredRequests.length} total</span>
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum

                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 mx-0.5 flex items-center justify-center rounded-md text-sm ${
                        currentPage === pageNum ? "bg-blue-600 text-white font-medium" : "text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
