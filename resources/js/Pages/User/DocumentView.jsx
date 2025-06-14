import React from 'react'
import UserLayout from '@/Layouts/UserLayout'
import { Head, usePage } from '@inertiajs/react'

export default function DocumentView() {
  const { documentRequests } = usePage().props;

  return (
    <UserLayout>
      <Head title="Document Requests" />
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Document Requests</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentRequests && documentRequests.length > 0 ? (
                documentRequests.map((doc, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {doc.document_type}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {doc.status}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {new Date(doc.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-4 py-2 text-center text-sm text-gray-500">
                    No document requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}
