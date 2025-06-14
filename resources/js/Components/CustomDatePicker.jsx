"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"

const CustomDatePicker = ({ id, value, onChange, max, required, label, error }) => {
  const [focused, setFocused] = useState(false)

  return (
    <div className="relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`relative flex items-center overflow-hidden rounded-lg border ${
          focused ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300"
        } transition-all duration-200 bg-white`}
      >
        <input
          type="date"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          max={max}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-2 px-3 text-gray-700 bg-transparent outline-none appearance-none"
          style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }} // Custom styles
        />
        <div className="absolute right-2 pointer-events-none">
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default CustomDatePicker

