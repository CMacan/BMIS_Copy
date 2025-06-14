import UserLayout from "@/Layouts/UserLayout"
import { useState, useRef } from "react";
import { Head, usePage } from "@inertiajs/react"
import { useNotifications } from "@/Contexts/NotificationContext";
import { FileText, Clock, Calendar, AlertCircle, Bell } from "lucide-react"


const QuickAction = ({ icon: Icon, label, href }) => (
  <a
    href={href}
    className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow hover:shadow-md transition-shadow flex flex-col items-center justify-center gap-4"
  >
    <div className="text-blue-600">
      <Icon className="w-6 h-6 md:w-8 md:h-8" />
    </div>
    <div className="text-center">
      <h3 className="text-gray-900 font-medium text-sm sm:text-base">{label}</h3>
    </div>
  </a>
)

const DocumentStatus = ({ icon: Icon, label, status, date }) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow flex items-start gap-3 sm:gap-4">
    <div className="text-blue-600 p-1 sm:p-2">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-gray-900 font-medium mb-1 text-sm sm:text-base truncate">{label}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{status}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-gray-500 text-xs sm:text-sm">{date}</p>
    </div>
  </div>
)

const Announcement = ({ icon: Icon, title, content, date }) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
    <div className="text-blue-600 p-1 sm:p-2">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
    </div>
    <h3 className="text-gray-900 font-medium mb-2 text-sm sm:text-base truncate">{title}</h3>
    <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-3">{content}</p>
    <p className="text-gray-500 text-xs sm:text-sm">{date}</p>
  </div>
)



export default function Dashboard() {
    const { auth, documentRequests, announcementRequests, } = usePage().props;
    const { notifications, unreadCount, markAsRead, removeNotification } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    console.log("Notifications Context:", notifications, unreadCount);
    const toggleNotif = () => setIsNotifOpen((prev) => !prev);


  const quickActions = [
    { icon: FileText, label: "Request Document", href: "/user_request" },
    { icon: Clock, label: "View Request Status", href: "/request-status" },
    // { icon: Calendar, label: "View Programs", href: "/programs" },
    { icon: AlertCircle, label: "Submit Complaint", href: "/complaint" },
  ]

    // Map only the latest 2 document requests
    const documentStatuses = documentRequests
        ? documentRequests.slice(0, 2).map((doc) => ({
            icon: FileText,
            label: doc.document_type,
            status: doc.status,
            date: new Date(doc.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        }))
        : [];

    // Map only the latest announcement
    const announceStatus = announcementRequests
        ? announcementRequests.slice(0, 1).map((announcement) => ({
            icon: Bell,
            title: announcement.title,
            content: announcement.content,
            date: new Date(announcement.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        }))
        : [];

    return (
        <UserLayout>
            <Head title="Dashboard" />
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8">
                    Welcome, {auth?.user?.profile?.prof_fname ?? "Guest"}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                    {quickActions.map((action, index) => (
                        <QuickAction key={index} {...action} />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Recent Document Requests
                      </h2>
                      <div className="relative">
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
                              {unreadCount > 0 && (
                                <button
                                  onClick={() => markAllAsRead()}
                                  className="text-xs text-blue-500 hover:underline"
                                >
                                  Mark all read
                                </button>
                              )}
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
                                    onClick={() => markAsRead(notif.id)}
                                    className={`flex items-start p-3 hover:bg-gray-50 transition cursor-pointer ${!notif.notif_date_read ? 'bg-blue-50' : ''}`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 mb-0.5">
                                        {notif.data?.notif_title || "Notification"}
                                      </p>
                                      <p className="text-sm text-gray-600 line-clamp-2">{notif.data?.notif_message}</p>
                                      <div className="flex justify-between items-center mt-1">
                                        {notif.data?.link && (
                                          <span className="text-xs text-blue-600">View details</span>
                                        )}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeNotification(notif.id);
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
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      {documentStatuses.length > 0 ? (
                        documentStatuses.map((doc, index) => (
                          <DocumentStatus key={index} {...doc} />
                        ))
                      ) : (
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow text-center text-gray-500">
                          No recent document requests
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      Latest Announcement
                    </h2>
                    <div className="space-y-3 sm:space-y-4">
                      {announceStatus.length > 0 ? (
                        announceStatus.map((announcement, index) => (
                          <Announcement key={index} {...announcement} />
                        ))
                      ) : (
                        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow text-center text-gray-500">
                          No announcements available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            </div>
        </UserLayout>
    );
}

