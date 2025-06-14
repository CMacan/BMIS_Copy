"use client"

import { createContext, useContext, useState, useCallback } from "react"
import Toast from "@/Components/Toast"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;    setToasts((currentToasts) => [...currentToasts, { id, message, type }])

    // Remove toast after it's done
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }, 3000) // Match this with the duration prop in Toast component
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className="fixed bottom-4 right-4 flex flex-col gap-2"
        style={{ zIndex: 99999 }} // <-- Ensure toast is always on top
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => {
              setToasts((currentToasts) => currentToasts.filter((t) => t.id !== toast.id))
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
