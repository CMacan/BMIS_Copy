import { useState } from "react"
import { Head, router } from "@inertiajs/react"
import { FileSpreadsheet, Search} from "lucide-react"
import UserLayout from "@/Layouts/UserLayout"

export default function DocumentHistory({ history }) {
    return (
        <UserLayout>
            <Head title="Document Request History" />
            <div className="p-6 space-y-6">
                <h1 className="text-xl font-semibold">Document Request History</h1>

                <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed By</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {history.length > 0 ? (
                                history.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{request.documentType?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{request.status}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{request.staff?.name ?? "Pending"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{new Date(request.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
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