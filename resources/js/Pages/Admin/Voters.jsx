"use client"

import { useState, useEffect, useRef } from "react"
import { Head, usePage, useForm, router } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { PlusCircle, Search, Filter, Download, Upload, Edit, Trash2, X, Check } from "lucide-react"
import AddPrecinctOverlay from "@/Components/Admin/Voters/AddPrecinctOverlay"
import EditVoterOverlay from "@/Components/Admin/Voters/EditVoterOverlay"
import ExportButton from "@/Components/Admin/Exports/ExportButton"
import { useToast } from "@/Contexts/ToastContext"
import axios from "axios";
import ImportButton from "@/Components/Admin/Imports/ImportButton";

const AddVoterOverlay = ({ onClose, precincts, onSave }) => {
  const { data, setData, post, processing } = useForm({
    vote_fname: "",
    vote_lname: "",
    bar_id: "",
    precinct_id: "",
  })
  

  const handleChange = (e) => {
    setData(e.target.name, e.target.value)
  }

  const showToast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    post("/admin/voters", {
      onSuccess: () => {
        onSave(data)
        onClose()
        showToast("Voter added successfully.", "success")
      },
      onError: (errors) => {
        console.error("Failed to create voter:", errors)
      },
    })
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-semibold text-gray-900">Add Voter</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="vote_fname"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="vote_lname"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precinct Number</label>
                <select
                  name="precinct_id"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Precinct</option>
                  {precincts.map((precinct) => (
                    <option key={precinct.id} value={precinct.id}>
                      {precinct.precinct_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barangay ID</label>
                <input
                  type="number"
                  name="bar_id"
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70"
                >
                  {processing ? "Saving..." : "Save Voter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Voters() {
  const { precincts = [], voters: initialVoters = [] } = usePage().props
  const [voters, setVoters] = useState(initialVoters)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPrecincts, setSelectedPrecincts] = useState([])
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddVoterOverlay, setShowAddVoterOverlay] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showAddPrecinctOverlay, setShowAddPrecinctOverlay] = useState(false)
  const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false)
  const [selectedVoter, setSelectedVoter] = useState(null)
  const [showExportDropdown, setShowExportDropdown] = useState(false); // State for export dropdown
  const [nameSortDirection, setNameSortDirection] = useState("asc")
  const [precinctSortDirection, setPrecinctSortDirection] = useState("asc")
  const [activeSortField, setActiveSortField] = useState("name") // Tracks which column is actively being sorted
  // Then you would use filters.precinct in the export function
  
  // Sorting state
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")

  const filterRef = useRef(null)
  const dropdownRef = useRef(null)

  // Initialize all precincts as selected
  useEffect(() => {
    if (precincts.length > 0 && selectedPrecincts.length === 0) {
      setSelectedPrecincts(precincts.map((p) => p.id.toString()))
    }
  }, [precincts])

  // Filter based on search query and selected precincts
  const filteredVoters = voters.filter((voter) => {
    const matchesSearch = `${voter.vote_fname} ${voter.vote_lname}`.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPrecinct = selectedPrecincts.length === 0 || selectedPrecincts.includes(voter.precinct_id.toString())

    return matchesSearch && matchesPrecinct
  })

  const handleNameSort = () => {
    setNameSortDirection(nameSortDirection === "asc" ? "desc" : "asc")
    setActiveSortField("name")
  }
  
  // Update the precinct sorting handler
  const handlePrecinctSort = () => {
    setPrecinctSortDirection(precinctSortDirection === "asc" ? "desc" : "asc")
    setActiveSortField("precinct")
  }
  
  // Update the sorting logic
  const sortedVoters = [...filteredVoters].sort((a, b) => {
    if (activeSortField === "name") {
      const nameA = `${a.vote_lname} ${a.vote_fname}`.toLowerCase()
      const nameB = `${b.vote_lname} ${b.vote_fname}`.toLowerCase()
      return nameSortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
    } else if (activeSortField === "precinct") {
      const precinctA = a.precinct ? a.precinct.precinct_number : ""
      const precinctB = b.precinct ? b.precinct.precinct_number : ""
      return precinctSortDirection === "asc" ? precinctA.localeCompare(precinctB) : precinctB.localeCompare(precinctA)
    }
    return 0
  })
  // Handle sort toggle
  const handleSort = () => {
    // Toggle direction
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  // Pagination
  const indexOfLastVoter = currentPage * entriesPerPage
  const indexOfFirstVoter = indexOfLastVoter - entriesPerPage
  const currentVoters = sortedVoters.slice(indexOfFirstVoter, indexOfLastVoter)
  const totalPages = Math.ceil(sortedVoters.length / entriesPerPage)



  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedPrecincts, entriesPerPage])

  const showToast = useToast()

  // Handle editing a voter
  const handleEditVoter = (voter) => {
    setSelectedVoter(voter)
    setIsEditOverlayOpen(true)
  }

  // Handle saving a voter after editing
  const handleSaveVoter = (updatedVoter) => {
    setVoters((prevVoters) => prevVoters.map((voter) => (voter.id === updatedVoter.id ? updatedVoter : voter)))
    setIsEditOverlayOpen(false)
    showToast("Voter updated successfully.", "success")
  }

  // Handle closing the edit overlay
  const handleCloseOverlay = () => {
    setIsEditOverlayOpen(false)
  }

  // Handle adding a new voter
  const handleAddVoter = (newVoter) => {
    setVoters((prevVoters) => [...prevVoters, newVoter])
    setShowAddVoterOverlay(false)
  }

  // Toggle precinct selection
  const togglePrecinct = (precinctId) => {
    setSelectedPrecincts((prev) => {
      if (prev.includes(precinctId)) {
        return prev.filter((id) => id !== precinctId)
      } else {
        return [...prev, precinctId]
      }
    })
  }

  // Select all precincts
  const selectAllPrecincts = () => {
    setSelectedPrecincts(precincts.map((p) => p.id.toString()))
  }

  // Clear all precinct selections
  const clearAllPrecincts = () => {
    setSelectedPrecincts([])
  }

  const { delete: destroy } = useForm()

  // Handle deleting a voter
  const handleDeleteVoter = (id) => {
    if (!confirm("Are you sure you want to delete this voter?")) return

    destroy(`/admin/voters/${id}`, {
      onSuccess: () => {
        setVoters((prevVoters) => prevVoters.filter((voter) => voter.id !== id))
        showToast("Voter deleted successfully.", "success")
      },
      onError: (errors) => {
        console.error("Failed to delete voter:", errors)
      },
    })
  }

  //handles export
  const exportParams = {
    precinct: selectedPrecincts.length === 1 ? selectedPrecincts[0] : null,
    title: "Voter Report",
    orientation: "P",
    headerText: "Voter Management Report",
    footerText: `Generated on ${new Date().toLocaleString()}`,
  };
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Count active filters
  const activeFilterCount = precincts.length - selectedPrecincts.length

  // Render sort indicator
  const renderNameSortIndicator = () => {
    return (
      <div className="inline-flex flex-col ml-1 h-4 justify-center">
        <svg
          width="8"
          height="10"
          viewBox="0 0 8 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 0L7.4641 6H0.535898L4 0Z" fill={nameSortDirection === "asc" && activeSortField === "name" ? "#4B5563" : "#D1D5DB"} />
        </svg>
        <svg
          width="8"
          height="10"
          viewBox="0 0 8 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 10L0.535899 4L7.4641 4L4 10Z" fill={nameSortDirection === "desc" && activeSortField === "name" ? "#4B5563" : "#D1D5DB"} />
        </svg>
      </div>
    );
  };

  const renderPrecinctSortIndicator = () => {
    return (
      <div className="inline-flex flex-col ml-1 h-4 justify-center">
        <svg
          width="8"
          height="10"
          viewBox="0 0 8 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 0L7.4641 6H0.535898L4 0Z" fill={precinctSortDirection === "asc" && activeSortField === "precinct" ? "#4B5563" : "#D1D5DB"} />
        </svg>
        <svg
          width="8"
          height="10"
          viewBox="0 0 8 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M4 10L0.535899 4L7.4641 4L4 10Z" fill={precinctSortDirection === "desc" && activeSortField === "precinct" ? "#4B5563" : "#D1D5DB"} />
        </svg>
      </div>
    );
  };

  return (
    <AdminLayout
      header={<h2 className="text-2xl font-bold text-gray-800">Voter Management</h2>}
      user={usePage().props.auth.user}
    >
      <Head title="Voters" />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with search and actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="search"
                placeholder="Search voters by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    showFilterDropdown || activeFilterCount > 0
                      ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center bg-indigo-600 text-white text-xs rounded-full w-5 h-5">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {showFilterDropdown && (
                  <div className="absolute z-10 mt-2 w-64 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <h3 className="font-medium text-gray-700">Category</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {precincts.map((precinct) => (
                        <div
                          key={precinct.id}
                          className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => togglePrecinct(precinct.id.toString())}
                        >
                          <div className="flex items-center justify-center w-5 h-5 mr-3 text-blue-600">
                            {selectedPrecincts.includes(precinct.id.toString()) && <Check className="w-4 h-4" />}
                          </div>
                          <span className="text-gray-700">{precinct.precinct_number}</span>
                          <span className="ml-auto text-gray-500">
                            ({voters.filter((v) => v.precinct_id === precinct.id).length})
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-between">
                      <button onClick={selectAllPrecincts} className="text-sm text-blue-600 hover:text-blue-800">
                        Select All
                      </button>
                      <button onClick={clearAllPrecincts} className="text-sm text-blue-600 hover:text-blue-800">
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <ImportButton 
                onImportSuccess={(importedVoters) => {
                  // Update the voters state with the newly imported voters
                  setVoters(prevVoters => [...prevVoters, ...importedVoters]);
                  showToast("Voters imported successfully.", "success");
                }}
              />

              {/* Export Dropdown */}
              <ExportButton exportParams={exportParams} />

              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <PlusCircle className="w-4 h-4" />
                  Add New
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 py-1">
                    <button
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                      onClick={() => {
                        setShowAddVoterOverlay(true)
                        setShowDropdown(false)
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2 text-blue-600" />
                      Add Voter
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                      onClick={() => {
                        setShowAddPrecinctOverlay(true)
                        setShowDropdown(false)
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2 text-green-600" />
                      Add Precinct Number
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={handleNameSort}
                >
                  <div className="flex items-center">
                    Name
                    {renderNameSortIndicator()}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={handlePrecinctSort}
                >
                  <div className="flex items-center">
                  Precinct Number
                  {renderPrecinctSortIndicator()}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVoters.map((voter, index) => (
                <tr key={voter.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{indexOfFirstVoter + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{`${voter.vote_lname} ${voter.vote_fname}`}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs">
                      {voter.precinct ? voter.precinct.precinct_number : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditVoter(voter)}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVoter(voter.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentVoters.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-gray-100 p-4 mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No voters found</h3>
                      <p className="text-sm text-gray-500 max-w-md">
                        {searchQuery || activeFilterCount > 0
                          ? "Try adjusting your search or filter parameters to find what you're looking for."
                          : "Get started by adding voters to the system."}
                      </p>
                      {(searchQuery || activeFilterCount > 0) && (
                        <button
                          onClick={() => {
                            setSearchQuery("")
                            selectAllPrecincts()
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Clear All Filters
                        </button>
                      )}
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
            <span>items of {sortedVoters.length} total</span>
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

      {showAddVoterOverlay && (
        <AddVoterOverlay onClose={() => setShowAddVoterOverlay(false)} precincts={precincts} onSave={handleAddVoter} />
      )}
      {showAddPrecinctOverlay && <AddPrecinctOverlay onClose={() => setShowAddPrecinctOverlay(false)} />}
      {isEditOverlayOpen && (
        <EditVoterOverlay
          voter={selectedVoter}
          precincts={precincts}
          onClose={handleCloseOverlay}
          onSave={handleSaveVoter}
        />
      )}
    </AdminLayout>
  )
}

