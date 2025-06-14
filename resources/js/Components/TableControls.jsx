import React from "react";
import { FileSpreadsheet, Filter } from 'lucide-react';

export default function TableControls({ 
  entriesPerPage, 
  setEntriesPerPage, 
  dateRange, 
  setDateRange, 
  searchQuery, 
  setSearchQuery 
}) {
  return (
    <div className="p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <select
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-600">Entries per page</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            Import from Excel
        </button>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors">
          <FileSpreadsheet className="w-4 h-4" />
          Export to Excel
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Date Range</span>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>-</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors">
          <Filter className="w-4 h-4" />
          Filter by Status
        </button>

        <div className="relative">
          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <svg className="w-4 h-4 absolute left-3 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}