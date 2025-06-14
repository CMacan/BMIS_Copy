"use client"

import { useState, useEffect, useRef } from "react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Head, usePage , router } from "@inertiajs/react"
import {
  Search,
  Calendar,
  Download,
  Filter,
  Eye,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock,
} from "lucide-react"
import SubmissionModal from "@/Components/Admin/SubmissionModal"

export default function FormsToVerify() {
  const { props } = usePage();
  const { applications = [] } = usePage().props // Default to an empty array if applications is undefined
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [searchQuery, setSearchQuery] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const tableContainerRef = useRef(null)
  const [tableHeight, setTableHeight] = useState("auto")
  const [currentTab, setCurrentTab] = useState(props.activeTab || "all");
  const [isApproving, setIsApproving] = useState(false)
  // Calculate and set the table height based on viewport
  useEffect(() => {
    function calculateTableHeight() {
      if (tableContainerRef.current) {
        const viewportHeight = window.innerHeight
        const tableTop = tableContainerRef.current.getBoundingClientRect().top
        const footerHeight = 60 // Approximate height of the pagination footer
        const newHeight = viewportHeight - tableTop - footerHeight - 40 // 40px for padding
        setTableHeight(`${Math.max(300, newHeight)}px`) // Minimum height of 300px
      }
    }

    calculateTableHeight()
    window.addEventListener("resize", calculateTableHeight)
    return () => window.removeEventListener("resize", calculateTableHeight)
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (openDropdownId !== null && !event.target.closest(".dropdown-container")) {
        setOpenDropdownId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openDropdownId])

  const currentProfilePicture = selectedSubmission?.profilePictureUrl
  ? selectedSubmission.profilePictureUrl
  : "/images/default-profile.jpg"

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    router.get("/forms-to-verify", { tabs: tabId }); // if using Inertia
  };
  const tabs = [
    {
      id: "all",
      label: "All Requests",
      count: applications.filter((f) => f.status === "pending").length,
      icon: AlertCircle,
    },
    {
      id: "pending",
      label: "Pending",
      count: applications.filter((f) => f.status === "pending").length,
      icon: Clock,
      bgColor: "bg-yellow-200",
    },
    {
      id: "approved",
      label: "Approved",
      count: applications.filter((f) => f.status === "approved").length,
      icon: CheckCircle,
      bgColor: "bg-green-200",
    },
    {
      id: "declined",
      label: "Declined",
      count: applications.filter((f) => f.status === "declined").length,
      icon: XCircle,
    },
  ]

  // Fix the handleView function to properly process the response data
  const handleView = async (submission) => {
    try {
        const response = await fetch(`/admin/forms-to-verify/${submission.id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        setSelectedSubmission({
      ...data,
      profilePictureUrl: data.profilePictureUrl,
      formImage: data.formImage,
      formType: data.formType,
      signatureUrl: data.signatureUrl
    });
        setIsModalOpen(true);

    } catch (error) {
        console.error('Fetch error:', error);
        alert(`Error loading submission: ${error.message}\nCheck console for details.`);
        
        // For debugging - view the full error page
        window.open(`/admin/forms-to-verify/${submission.id}`, '_blank');
    }
};

const handleApprove = async (id) => {
  const confirm = window.confirm("Are you sure you want to approve this submission?");
  if (!confirm) return;

  setIsApproving(true);
  document.body.style.cursor = "wait";

  try {
    const response = await fetch(`/forms-to-verify/${id}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to approve submission");
    }

    // Redirect to "approved" tab after success
    // router.get("/forms-to-verify", { tabs: "approved" });
    router.get(`/forms-to-verify?tabs=${currentTab}`, {
      preserveState: true,
      onSuccess: () => {
        // Show success message
        alert('Application approved successfully!');
      }
    });
  } catch (error) {
    console.error("Approval error:", error);
    alert(error.message);
  } finally {
    setIsApproving(false);
    document.body.style.cursor = "default";
  }
};



  const handleDeny = async (id) => {
    try {
      const response = await fetch(route("admin.forms.decline", { id }), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
          "X-Requested-With": "XMLHttpRequest",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to decline submission")
      }

      const data = await response.json()
      console.log(data.message)
      setIsModalOpen(false)
      window.location.reload() // Temporary solution
    } catch (error) {
      console.error("Failed to decline submission:", error)
      alert(error.message)
    }
  }

  const handleDelete = (id) => {
    // Logic to delete the submission
    console.log("Deleting submission:", id)
  }

  // Filter applications based on current tab and search query
  const filteredApplications = applications.filter((app) => {
    // Filter by tab
    if (currentTab === "all" && app.status !== "pending") {
      return false;
    }
    if (currentTab !== "all" && app.status.toLowerCase() !== currentTab) {
      return false
    }

    // Filter by search query
    if (
      searchQuery &&
      !app.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !app.formType.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by date range
    if (dateRange.start && new Date(app.submissionDate) < new Date(dateRange.start)) {
      return false
    }
    if (dateRange.end && new Date(app.submissionDate) > new Date(dateRange.end)) {
      return false
    }

    return true
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredApplications.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + entriesPerPage)

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          bg: "bg-gradient-to-r from-emerald-50 to-green-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: "text-emerald-500",
        }
      case "pending":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: "text-amber-500",
        }
      case "declined":
        return {
          bg: "bg-gradient-to-r from-rose-50 to-red-50",
          text: "text-rose-700",
          border: "border-rose-200",
          icon: "text-rose-500",
        }
      default:
        return {
          bg: "bg-gradient-to-r from-gray-50 to-slate-50",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: "text-gray-500",
        }
    }
  }

  return (
    <AdminLayout>
      <Head title="Forms to Verify" />
      <div className="p-2 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto pt-4">
          {/* Simple Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Forms to Verify</h1>
            <p className="mt-2 text-gray-600">Review and manage form submissions from residents</p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-lg border border-black-250 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`
                    flex items-center whitespace-nowrap py-5 px-8 font-medium text-sm transition-all duration-200
                    ${
                      currentTab === tab.id
                        ? "border-b-2 border-indigo-600 text-indigo-700 bg-indigo-100 shadow-[0_4px_10px_-10px_rgba(0,0,0,0.1)]"
                        : "border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }
                  `}
                >
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 
                    ${currentTab === tab.id ? tab.bgColor : "bg-gray-200 text-gray-500"}`}
                  >
                    <tab.icon className="h-4 w-4" />
                  </div>
                  {tab.label}
                  <span
                    className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                    ${currentTab === tab.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}
                  `}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Filters and Controls */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center w-full md:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                    <input
                      type="text"
                      placeholder="Search forms..."
                      className="pl-10 pr-3 py-3 w-full sm:w-64 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white shadow-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
                      <input
                        type="date"
                        className="pl-10 pr-3 py-3 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white shadow-sm"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      />
                    </div>
                    <span className="text-gray-500 hidden sm:inline">to</span>
                    <input
                      type="date"
                      className="px-3 py-3 w-full sm:w-auto border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white shadow-sm"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <select
                      className="appearance-none bg-white border border-gray-300 rounded-xl py-3 pl-3 pr-10 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm"
                      value={entriesPerPage}
                      onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                    >
                      <option value={10}>10 entries</option>
                      <option value={25}>25 entries</option>
                      <option value={50}>50 entries</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <button className="inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/30 transition-all duration-200 shadow-sm">
                    <Filter className="h-4 w-4 mr-2 text-white-600" />
                    Filter
                  </button>

                  {/* <button className="inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium text-white bg-yellow-400 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200 shadow-md hover:shadow-lg">
                    <Download className="h-4 w-4 mr-2 text-white" />
                    Export
                  </button> */}
                </div>
              </div>
            </div>

            {/* Forms Table with dynamic height */}
            <div ref={tableContainerRef} className="overflow-auto flex-grow" style={{ height: tableHeight }}>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 to-white sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Form Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date Requested
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedApplications.length > 0 ? (
                    paginatedApplications.map((form) => {
                      const statusColors = getStatusColor(form.status)
                      return (
                        <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{form.name}</div>
                                <div className="text-xs text-gray-500 mt-1">ID: {form.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">{form.formType}</div>
                            <div className="text-xs text-gray-500 mt-1">Document</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{form.submissionDate}</div>
                            <div className="text-xs text-gray-500 mt-1">10:30 AM</div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border ${statusColors.bg} ${statusColors.text} ${statusColors.border} shadow-sm`}
                            >
                              {form.status === "Approved" && (
                                <CheckCircle className={`h-3.5 w-3.5 mr-1.5 ${statusColors.icon}`} />
                              )}
                              {form.status === "Pending" && (
                                <Clock className={`h-3.5 w-3.5 mr-1.5 ${statusColors.icon}`} />
                              )}
                              {form.status === "Declined" && (
                                <XCircle className={`h-3.5 w-3.5 mr-1.5 ${statusColors.icon}`} />
                              )}
                              {form.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button
                                onClick={() => handleView(form)}
                                className="p-2 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg"
                                title="View details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {/* <button
                                onClick={() => handleDelete(form.id)}
                                className="p-2 rounded-lg text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button> */}
                              {/* <div className="relative dropdown-container">
                                <button
                                  onClick={() => setOpenDropdownId(openDropdownId === form.id ? null : form.id)}
                                  className="p-2 rounded-lg text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                                <div
                                  className={`absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 ${
                                    openDropdownId === form.id ? "block" : "hidden"
                                  } border border-gray-200 backdrop-blur-sm`}
                                >
                                  <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs font-medium text-gray-500">ACTIONS</p>
                                  </div>
                                  <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors">
                                    <Download className="h-4 w-4 inline mr-2 text-indigo-500" />
                                    Download PDF
                                  </button>
                                  <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 transition-colors">
                                    <AlertCircle className="h-4 w-4 inline mr-2 text-amber-500" />
                                    Send reminder
                                  </button>
                                  <button className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">
                                    <FileText className="h-4 w-4 inline mr-2 text-blue-500" />
                                    Archive
                                  </button>
                                </div>
                              </div> */}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <AlertCircle className="h-10 w-10 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No forms found matching your criteria</p>
                          <p className="text-gray-400 text-sm mt-1 max-w-md">
                            Try adjusting your search or filter parameters to find what you're looking for.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery("")
                              setDateRange({ start: "", end: "" })
                              setCurrentTab("all")
                            }}
                            className="mt-4 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredApplications.length > 0 && (
              <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(startIndex + entriesPerPage, filteredApplications.length)}
                    </span>{" "}
                    of <span className="font-medium">{filteredApplications.length}</span> results
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    // Show pages around current page
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
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg shadow-sm
                          ${
                            currentPage === pageNum
                              ? "z-10 bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600 text-white"
                              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                        `}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        submission={selectedSubmission}
        onApprove={handleApprove}
        onDeny={handleDeny}
      />
    </AdminLayout>
  )
}
