"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FormSelect({
  name,
  label,
  options,
  value,
  onChange,
  required = false,
  error,
  icon = null,
  helperText,
}) {
  const [focused, setFocused] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Normalize options to handle both string arrays and object arrays
  const normalizedOptions = options.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option }
    }
    return option
  })

  return (
    <div className="relative group">
      <div className="flex justify-between items-baseline mb-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-200"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helperText && <span className="text-xs text-gray-500">{helperText}</span>}
      </div>

      <div className="relative">
        {icon && (
          <div
            className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${focused ? "text-indigo-500" : "text-gray-400"}`}
          >
            {icon}
          </div>
        )}

        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => {
            onChange(e)
            setIsOpen(false)
          }}
          onFocus={() => {
            setFocused(true)
            setIsOpen(true)
          }}
          onBlur={() => {
            setFocused(false)
            setIsOpen(false)
          }}
          className={`w-full px-4 py-3 rounded-xl border appearance-none ${
            error
              ? "border-red-300 bg-red-50"
              : focused
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 ${
            icon ? "pl-10" : ""
          } pr-10 text-gray-700`}
          required={required}
        >
          <option value="">Select {label}</option>
          {normalizedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          className={`absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 transition-all duration-300 ${isOpen ? "rotate-180 text-indigo-600" : ""}`}
        >
          <ChevronDown className="h-4 w-4" />
        </div>

        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${focused ? "w-full" : "w-0"}`}
        ></div>
      </div>

      {error && (
        <div className="absolute -bottom-5 left-0 text-red-500 text-xs mt-1 flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}