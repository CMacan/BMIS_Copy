"use client"

import { useState } from "react"
import { Head, usePage } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Search, Filter, PlusCircle, Edit, Trash2, ChevronFirst, ChevronLast, ChevronLeft, BookOpenText, ChevronRight } from "lucide-react"

export default function Residents() {
  const { users, profiles } = usePage().props
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Merge users and standalone profiles
  const allResidents = [
    ...users.map((user) => ({
      id: user.id,
      email: user.email,
      contact: user.user_contact,
      birthdate: user.profile?.prof_birthdate,
      name: `${user.profile?.prof_fname} ${user.profile?.prof_lname}`.trim(),
      status: "Registered User",
    })),
    ...profiles.map((profile) => ({
      id: `P-${profile.id}`,
      email: "N/A",
      contact: "N/A",
      birthdate: profile.prof_birthdate,
      name: `${profile.prof_fname} ${profile.prof_lname}`.trim(),
      status: "Profile Only",
    })),
  ]

  // Filter based on search query
  const filteredResidents = allResidents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredResidents.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <AdminLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Residents</h2>}
      user={usePage().props.auth.user}
    >
      <Head title="Residents" />
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search residents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button className="px-3 py-2 border border-gray-200 rounded-md flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 text-sm font-medium hover:bg-blue-700">
              <PlusCircle className="h-4 w-4" />
              Add Resident
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">No.</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentItems.map((resident, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{resident.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{resident.contact}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resident.status === "Registered User"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {resident.status}
                    </span>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-sm text-center text-gray-500">
                    No residents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex items-center text-sm text-gray-700">
            <span>Show</span>
            <select
              className="mx-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={itemsPerPage}
              onChange={(e) => {
                setCurrentPage(1)
                // In a real implementation, you would update itemsPerPage here
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>items of {filteredResidents.length} total</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronFirst className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {/* Page numbers */}
            {[...Array(totalPages).keys()]
              .map((number) => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded ${
                    currentPage === number + 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {number + 1}
                </button>
              ))
              .slice(0, 5)}{" "}
            {/* Limit to first 5 pages for simplicity */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLast className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

