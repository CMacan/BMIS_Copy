"use client"

import { useEffect, useState } from "react"
import { Transition } from "@headlessui/react"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

export default function Toast({ message, type = "success", onClose }) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (message) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        if (onClose) onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [message, onClose])

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          background: "bg-gradient-to-r from-emerald-500 to-teal-500",
          iconClass: "text-emerald-100",
          ringColor: "ring-green-500/30",
        }
      case "error":
        return {
          icon: XCircle,
          background: "bg-gradient-to-r from-red-500 to-rose-600",
          iconClass: "text-rose-100",
          ringColor: "ring-red-500/30",
        }
      case "info":
        return {
          icon: Info,
          background: "bg-gradient-to-r from-blue-500 to-indigo-600",
          iconClass: "text-blue-100",
          ringColor: "ring-blue-500/30",
        }
      case "warning":
        return {
          icon: AlertCircle,
          background: "bg-gradient-to-r from-amber-500 to-orange-600",
          iconClass: "text-orange-100",
          ringColor: "ring-amber-500/30",
        }
      default:
        return {
          icon: Info,
          background: "bg-gradient-to-r from-gray-500 to-slate-600",
          iconClass: "text-gray-100",
          ringColor: "ring-gray-500/30",
        }
    }
  }

  const config = getToastConfig()
  const Icon = config.icon

  const handleClose = () => {
    setShow(false)
    if (onClose) onClose()
  }

  return (
    <Transition
      show={show}
      enter="transition-all ease-out duration-300"
      enterFrom="opacity-0 translate-y-2 scale-95"
      enterTo="opacity-100 translate-y-0 scale-100"
      leave="transition-all ease-in duration-300"
      leaveFrom="opacity-100 translate-y-0 scale-100"
      leaveTo="opacity-0 translate-y-2 scale-95"
    >
      <div
        className={`
          flex items-center gap-3 p-4 rounded-xl
          ${config.background}
          shadow-lg shadow-black/5 ring-1 ring-inset ${config.ringColor}
          backdrop-blur-sm
          min-w-[300px] max-w-[500px]
        `}
      >
        <Icon className={`w-5 h-5 ${config.iconClass} flex-shrink-0`} />

        <p className="text-sm font-medium text-white flex-grow">{message}</p>

        <button onClick={handleClose} className="ml-4 p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
          <X className="w-4 h-4 text-white/80" />
        </button>
      </div>
    </Transition>
  )
}

