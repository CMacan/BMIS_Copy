"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, ChevronDown, X } from "lucide-react"

export default function SearchFilter({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  categories,
  resetFilters,
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const filterRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="p-6 border-b border-indigo-100 bg-gray-50">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search forms by name or description..."
            className="block w-full pl-12 pr-4 py-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm text-indigo-900 placeholder-indigo-300"
          />
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center justify-between w-full md:w-56 px-4 py-3 bg-white border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2 text-black-500" />
              <span className="font-medium truncate">{filterCategory || "Filter by category"}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-indigo-500" />
          </button>

          {showFilterDropdown && (
            <div className="absolute z-10 mt-2 w-full bg-white border border-indigo-100 rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
              <div
                className="px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-50 cursor-pointer font-medium"
                onClick={() => {
                  setFilterCategory("")
                  setShowFilterDropdown(false)
                }}
              >
                All Categories
              </div>
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-50 cursor-pointer"
                  onClick={() => {
                    setFilterCategory(category)
                    setShowFilterDropdown(false)
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>

        {(searchTerm || filterCategory) && (
          <button
            onClick={resetFilters}
            className="px-4 py-3 border border-indigo-200 rounded-lg text-indigo-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm flex items-center justify-center"
          >
            <X className="h-4 w-4 mr-2" />
            <span className="font-medium">Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  )
}

