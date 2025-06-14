"use client"

import React, { useState } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import { format } from "date-fns"

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>{children}</div>
)

const CardHeader = ({ children }) => <div className="px-6 py-4 border-b border-gray-200">{children}</div>

const CardContent = ({ children }) => <div className="p-6">{children}</div>

const Table = ({ children }) => <table className="min-w-full divide-y divide-gray-200">{children}</table>

const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>

const TableBody = ({ children }) => <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>

const TableRow = ({ children }) => <tr>{children}</tr>

const TableHead = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>
)

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap ${className}`}>{children}</td>
)

const Badge = ({ children, variant }) => {
  const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
  const variantClasses = {
    yellow: "bg-yellow-100 text-yellow-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  }
  return <span className={`${baseClasses} ${variantClasses[variant] || variantClasses.red}`}>{children}</span>
}

const Button = ({ children, onClick, variant = "primary" }) => {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500",
  }
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} onClick={onClick}>
      {children}
    </button>
  )
}

const ComplaintDetails = ({ complaint, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(complaint.comp_status)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})

  const handleStatusChange = (e) => {
    setStatus(e.target.value)
  }

  const submitStatusChange = async (e) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const response = await fetch(`/admin/complaints/${complaint.id}/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      setProcessing(false)
      setErrors({})
      onUpdateStatus(complaint.id, status)
      onClose()
    } catch (error) {
      console.error("Error:", error)
      setErrors({ status: "Failed to update status. Please try again." })
      setProcessing(false)
    }
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Complaint Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Title</p>
                      <p className="text-sm text-gray-900">{complaint.comp_title}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                      <p className="text-sm text-gray-900">{complaint.comp_category}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                        {complaint.comp_description}
                      </div>
                    </div>

                    {complaint.profile && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Submitted By</p>
                        <p className="text-sm text-gray-900">
                          {complaint.profile.prof_fname} {complaint.profile.prof_lname}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                      <p className="text-sm text-gray-900">
                        {format(new Date(complaint.created_at), "MMMM dd, yyyy 'at' HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={submitStatusChange} className="mt-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={status}
                    onChange={handleStatusChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                  <div className="mt-4 flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                      disabled={processing}
                    >
                      {processing ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminComplaint({ complaints }) {
  const [complaintsList, setComplaintsList] = useState(complaints)
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint)
  }

  const handleCloseModal = () => {
    setSelectedComplaint(null)
  }

  const handleUpdateStatus = (id, newStatus) => {
    setComplaintsList((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint.id === id ? { ...complaint, comp_status: newStatus } : complaint
      )
    )
  }

  const getStatusBadge = (status) => {
    const statusVariants = {
      pending: "yellow",
      "in progress": "blue",
      completed: "green",
    }

    return <Badge variant={statusVariants[status] || "red"}>{status}</Badge>
  }

  return (
    <AdminLayout>
      <div className="py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Complaint Management</h1>
          <Card>
            <CardHeader>
              <h1 className="text-2xl font-semibold text-gray-900">List of Complaints</h1>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaintsList.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="truncate max-w-xs" title={complaint.comp_title}>
                        {complaint.comp_title.length > 10 ? `${complaint.comp_title.slice(0, 10)}...` : complaint.comp_title}
                      </TableCell>
                      <TableCell>{complaint.comp_category}</TableCell>
                      <TableCell>{getStatusBadge(complaint.comp_status)}</TableCell>
                      <TableCell>
                        {complaint.profile ? `${complaint.profile.prof_fname} ${complaint.profile.prof_lname}` : "N/A"}
                      </TableCell>
                      <TableCell>{format(new Date(complaint.created_at), "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <Button variant="outline" onClick={() => handleViewDetails(complaint)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedComplaint && (
        <ComplaintDetails
          complaint={selectedComplaint}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </AdminLayout>
  )
}

// BREANNA BATIG NAWNG NGANU WALA MAN MOY GI PUSH -_-