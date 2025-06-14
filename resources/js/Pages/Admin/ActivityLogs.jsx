"use client"

import { useState } from "react"
import { Head, usePage } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { Filter, SortAsc, SortDesc, Download, ChevronLeft, ChevronRight, Info } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css"

export default function ActivityLogs() {
  const { logs, auth } = usePage().props
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    log_table: [],
    date: {
      start: null,
      end: null,
    },
  })
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" })
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedLog, setSelectedLog] = useState(null)

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Cycle through: asc -> desc -> none
        if (prev.direction === "asc") {
          return { key, direction: "desc" }
        } else if (prev.direction === "desc") {
          return { key: null, direction: null }
        }
      }
      // Default to ascending for a new column
      return { key, direction: "asc" }
    })
  }

  const sortedLogs = [...logs].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) {
      return 0 // No sorting
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const filteredLogs = sortedLogs.filter((log) => {
    const matchesSearch = log.log_action.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTable = filters.log_table.length > 0 ? filters.log_table.includes(log.log_table) : true

    // Date filtering
    let matchesDate = true
    if (filters.date.start && filters.date.end) {
      const logDate = new Date(log.created_at)
      const startDate = new Date(filters.date.start)
      const endDate = new Date(filters.date.end)
      endDate.setHours(23, 59, 59, 999) // Set to end of day
      matchesDate = logDate >= startDate && logDate <= endDate
    }

    return matchesSearch && matchesTable && matchesDate
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)

  const handleTableFilterChange = (table) => {
    setFilters((prev) => {
      const isSelected = prev.log_table.includes(table)
      return {
        ...prev,
        log_table: isSelected ? prev.log_table.filter((t) => t !== table) : [...prev.log_table, table],
      }
    })
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handleDateFilterChange = (startDate, endDate) => {
    setFilters((prev) => ({
      ...prev,
      date: {
        start: startDate,
        end: endDate,
      },
    }))
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  const exportToCSV = () => {
    const params = new URLSearchParams();

    if (filters.log_table) params.append('log_table', filters.log_table);
    if (filters.log_action) params.append('log_action', filters.log_action);
    if (filters.date.start) params.append('date_start', filters.date.start);
    if (filters.date.end) params.append('date_end', filters.date.end);

    const url = route('admin.activity-logs.export') + '?' + params.toString();
    window.location.href = url; // Redirect to the export route
  };

  const viewLogDetails = (log) => {
    setSelectedLog(log)
  }

  const closeLogDetails = () => {
    setSelectedLog(null)
  }

  // Helper function to get pagination range
  const getPaginationRange = (current, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current <= 3) {
      return [1, 2, 3, 4, 5]
    }

    if (current >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total]
    }

    return [current - 2, current - 1, current, current + 1, current + 2]
  }

  return (
    <AdminLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Activity Logs</h2>}
      user={auth.user}
    >
      <Head title="Activity Logs" />
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="search"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={() => setShowFilterOptions(!showFilterOptions)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {showFilterOptions && (
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 font-medium text-gray-700">Filter by Table</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[...new Set(logs.map((log) => log.log_table))].map((table, index) => (
                    <label key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={filters.log_table.includes(table)}
                        onChange={() => handleTableFilterChange(table)}
                        className="form-checkbox h-4 w-4 text-blue-600"
                      />
                      <span className="text-sm">{table}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-gray-700">Filter by Date Range</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={filters.date.start || ""}
                      onChange={(e) => handleDateFilterChange(e.target.value, filters.date.end)}
                      className="px-2 py-1 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      value={filters.date.end || ""}
                      onChange={(e) => handleDateFilterChange(filters.date.start, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortConfig.key === "id" &&
                    sortConfig.direction &&
                    (sortConfig.direction === "asc" ? (
                      <SortAsc className="inline w-4 h-4 ml-1" />
                    ) : (
                      <SortDesc className="inline w-4 h-4 ml-1" />
                    ))}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("log_action")}
                >
                  Action
                  {sortConfig.key === "log_action" &&
                    sortConfig.direction &&
                    (sortConfig.direction === "asc" ? (
                      <SortAsc className="inline w-4 h-4 ml-1" />
                    ) : (
                      <SortDesc className="inline w-4 h-4 ml-1" />
                    ))}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("log_table")}
                >
                  Table
                  {sortConfig.key === "log_table" &&
                    sortConfig.direction &&
                    (sortConfig.direction === "asc" ? (
                      <SortAsc className="inline w-4 h-4 ml-1" />
                    ) : (
                      <SortDesc className="inline w-4 h-4 ml-1" />
                    ))}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Date
                  {sortConfig.key === "created_at" &&
                    sortConfig.direction &&
                    (sortConfig.direction === "asc" ? (
                      <SortAsc className="inline w-4 h-4 ml-1" />
                    ) : (
                      <SortDesc className="inline w-4 h-4 ml-1" />
                    ))}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{log.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.log_action}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.log_table}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <button onClick={() => viewLogDetails(log)} className="text-blue-600 hover:text-blue-800">
                      <Info className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500">
                    No logs found.
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
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>items of {filteredLogs.length} total</span>
          </div>
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <span className="sr-only">First page</span>
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="ml-2 p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex mx-2">
              {getPaginationRange(currentPage, totalPages).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="ml-2 p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <span className="sr-only">Last page</span>
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </button>
          </nav>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Log Details</h3>
                {/* <button onClick={closeLogDetails} className="text-2xl text-gray-500 hover:text-gray-700 w-8 h-8 flex items-center justify-center">
                  &times;
                </button> */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">ID</p>
                  <p className="text-sm">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Table</p>
                  <p className="text-sm">{selectedLog.log_table}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Action</p>
                  <p className="text-sm">{selectedLog.log_action}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm">{new Date(selectedLog.created_at).toLocaleString()}</p>
                </div>
                {selectedLog.log_data && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Data</p>
                    <pre className="text-xs bg-gray-100 p-3 rounded mt-1 overflow-x-auto">
                      {JSON.stringify(JSON.parse(selectedLog.log_data || "{}"), null, 2)}
                    </pre>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeLogDetails}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
