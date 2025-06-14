"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, CheckCircle, Info } from "lucide-react"

export default function FormCard({
   id,
  image,
  title,
  description,
  category,
  details,
  eligibility,
  statusBadge,
  buttonText,
  buttonClassName,
  disabled,
  onClick,
  isExpanded,
  onToggleExpand,
}) {
  const getStatusConfig = () => {
    if (buttonText === "Pending") {
      return {
        badge: "bg-amber-50 text-amber-700 border border-amber-200",
        button: "bg-amber-500 hover:bg-amber-600 text-white cursor-not-allowed opacity-80",
      }
    }
    if (buttonText === "Not Verified") {
      return {
        badge: "bg-slate-50 text-slate-600 border border-slate-200",
        button: "bg-slate-400 hover:bg-slate-500 text-white cursor-not-allowed opacity-80",
      }
    }
    return {
      badge: "bg-indigo-50 text-indigo-700 border border-indigo-200",
      button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
    }
  }

  const statusConfig = getStatusConfig()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-xl transition-all duration-300 min-h-[360px] ${
        isExpanded 
          ? "z-20 shadow-xl border border-slate-200" 
          : "hover:shadow-lg shadow-md border border-slate-100 hover:-translate-y-1"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isExpanded 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header with gradient */}
      <div className="h-24 bg-white rounded-t-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="p-6 flex justify-between items-center h-full relative z-10">
          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-lg overflow-hidden shadow-lg">
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          </div>
          <span
  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow-sm ${
    statusBadge === "Pending"
      ? "text-amber-700"
      : statusBadge === "Not Verified"
        ? "text-slate-600"
        : statusBadge === "Approved"
          ? "text-green-600"
          : "text-indigo-700"
  }`}
>
  {statusBadge}
</span>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6 flex flex-col h-[calc(360px-6rem)]">
        <div className="mb-5 flex-grow">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium shadow-xs">
              {category}
            </span>
          </div>
          <p className="text-slate-600 text-sm line-clamp-4 mb-4">{description}</p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 mt-auto">
          <motion.button
            whileHover={{ scale: disabled ? 1 : 1.03 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm ${statusConfig.button}`}
            disabled={disabled}
          >
            {buttonText}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onToggleExpand}
            className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 py-2"
          >
            <span className="text-sm font-medium">View Requirements</span>
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }} 
              transition={{ duration: 0.3 }} 
              className="w-5 h-5"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div
          className="absolute left-0 right-0 bg-white z-10 px-5 shadow-xl rounded-b-xl border-t border-slate-100"
          style={{ 
            top: "100%",
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="space-y-4 my-5">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 shadow-xs">
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-indigo-500" />
                Eligibility Requirements
              </h4>
              <ul className="space-y-2">
                {eligibility.map((req, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-600">
                    <span className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 shadow-xs">
              <h4 className="font-semibold text-sm text-slate-900 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2 text-indigo-500" />
                Additional Details
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">{details}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}