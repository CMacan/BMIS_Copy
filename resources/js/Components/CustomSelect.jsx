"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const CustomSelect = ({ id, value, onChange, options, required, label, error }) => {
  const [focused, setFocused] = useState(false)

  return (
    <div className="relative border-none">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`relative rounded-lg border border-none ${
          focused ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-300"
        } transition-all duration-200 bg-white`}
      >
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full py-2 pr-10 pl-3 text-gray-700 bg-transparent rounded-lg focus:ring-0 focus:outline-none border-gray-600"
          style={{
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundImage: "none",
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className={option.value === "" ? "text-gray-400" : ""}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default CustomSelect
