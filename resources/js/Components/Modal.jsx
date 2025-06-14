"use client"

import { Dialog, DialogPanel, Transition, TransitionChild } from "@headlessui/react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function Modal({ children, show = false, maxWidth = "2xl", closeable = true, onClose = () => {} }) {
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const close = () => {
    if (closeable) {
      onClose()
    }
  }

  const maxWidthClass = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  }[maxWidth]

  return (
    <Transition show={show} leave="duration-200">
      <Dialog
        as="div"
        id="modal"
        className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
        onClose={close}
      >
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-gray-500/75 dark:bg-gray-900/75" />
        </TransitionChild>

        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel
            className={`transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full dark:bg-gray-800 ${maxWidthClass} ${
              isMobile ? "max-h-screen overflow-y-auto" : "max-h-[90vh] overflow-y-auto"
            }`}
          >
            {closeable && (
              <button
                onClick={close}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            {children}
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}
