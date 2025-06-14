"use client"

import { useState, useEffect } from "react"
import { Head, usePage, router } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useToast } from "@/Contexts/ToastContext"
import {Edit, Trash2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, PlusCircle} from "lucide-react";

export default function AllAccounts() {
  const { users } = usePage().props
  const [searchQuery, setSearchQuery] = useState("")
  const [editingUser, setEditingUser] = useState(null)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [editForm, setEditForm] = useState({
    email: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [newAccountForm, setNewAccountForm] = useState({
    prof_fname: "",
    prof_lname: "",
    prof_birthdate: "",
    prof_gender: "",
    prof_cstatus: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const [statusFilter, setStatusFilter] = useState({
    active: false,
    inactive: false,
  })

  const filteredUsers = users.filter((user) => {
    const email = (user.email || "").toLowerCase()
    const matchesSearch = email.includes(searchQuery.toLowerCase())

    // If no status filters are selected, show all results
    if (!statusFilter.active && !statusFilter.inactive) {
      return matchesSearch
    }

    // If active filter is selected
    if (statusFilter.active && user.user_status === "active") {
      return matchesSearch
    }

    // If inactive filter is selected
    if (statusFilter.inactive && user.user_status !== "active") {
      return matchesSearch
    }

    return false
  })

  const showToast = useToast()
  const handleEditClick = (user) => {
    setEditingUser(user)
    setEditForm({
      email: user.email || "",
    })
  }

  //pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleNewAccountChange = (e) => {
    setNewAccountForm({
      ...newAccountForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await router.put(`/admin/all-accounts/user/${editingUser.id}`, editForm, {
        onSuccess: () => {
          setEditingUser(null)
          showToast("Account updated successfully!", "success")
        },
        onError: (errors) => {
          setErrors(errors)
        },
        preserveScroll: true,
      })
    } catch (error) {
      console.error("Update error:", error)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddAccountSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await router.post("/admin/all-accounts", newAccountForm, {
        onSuccess: () => {
          setShowAddAccountModal(false)
          showToast("Account created successfully!", "success")
          setNewAccountForm({
            prof_fname: "",
            prof_lname: "",
            prof_birthdate: "",
            prof_gender: "Male",
            prof_cstatus: "Single",
            email: "",
            password: "",
            password_confirmation: "",
          })
        },
        onError: (errors) => {
          setErrors(errors)
          showToast("Failed to create account.", "error")
        },
        preserveScroll: true,
      })
    } catch (error) {
      console.error("Create error:", error)
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    router.delete(`/admin/all-accounts/user/${userToDelete.id}`, {
      onSuccess: () => {
        setShowDeleteConfirm(false)
        setUserToDelete(null)
        showToast("Account deleted successfully!", "success")
      },
    })
  }

  const handleStatusFilterChange = (status) => {
    setStatusFilter((prev) => ({
      ...prev,
      [status]: !prev[status],
    }))
  }

  useEffect(() => {
    function handleClickOutside(event) {
      const dropdown = document.getElementById("status-filter-dropdown")
      if (
        dropdown &&
        !dropdown.contains(event.target) &&
        !event.target.closest('button[aria-controls="status-filter-dropdown"]')
      ) {
        dropdown.classList.add("hidden")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <AdminLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">All Accounts</h2>}
      user={usePage().props.auth.user}
    >
      <Head title="All Accounts" />
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => document.getElementById("status-filter-dropdown").classList.toggle("hidden")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                id="status-filter-dropdown"
                className="absolute mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 hidden"
              >
                <div className="p-2">
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilter.active}
                      onChange={() => handleStatusFilterChange("active")}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={statusFilter.inactive}
                      onChange={() => handleStatusFilterChange("inactive")}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddAccountModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="w-4 h-4"/>
            Create Account
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.user_status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.user_status || "Registered User"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditClick(user)} className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition-colors">
                        <Edit className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(user)} className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                    No accounts found.
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
                    <span>items of {filteredUsers.length} total</span>
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

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create Resident Account</h3>
              <button onClick={() => setShowAddAccountModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddAccountSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="prof_fname"
                    value={newAccountForm.prof_fname}
                    onChange={handleNewAccountChange}
                    className={`w-full px-3 py-2 border ${
                      errors.prof_fname ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    required
                  />
                  {errors.prof_fname && <p className="mt-1 text-sm text-red-600">{errors.prof_fname}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="prof_lname"
                    value={newAccountForm.prof_lname}
                    onChange={handleNewAccountChange}
                    className={`w-full px-3 py-2 border ${
                      errors.prof_lname ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    required
                  />
                  {errors.prof_lname && <p className="mt-1 text-sm text-red-600">{errors.prof_lname}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                  <input
                    type="date"
                    name="prof_birthdate"
                    value={newAccountForm.prof_birthdate}
                    onChange={handleNewAccountChange}
                    className={`w-full px-3 py-2 border ${
                      errors.prof_birthdate ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    required
                  />
                  {errors.prof_birthdate && <p className="mt-1 text-sm text-red-600">{errors.prof_birthdate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="prof_gender"
                    value={newAccountForm.prof_gender}
                    onChange={handleNewAccountChange}
                    className={`w-full px-3 py-2 border ${
                      errors.prof_gender ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                  >
                    <option value="" disabled hidden>
                      Select gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.prof_gender && <p className="mt-1 text-sm text-red-600">{errors.prof_gender}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Civil Status</label>
                <select
                  name="prof_cstatus"
                  value={newAccountForm.prof_cstatus}
                  onChange={handleNewAccountChange}
                  className={`w-full px-3 py-2 border ${
                    errors.prof_cstatus ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                >
                  <option value="" disabled hidden>
                    Select Status
                  </option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
                {errors.prof_cstatus && <p className="mt-1 text-sm text-red-600">{errors.prof_cstatus}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={newAccountForm.email}
                  onChange={handleNewAccountChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={newAccountForm.password}
                    onChange={handleNewAccountChange}
                    className={`w-full px-3 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    required
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={newAccountForm.password_confirmation}
                    onChange={handleNewAccountChange}
                    className={`w-full px-3 py-2 border ${
                      errors.password_confirmation ? "border-red-500" : "border-gray-300"
                    } rounded-md`}
                    required
                  />
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>
              </div>
              {errors.general && <p className="mt-2 text-sm text-red-600">{errors.general}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Edit Overlay */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Edit User: {editingUser.email}</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
              {errors.general && <p className="mt-2 text-sm text-red-600">{errors.general}</p>}
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the account of {userToDelete.email}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
  