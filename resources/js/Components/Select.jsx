"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"

export const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          // Pass the current value to the trigger as well as toggle onClick
          return React.cloneElement(child, { onClick: () => setIsOpen(!isOpen), value });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, { isOpen, setIsOpen, value, onValueChange });
        }
        return child;
      })}
    </div>
  )
}

export const SelectTrigger = ({ children, onClick, value }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  >
    {React.Children.map(children, (child) => {
      // When rendering the SelectValue inside the trigger, pass the value prop
      if (child.type === SelectValue) {
        return React.cloneElement(child, { value });
      }
      return child;
    })}
    <ChevronDown className="w-4 h-4 ml-2" />
  </button>
)

export const SelectContent = ({ children, isOpen, setIsOpen, value, onValueChange }) => {
  if (!isOpen) return null

  return (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
      <ul className="py-1">
        {React.Children.map(children, (child) => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, { onSelect: onValueChange, setIsOpen });
          }
          return child;
        })}
      </ul>
    </div>
  )
}

export const SelectItem = ({ children, value, onSelect, setIsOpen }) => (
  <li
    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-100"
    onClick={() => {
      onSelect(value);
      setIsOpen(false);
    }}
  >
    {children}
  </li>
)

// Updated SelectValue that displays the current value if present; otherwise, it shows the placeholder.
export const SelectValue = ({ placeholder, value }) => (
  <span>{value ? value : placeholder}</span>
)
