"use client"

import { Head, Link } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, Sector } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

const SectoralGroups = ({ sectoralGroups, totalResidents }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showBulkEditModal, setShowBulkEditModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)

  // Process data to ensure percentages are accurate
  const processedData = sectoralGroups.map((group) => ({
    ...group,
    // Ensure percentage is calculated correctly based on count and totalResidents
    calculatedPercentage: totalResidents > 0 ? ((group.count / totalResidents) * 100).toFixed(1) : 0,
  }))

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) setShowDropdown(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  // Frontend export functionality
  const exportToCSV = () => {
    setIsLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      const csvContent = [
        ["Sectoral Group", "Members", "Percentage"],
        ...processedData.map((item) => [item.name, item.count, `${item.calculatedPercentage}%`]),
      ]
        .map((e) => e.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `sectoral_groups_${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsLoading(false)
    }, 800)
  }

  // Handle pie chart hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  // Custom label function with improved positioning for zero values
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index }) => {
    // Skip labels for very small or zero percentages to avoid clutter
    if (percent < 0.01) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7

    // Calculate position
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Use calculated percentage from our processed data
    const displayPercent = processedData[index].calculatedPercentage

    return (
      <text
        x={x}
        y={y}
        fill="#1f2937"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
      >
        {`${name}: ${displayPercent}%`}
      </text>
    )
  }

  // External labels for small/zero percentage groups
  const renderExternalLabels = () => {
    // Only show external labels for groups with very small percentages
    const smallGroups = processedData.filter((group) => group.count / totalResidents < 0.01 && group.count > 0)

    if (smallGroups.length === 0) return null

    return (
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {smallGroups.map((group, index) => (
          <div
            key={index}
            className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1"
            style={{
              backgroundColor: `${COLORS[processedData.indexOf(group) % COLORS.length]}20`,
              color: COLORS[processedData.indexOf(group) % COLORS.length],
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[processedData.indexOf(group) % COLORS.length] }}
            ></span>
            {group.name}: {group.calculatedPercentage}%
          </div>
        ))}
      </div>
    )
  }

  // Custom active shape for hover effect
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    )
  }

  // Handle dropdown actions
  const handleBulkEdit = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    setShowBulkEditModal(true)
  }

  const handleSendNotification = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    setShowNotificationModal(true)
  }

  const handleGenerateReport = (e) => {
    e.stopPropagation()
    setShowDropdown(false)
    setShowReportModal(true)
  }

  const toggleDropdown = (e) => {
    e.stopPropagation()
    setShowDropdown(!showDropdown)
  }

  // Custom tooltip with accurate percentages
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{`Members: ${data.count}`}</p>
          <p className="text-sm text-gray-600">{`Percentage: ${data.calculatedPercentage}%`}</p>
        </div>
      )
    }
    return null
  }

  // Icons for the UI
  const CrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zM12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  )

  const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM7.5 8a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3 19v-.5a5.5 5.5 0 0111 0v.5c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z" />
    </svg>
  )

  const PieChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 2.07c3.07.38 5.57 2.52 6.18 5.5H13V4.07zM4 12c0-4.08 3.06-7.44 7-7.93v15.87c-3.94-.49-7-3.85-7-7.94zm9 7.93V13h6.18c-.61 2.99-3.11 5.12-6.18 5.5z" />
    </svg>
  )

  const DownloadIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )

  const MoreVerticalIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )

  const PlusIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )

  const EditIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )

  const BellIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )

  const FileTextIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )

  // Find largest group
  const largestGroup = processedData.reduce(
    (max, group) => (max.count > group.count ? max : group),
    processedData[0] || {},
  )

  // Modal Components
  const BulkEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Bulk Edit Groups</h3>
        <p className="text-gray-600 mb-4">Select groups to edit their properties in bulk.</p>
        <div className="space-y-2 mb-4">
          {processedData.map((group, index) => (
            <label key={index} className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>
                {group.name} ({group.count} members)
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowBulkEditModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Bulk edit functionality would be implemented here")
              setShowBulkEditModal(false)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Selected
          </button>
        </div>
      </div>
    </div>
  )

  const NotificationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Send Group Notification</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Groups</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {processedData.map((group, index) => (
                <label key={index} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>{group.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="3"
              placeholder="Enter your notification message..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowNotificationModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Notification would be sent here")
              setShowNotificationModal(false)
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Send Notification
          </button>
        </div>
      </div>
    </div>
  )

  const ReportModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Generate Annual Report</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Year</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Include Sections</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Group Statistics</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Member Demographics</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" defaultChecked />
                <span>Growth Analysis</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Annual report would be generated here")
              setShowReportModal(false)
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <Head title="Sectoral Groups" />

      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sectoral Groups
              </h1>
              <p className="text-gray-500 mt-1">Distribution analysis of community sectors</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                <span>Back to Dashboard</span>
              </Link>
              <button
                onClick={exportToCSV}
                disabled={isLoading}
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                ) : (
                  <DownloadIcon />
                )}
                <span>Export CSV</span>
              </button>

              {/* Quick Actions Dropdown moved here */}
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    <MoreVerticalIcon />
                    <span>Quick Actions</span>
                  </button>
                </div>

                {showDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="py-1">
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleBulkEdit}
                      >
                        <EditIcon />
                        Bulk Edit Groups
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleSendNotification}
                      >
                        <BellIcon />
                        Send Group Notification
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={handleGenerateReport}
                      >
                        <FileTextIcon />
                        Generate Annual Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Largest Group</p>
                  <p className="text-2xl font-bold mt-1">{largestGroup.name || "None"}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <CrownIcon />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Groups</p>
                  <p className="text-2xl font-bold mt-1">{processedData.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <UsersIcon />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Avg. Members</p>
                  <p className="text-2xl font-bold mt-1">
                    {processedData.length > 0
                      ? Math.round(processedData.reduce((sum, group) => sum + group.count, 0) / processedData.length)
                      : 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <PieChartIcon />
                </div>
              </div>
            </div>
          </div>

          {/* Pie Chart Visualization */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Group Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    animationBegin={0}
                    animationDuration={1000}
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {processedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value, entry) => <span className="text-sm font-medium text-gray-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* External labels for small/zero percentage groups */}
            {renderExternalLabels()}
          </div>

          {/* Main Groups Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Distribution of Residents</h2>
                <div className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>{totalResidents} Total Residents</span>
                </div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {processedData.length > 0 ? (
                processedData.map((group, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-blue-50/30 transition-all duration-200"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(to right, rgba(249, 250, 251, 0.5), rgba(255, 255, 255, 0))"
                          : "",
                    }}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg shadow-md"
                        style={{
                          background: `linear-gradient(to bottom right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-white"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <div className="flex flex-col gap-2 py-1">
                        <div className="font-semibold text-base">{group.name}</div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                              {group.count}
                            </span>
                            <span className="text-sm text-gray-500">members</span>
                          </div>
                          <div className="flex items-center gap-3 flex-1 max-w-md">
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${group.calculatedPercentage}%`,
                                  background: `linear-gradient(to right, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`,
                                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            </div>
                            <div className="relative group">
                              <span className="text-sm font-semibold text-gray-700 w-12">
                                {group.calculatedPercentage}%
                              </span>
                              <div className="absolute z-10 invisible group-hover:visible bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                {group.count} out of {totalResidents} residents
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-gray-800"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/admin/sectoral/${group.field}/members`}
                      className="mt-4 md:mt-0 ml-0 md:ml-auto text-sm font-medium px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 w-full md:w-auto"
                    >
                      <span>View Members</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No sectoral groups found</h3>
                  <p className="mt-1 text-sm text-gray-500">No groups have been created yet</p>
                  <div className="mt-6">
                    <Link
                      href="/admin/sectoral/create"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Create New Group
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showBulkEditModal && <BulkEditModal />}
      {showNotificationModal && <NotificationModal />}
      {showReportModal && <ReportModal />}
    </AdminLayout>
  )
}

export default SectoralGroups
