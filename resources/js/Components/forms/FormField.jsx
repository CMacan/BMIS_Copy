"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function FormField({
  name,
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  error,
  icon = null,
  helperText,
}) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // For password fields
  const actualType = type === "password" && showPassword ? "text" : type

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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

        <input
          type={actualType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={`w-full px-4 py-3 rounded-xl border ${
            error
              ? "border-red-300 bg-red-50"
              : focused
                ? "border-indigo-400 ring-2 ring-indigo-100"
                : "border-gray-200"
          } focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 ${
            icon ? "pl-10" : ""
          } ${type === "password" ? "pr-10" : ""}`}
          required={required}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}

        {/* Animated underline effect on focus */}
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

