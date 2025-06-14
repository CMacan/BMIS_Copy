"use client"

import UserLayout from "@/Layouts/UserLayout"
import { Head, usePage } from "@inertiajs/react"
import { Eye, FileEdit, Trash2, ClipboardList } from "lucide-react"
import { Link } from "@inertiajs/react"
import { useState } from "react"

const ApplicationRow = ({ id, formType, status, submissionDate }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm font-medium text-gray-900">{formType}</div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          status === "Approved"
            ? "bg-green-100 text-green-800"
            : status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
        }`}
      >
        {status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submissionDate}</td>
    {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <button className="text-indigo-600 hover:text-indigo-900 mr-4">
        <Eye className="w-5 h-5 inline" />
      </button>
      <button className="text-yellow-600 hover:text-yellow-900 mr-4">
        <FileEdit className="w-5 h-5 inline" />
      </button>
      <button className="text-red-600 hover:text-red-900">
        <Trash2 className="w-5 h-5 inline" />
      </button>
    </td> */}
  </tr>
)

export default function ApplicationList() {
  const { auth, applications = [] } = usePage().props; // Ensure applications has a default value

  console.log("Auth User:", auth.user); // Debugging: Check if user is being received
  console.log("Applications:", applications);

  return (
    <UserLayout>
      <Head title="Application List" />
      <div className="px-8 py-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Application List</h1>
            <p className="text-gray-600 mt-2">View and manage your submitted applications</p>
          </div>
          <Link
            href="/forms"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
          >
            <ClipboardList className="w-5 h-5 mr-2" />
            Back to Forms
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Form Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Submission Date
                  </th>
                  {/* <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <ApplicationRow key={application.id} {...application} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-lg">No submitted applications.</p>
          </div>
        )}
      </div>
    </UserLayout>
  )
}
