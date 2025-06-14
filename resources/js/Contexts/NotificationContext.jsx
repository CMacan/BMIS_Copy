"use client"

import { createContext, useContext, useEffect, useState } from "react"
import axios from "axios"

const NotificationContext = createContext()

export const NotificationProvider = ({ children, user }) => {
  const isAdmin = true //user?.role?.includes('admin');
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    const intervalId = setInterval(fetchNotifications, 30000)
    return () => clearInterval(intervalId)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/notifications")
      const notificationData = response.data || []

      const getNotificationIcon = (notification) => {
        // First check metadata for icon, then fallback to category
        const icon =
          notification.metadata?.icon ||
          notification.data?.icon ||
          notification.data?.type ||
          notification.notif_category ||
          "info"

        switch (icon) {
          case "User":
            return "User"
          case "AlertTriangle":
            return "AlertTriangle"
          case "Settings":
            return "Settings"
          case "document_request":
            return "FileText"
          case "document_approved":
            return "CheckCircle"
          case "document_declined":
          case "declined":
            return "XCircle"
          case "announcement":
            return "Bell"
          case "household_registration":
            return "Home"
          default:
            return "Info"
        }
      }

      const getNotificationColor = (notification) => {
        // Check metadata for color, then fallback to type
        return notification.metadata?.color || notification.data?.color || "text-gray-600"
      }

      // Update the processedNotifications mapping
      const processedNotifications = notificationData.map((notification) => ({
        ...notification,
        formattedTime: formatNotificationTime(notification.created_at),
        icon: getNotificationIcon(notification),
        color: getNotificationColor(notification),
        data: {
          title: notification.notif_title,
          message: notification.notif_message,
          type: notification.notif_category,
          link: notification.action_url,
          ...notification.metadata,
        },
      }))

      setNotifications(processedNotifications)
      setUnreadCount(processedNotifications.filter((n) => !n.read_at).length)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      // Don't set empty arrays on error, keep existing data
      if (error.response?.status !== 401) {
        // Only clear if it's not an auth error
        setNotifications([])
        setUnreadCount(0)
      }
    }
  }

  const formatNotificationTime = (timestamp) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(`/notifications/mark-as-read/${id}`)
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch("/notifications/mark-all-read")
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  // Remove a notification
  const removeNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      // Update unread count if the removed notification was unread
      const removedNotif = notifications.find((n) => n.id === id)
      if (removedNotif && !removedNotif.read_at) {
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to remove notification:", error)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isAdmin,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
