import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import { FileSpreadsheet, Search, Plus } from "lucide-react";
import { useToast } from '@/Contexts/ToastContext';
import AdminLayout from "@/Layouts/AdminLayout";
import CreateAnnouncement from "./CreateAnnouncement";

export default function Index({ auth, announcements, announcementsCount }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const showToast = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = (announcementId) => {
    setIsProcessing(true);
    if (confirm("Are you sure you want to delete this announcement?")) {
      router.delete(`/admin/announcements/${announcementId}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          showToast('Announcement deleted successfully!', 'success');
          setIsProcessing(false);
        },
        onError: (error) => {
          setIsProcessing(false);
          showToast('Error deleting announcement!', 'error');
        },
      });
    }
  };

  const handleToggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  const handleExportToExcel = () => {
    if (confirm("Are you sure you want to export the announcements data to Excel?")) {
      // Optionally, show a toast or disable UI while processing export
      // This route should be implemented in your backend using an Excel export package (e.g., Laravel Excel)
      window.location.href = route('announcements.export');
    }
  };

  return (
    <AdminLayout
      user={auth.user}
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Manage Announcements
        </h2>
      }
    >
      <Head title="List of Announcements" />
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            {showCreateForm ? (
              <h1 className="text-lg font-medium">Create Announcement</h1>
            ) : (
              <h1 className="text-lg font-medium">List of Announcements</h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleCreateForm}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showCreateForm ? "Back to List" : "Add New Announcement"}
            </button>
            <button
              onClick={handleExportToExcel}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm flex items-center"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export to Excel
            </button>
          </div>
        </div>

        {showCreateForm ? (
          // Render the create announcement form inside the layout
          <CreateAnnouncement />
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-6 justify-between">
              <div className="flex items-center gap-2">
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(e.target.value)}
                  className="w-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-500">Entries per page</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">Date Range</span>
                <input
                  type="date"
                  className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <span>-</span>
                <input
                  type="date"
                  className="w-40 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <button className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-md text-sm">
                Filter by Status
              </button>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="search"
                  placeholder="Search"
                  className="w-full pl-10 rounded-md border border-gray-300 px-3 py-2 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {announcements.data.map((announcement, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {announcement.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md mr-2"
                          onClick={() => handleEdit(announcement.id)}
                        >
                          Edit
                        </button>
                        <button
                          disabled={isProcessing}
                          className={`px-3 py-1 rounded-md text-white ${
                            isProcessing ? 'bg-red-400' : 'bg-red-500 hover:bg-red-600'
                          }`}
                          onClick={() => handleDelete(announcement.id)}
                        >
                          {isProcessing ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <div>Showing 1 out of {announcementsCount} entries</div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded-md text-gray-600 bg-white"
                  disabled
                >
                  Previous
                </button>
                <button className="px-3 py-1 border rounded-md text-white bg-blue-500 hover:bg-blue-600">
                  1
                </button>
                <button className="px-3 py-1 border rounded-md text-gray-600 bg-white hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

