"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, CheckCircle, XCircle, FileText, Info, Home } from "lucide-react"
import { useNotifications } from "@/Contexts/NotificationContext"

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications()
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  const toggleNotif = () => setIsNotifOpen((prev) => !prev)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsNotifOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchend", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchend", handleClickOutside)
    }
  }, [])

  // Get the appropriate icon component based on the notification type
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "CheckCircle":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "XCircle":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "FileText":
        return <FileText className="w-5 h-5 text-yellow-500" />
      case "Home":
        return <Home className="w-5 h-5 text-purple-500" />
      case "Bell":
        return <Bell className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

  const handleNotificationClick = (notif) => {
    if (!notif.read_at) {
      markAsRead(notif.id)
    }
    // Handle navigation if there's a link
    if (notif.data?.link) {
      window.location.href = notif.data.link
    }
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        ref={buttonRef}
        onClick={toggleNotif}
        className="relative text-gray-600 hover:text-blue-600 transition p-2"
        aria-label="Notifications"
        aria-expanded={isNotifOpen}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isNotifOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-[90vw] sm:w-80 bg-white rounded-md shadow-lg z-50 max-h-[70vh] overflow-y-auto border border-gray-200"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-4 py-2 flex justify-between items-center">
            <h3 className="font-medium text-gray-700">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Mark all read
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p>No notifications.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex items-start p-3 hover:bg-gray-50 transition cursor-pointer ${!notif.read_at ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex-shrink-0 mr-3 mt-1">
                    {getIconComponent(notif.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900 mb-0.5">
                        {notif.data?.title || "Notification"}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {notif.formattedTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{notif.data?.message}</p>
                    <div className="flex justify-between items-center mt-1">
                      {notif.data?.link && (
                        <span className="text-xs text-blue-600">View details</span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notif.id)
                        }}
                        className="text-xs text-red-500 hover:underline ml-auto"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
