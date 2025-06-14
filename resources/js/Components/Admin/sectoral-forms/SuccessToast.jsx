"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

export default function SuccessToast({ message, onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-500 ease-out">
      <div className="flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-xl shadow-2xl max-w-md animate-slide-in-right">
        <CheckCircle className="h-6 w-6 mr-3 flex-shrink-0" />
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-auto text-white hover:text-emerald-100 transition-colors p-1">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

