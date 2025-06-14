import React from "react";
import { Link } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  FileSignature,
  BadgeIcon as Certificate,
  UserCog,
  MessageSquare,
  ClipboardList,
  Clock,
  Building2,
  LogOut,
  ChevronRight,
} from "lucide-react";

export function Sidebar({ isCollapsed }) {
  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-80"} bg-[#0f172a] text-white h-full shadow-lg transition-all duration-300 ease-in-out`}
    >
      <div
        className={`p-5 border-b border-gray-700 flex items-center ${isCollapsed ? "justify-center" : "gap-4"} whitespace-nowrap`}
      >
        {!isCollapsed ? (
          <>
            <img src="/images/officialseal.png" alt="Barangay Logo" className="h-22 w-32" />
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-white">Sawang Calero</h2>
              <p className="text-lg text-gray-400">Information</p>
              <p className="text-lg text-gray-400">Management</p>
            </div>
          </>
        ) : (
          <img src="/images/officialseal.png" alt="Barangay Logo" className="h-12 w-12" />
        )}
      </div>
      <nav className="mt-5 space-y-2">
        <SidebarSection title="GENERAL" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/dashboard" icon={LayoutDashboard} isCollapsed={isCollapsed}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/admin/barangay-officials" icon={Users} hasSubmenu isCollapsed={isCollapsed}>
            Barangay Officials
          </SidebarLink>
          <SidebarLink href="/admin/residents" icon={UserCircle} hasSubmenu isCollapsed={isCollapsed}>
            Residents
          </SidebarLink>
          <SidebarLink href="/admin/forms" icon={FileText} hasSubmenu isCollapsed={isCollapsed}>
            Forms
          </SidebarLink>
          <SidebarLink href="/admin/document-requests" icon={FileSignature} hasSubmenu isCollapsed={isCollapsed}>
            Document Requests
          </SidebarLink>
          <SidebarLink href="/admin/barangay-certificates" icon={Certificate} hasSubmenu isCollapsed={isCollapsed}>
            Barangay Certificates
          </SidebarLink>
          <SidebarLink href="/admin/all-accounts" icon={UserCog} hasSubmenu isCollapsed={isCollapsed}>
            All Accounts
          </SidebarLink>
          <SidebarLink href={route('announcements.index')} icon={MessageSquare} isCollapsed={isCollapsed}>
            Announcement
          </SidebarLink>
        </SidebarSection>
        <SidebarSection title="REPORT" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/reports" icon={ClipboardList} isCollapsed={isCollapsed}>
            Reports
          </SidebarLink>
          <SidebarLink href="/admin/activity-logs" icon={Clock} isCollapsed={isCollapsed}>
            Activity Logs
          </SidebarLink>
        </SidebarSection>
        <SidebarSection title="COMPLAINT" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/complaints" icon={ClipboardList} isCollapsed={isCollapsed}>
            Complaints
          </SidebarLink>
          <SidebarLink href="/admin/resolved-complaints" icon={Clock} isCollapsed={isCollapsed}>
            Resolved Complaints
          </SidebarLink>
        </SidebarSection>
        <SidebarSection title="SETTINGS" isCollapsed={isCollapsed}>
          <SidebarLink href="/admin/barangaydetails" icon={Building2} isCollapsed={isCollapsed}>
            Barangay Details
          </SidebarLink>
          <SidebarLink href={route('logout')} icon={LogOut} isCollapsed={isCollapsed}>
            LOG OUT
          </SidebarLink>
        </SidebarSection>
      </nav>
    </aside>
  );
}

function SidebarSection({ title, children, isCollapsed }) {
  if (isCollapsed) {
    return <div className="py-4">{children}</div>;
  }

  return (
    <div className="mb-5">
      <h3 className="px-7 mb-3 text-xs font-semibold pl-10 text-gray-400 uppercase">{title}</h3>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

function SidebarLink({ href, icon: Icon, children, hasSubmenu, isCollapsed }) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center ${
          isCollapsed ? "justify-center px-3" : "px-6 pl-10"
        } py-3 text-sm transition-colors hover:bg-gray-700 hover:text-white rounded-lg group relative`}
      >
        <Icon className="w-5 h-5 text-gray-300" />
        {!isCollapsed && (
          <>
            <span className="flex-1 ml-4">{children}</span>
            {hasSubmenu && <ChevronRight className="w-4 h-4 ml-auto text-gray-400" />}
          </>
        )}
        {isCollapsed && (
          <span className="absolute left-full ml-2 p-2 bg-gray-800 text-white rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
            {children}
          </span>
        )}
      </Link>
    </li>
  );
}

