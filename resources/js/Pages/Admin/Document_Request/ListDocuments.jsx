import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Head, router, useForm } from "@inertiajs/react";
import { FileSpreadsheet, Search, Calendar, FileText } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import { format } from "date-fns";
import { Button } from "@/Components/ButtonUi";
import { Tabs, TabsList, TabsTrigger } from "@/Components/Tabs";
import Loader from "@/Components/Loader";
import Modal from "@/Components/ModalHandler";
import axios from "axios";
import { route } from 'ziggy-js';
import "react-toastify/dist/ReactToastify.css";

export default function DocumentRequests({ auth, documents = [], activeTab = 'pending'}) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [isReleaseModalOpen, setIsReleaseModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportingId, setExportingId] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [currentDocuments, setCurrentDocuments] = useState(documents);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [processingApprove, setProcessingApprove] = useState(false);
  const [processingDecline, setProcessingDecline] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);

  // New: For Release Modal
  const [releaseForm, setReleaseForm] = useState({
    receipt_number: "",
    amount_paid: ""
  });

  const [processingRelease, setProcessingRelease] = useState(false);

  const { data, setData, put } = useForm({
    status: '',
    decline_reason: '',
  });

  useEffect(() => {
    console.log("Form data updated:", data);
  }, [data]);

  const handleTabClick = (tab) => {
    setLoading(true);
    router.get(`/admin/document-requests`, { status: tab, search: searchQuery, start_date: startDate, end_date: endDate }, {
      preserveState: true,
      replace: true,
      onSuccess: (page) => {
        setCurrentDocuments(page.props.documents);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      }
    });
  };

  const handleExportToExcel = () => {
    window.location.href = '/admin/document-requests/export';
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setLoading(true);

    const queryParams = {
        status: activeTab,
        start_date: startDate,
        end_date: endDate,
    };

    // Only include search if not empty
    if (value.trim() !== "") {
        queryParams.search = value;
    }

    router.get(`/admin/document-requests`, queryParams, {
        preserveState: true,
        replace: true,
        onSuccess: (page) => {
        setCurrentDocuments(page.props.documents);
        setLoading(false);
        },
        onError: () => {
        setLoading(false);
        }
    });
    };

  const handleGenerateDocument = (request) => {
    setGeneratingId(request.id);

    // Open the document generation route in a new tab
    window.open(route('admin.document-requests.generate-docx', request.id), '_blank');

    // Update the UI after a short delay
    setTimeout(() => {
      setGeneratingId(null);
      // Refresh the current tab to show updated status
      handleTabClick(activeTab);
      toast.success("Document generated successfully.");
    }, 3000);
  };

  const handleExportPdf = (request) => {
    setExportingId(request.id);
    window.open(route('admin.document-requests.print', request.id), '_blank');
    router.put(
      route("admin.document-requests.updateStatus", request.id),
      { status: "completed" },
      {
        preserveState: true,
        onSuccess: () => {
          toast.success("PDF exported and request completed.");
          setExportingId(null);
          handleTabClick(activeTab);
        },
        onError: (errors) => {
          toast.error("Error updating status.");
          setExportingId(null);
        }
      }
    );
  };

  const handleDateFilter = () => {
    setLoading(true);
    router.get(`/admin/document-requests`, { status: activeTab, search: searchQuery, start_date: startDate, end_date: endDate }, {
      preserveState: true,
      replace: true,
      onSuccess: (page) => {
        setCurrentDocuments(page.props.documents);
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleStatusChange = (updatedRequest) => {
    setCurrentDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === updatedRequest.id ? updatedRequest : doc
      )
    );
  };

  const handleApprove = async (id) => {
    try {
        setProcessingApprove(true);

        const response = await axios.put(`/admin/document-requests/${id}/update-status`, {
            status: 'approved'
        });

        if (response.data.success) {
            toast.success('Document request approved successfully');
            // Close the modal before reloading
            setIsModalOpen(false);
            // Refresh the document list
            router.reload();
        } else {
            toast.error(response.data.message || 'Failed to approve document request');
        }
    } catch (error) {

        console.error('Error approving document request:', error);
        toast.error(`Error: ${error.response?.data?.message || error.message}`);

        // Log detailed error information
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request:', error.request);
        }
    } finally {
        setProcessingApprove(false);
    }
};

  const handleDecline = async () => {
    if (!data.decline_reason.trim()) {
      toast.error("Please provide a reason for declining.");
      console.log("Decline aborted, no reason provided for document id:", selectedRequest.id);
      return;
    }
    console.log("handleDecline called for document id:", selectedRequest.id);
    setProcessingDecline(true);
    try {
      const response = await axios.put(
        `/admin/document-requests/${selectedRequest.id}/update-status`,
        {
          status: "declined",
          decline_reason: data.decline_reason
        }
      );
      console.log("Decline onSuccess:", response.data);
      toast.success("Request declined successfully.");
      // Close both modals
      setIsDeclineModalOpen(false);
      setIsModalOpen(false);
      // Reload the page to reflect changes
      router.reload(); // reloads current page/UI
    } catch (error) {
      console.error("Decline onError:", error);
      toast.error("Error declining request.");
    } finally {
      setProcessingDecline(false);
    }
  };

  const handleCompleteTransaction = async () => {
  if (!releaseForm.receipt_number.trim() || !releaseForm.amount_paid.trim()) {
    toast.error("Please enter both receipt number and amount paid.");
    return;
  }
  setProcessingComplete(true);
  try {
    // Submit as completed
    const response = await axios.put(
      `/admin/document-requests/${selectedRequest.id}/update-status`,
      {
        status: "completed",
        receipt_number: releaseForm.receipt_number,
        amount_paid: releaseForm.amount_paid
      }
    );
    if (response.data.success) {
      toast.success("Transaction completed!");
      setIsReleaseModalOpen(false);
      setSelectedRequest(null);
      handleTabClick(activeTab);
    } else {
      toast.error(response.data.message || "Failed to complete transaction.");
    }
  } catch (error) {
    console.error("Error completing transaction:", error);
    toast.error(error.response?.data?.message || "Error completing transaction.");
  } finally {
    setProcessingComplete(false);
  }
};

  // New: Release Modal logic
  const handleRelease = (request) => {
    setSelectedRequest(request);
    setIsReleaseModalOpen(true);
    setReleaseForm({ receipt_number: "", amount_paid: "" });
  };

  const handleReleaseInputChange = (e) => {
    const { name, value } = e.target;
    setReleaseForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReleaseSubmit = async () => {
    if (!releaseForm.receipt_number.trim() || !releaseForm.amount_paid.trim()) {
      toast.error("Please enter both receipt number and amount paid.");
      return;
    }
    setProcessingRelease(true);
    try {
      // Submit release info and update status
      const response = await axios.put(
        `/admin/document-requests/${selectedRequest.id}/update-status`,
        {
          status: "released",
          receipt_number: releaseForm.receipt_number,
          amount_paid: releaseForm.amount_paid
        }
      );
      if (response.data.success) {
        toast.success("Document request released and details saved.");
        setIsReleaseModalOpen(false);
        setSelectedRequest(null);
        // Optionally reload/refresh the documents list
        handleTabClick(activeTab);
      } else {
        toast.error(response.data.message || "Failed to release document request.");
      }
    } catch (error) {
      console.error("Error releasing document request:", error);
      toast.error(error.response?.data?.message || "Error releasing request.");
    } finally {
      setProcessingRelease(false);
    }
  };

  return (
    <AdminLayout
      user={auth.user}
      className="relative z-10"
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Document Request
        </h2>
      }
    >
      <Head title="Document Requests" />
      <div className="p-2 space-y-6 overflow-hidden max-w-full">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileSpreadsheet className="w-5 h-5" />
            <h1 className="text-lg font-medium">List of Document Requests</h1>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            {/* Grouped: Search + Date Range */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition w-full"
                />
                </div>

                {/* Date Range */}
                <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded-md px-3 py-2"
                />
                <span>to</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded-md px-3 py-2"
                />
                <Button
                    className="!bg-[#95a9f7] hover:!bg-[#7c90f3] text-black px-5 py-2 text-lg drop-shadow-md"
                    onClick={handleDateFilter}
                >
                    Filter
                </Button>
                </div>
            </div>

            {/* Export Button aligned to the right */}
            <Button
                className="flex items-center gap-2 px-4 py-2.5 !bg-emerald-600 text-white rounded-lg text-sm font-medium hover:!bg-emerald-700 transition-colors drop-shadow-md"
                onClick={handleExportToExcel}
            >
                Export to Excel
            </Button>
            </div>
          <Tabs defaultValue={activeTab}>
            <TabsList className="flex w-full bg-[#C6D1FF] p-0 border border-[#BCADAD] divide-x divide-[#BCADAD]">
              <TabsTrigger value="pending" className="flex-1" onClick={() => handleTabClick('pending')}>
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex-1" onClick={() => handleTabClick('approved')}>
                Approved
              </TabsTrigger>
              <TabsTrigger value="declined" className="flex-1" onClick={() => handleTabClick('declined')}>
                Declined
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1" onClick={() => handleTabClick('completed')}>
                Completed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {loading ? (
            <Loader />
          ) : (
            <div className="border rounded-lg overflow-x-auto mt-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Request
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    {activeTab !== 'completed' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentDocuments.length > 0 ? (
                    currentDocuments.map((request, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.document_type || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.purpose || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.created_at ? format(new Date(request.created_at), "MM/dd/yyyy") : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {request.copies || "N/A"}
                        </td>
                        {activeTab !== 'completed' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {activeTab === 'approved' ? (
                              <div className="flex items-center gap-1 flex-wrap">
                                <button
                                  className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md shadow-md w-24"
                                  onClick={() => handleGenerateDocument(request)}
                                  disabled={generatingId === request.id}
                                >
                                  {generatingId === request.id ? "Generating..." : "Generate"}
                                </button>
                                <button
                                  className="bg-amber-600 hover:bg-amber-700 text-white px-2 py-1 rounded-md shadow-md w-24"
                                  onClick={() => handleRelease(request)}
                                >
                                  Release
                                </button>
                              </div>
                            ) : activeTab === 'declined' ? (
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsModalOpen(true);
                                }}
                              >
                                View
                              </button>
                            ) : (
                              <button
                                className="bg-violet-500 hover:bg-violet-600 text-white px-3 py-1 rounded-md mr-2"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsModalOpen(true);
                                }}
                              >
                                Review
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={activeTab !== 'completed' ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No document requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedRequest && activeTab !== 'declined' && (
        // Review Modal
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative z-60 bg-white rounded-lg shadow-lg p-6">
            <Modal show={true} onClose={handleCloseModal}>
              <div className="space-y-4 p-4 relative z-1055 bg-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Review Document Request</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={selectedRequest.name}
                    className="w-full rounded-md border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    type="text"
                    value={selectedRequest.address}
                    className="w-full rounded-md border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Block</label>
                    <input
                      type="text"
                      value={selectedRequest.block}
                      className="w-full rounded-md border-gray-300 bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <input
                      type="text"
                      value={selectedRequest.age}
                      className="w-full rounded-md border-gray-300 bg-gray-50"
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Purpose</label>
                  <textarea
                    value={selectedRequest.purpose}
                    className="w-full rounded-md border-gray-300 bg-gray-50"
                    readOnly
                  />
                </div>{selectedRequest.document_type === 'Business Clearance' && selectedRequest.assessment_form && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Uploaded Assessment Form</label>
                    <img
                      src={selectedRequest.assessment_form}
                      alt="Uploaded Assessment Form"
                      className="w-full max-w-md border rounded shadow"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    className="!bg-[#22c55e] !text-white hover:!bg-[#16a34a] px-5 py-2 text-lg drop-shadow-md"
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={processingApprove}
                  >
                    {processingApprove ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => setIsDeclineModalOpen(true)}
                    disabled={processingDecline}
                  >
                    Decline
                  </Button>
                  <Button
                    type="button"
                    className="!bg-gray-500 hover:!bg-gray-600 !text-white"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}

      {isModalOpen && selectedRequest && activeTab === 'declined' && (
        // View Modal for Declined Requests
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative z-60 bg-white rounded-lg shadow-lg p-6">
            <Modal show={true} onClose={handleCloseModal}>
                <div className="space-y-4 p-4 relative z-1055 bg-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">View Document Request</h2>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                    type="text"
                    value={selectedRequest.name}
                    className="w-full rounded-md border-gray-300 bg-gray-50"
                    readOnly
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <input
                    type="text"
                    value={selectedRequest.address}
                    className="w-full rounded-md border-gray-300 bg-gray-50"
                    readOnly
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Block</label>
                    <input
                        type="text"
                        value={selectedRequest.block}
                        className="w-full rounded-md border-gray-300 bg-gray-50"
                        readOnly
                    />
                    </div>
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Age</label>
                    <input
                        type="text"
                        value={selectedRequest.age}
                        className="w-full rounded-md border-gray-300 bg-gray-50"
                        readOnly
                    />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Purpose</label>
                    <textarea
                    value={selectedRequest.purpose}
                    className="w-full rounded-md border-gray-300 bg-gray-50"
                    readOnly
                    />
                </div>

                {selectedRequest.document_type === 'Business Clearance' && selectedRequest.assessment_form && (
                    <div className="space-y-2">
                    <label className="text-sm font-medium">Uploaded Assessment Form</label>
                    <img
                        src={selectedRequest.assessment_form}
                        alt="Uploaded Assessment Form"
                        className="w-full max-w-md border rounded shadow"
                    />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-red-600">Reason for Declining</label>
                    <textarea
                    value={selectedRequest.decline_reason || "No reason provided."}
                    className="w-full rounded-md border border-red-300 bg-red-50"
                    readOnly
                    />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                    type="button"
                    className="!bg-gray-500 hover:!bg-gray-600 !text-white"
                    onClick={handleCloseModal}
                    >
                    Close
                    </Button>
                </div>
                </div>
            </Modal>
            </div>
        </div>
        )}


      {isDeclineModalOpen && (
        // Decline Reason Modal
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative z-60 bg-white rounded-lg shadow-lg p-6">
            <Modal show={true} onClose={() => setIsDeclineModalOpen(false)}>
              <div className="space-y-4 p-4 relative z-1055 bg-white rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Reason for Declining</h2>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason</label>
                  <textarea
                    value={data.decline_reason}
                    onChange={(e) => setData('decline_reason', e.target.value)}
                    className="w-full rounded-md border-gray-300 bg-gray-50"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleDecline}
                    disabled={processingDecline}
                  >
                    {processingDecline ? "Processing..." : "Confirm Decline"}
                  </Button>
                  <Button
                    type="button"
                    className="!bg-gray-500 hover:!bg-gray-600 !text-white"
                    onClick={() => setIsDeclineModalOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}

      {isReleaseModalOpen && selectedRequest && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative z-60 bg-white rounded-lg shadow-lg p-6">
          <Modal show={true} onClose={() => setIsReleaseModalOpen(false)}>
            <div className="space-y-4 p-4 relative z-1055 bg-white rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">Release Document</h2>
              <div className="space-y-2">
                <label className="text-sm font-medium">Receipt Number</label>
                <input
                  type="text"
                  name="receipt_number"
                  value={releaseForm.receipt_number}
                  onChange={handleReleaseInputChange}
                  className="w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount Paid</label>
                <input
                  type="number"
                  name="amount_paid"
                  value={releaseForm.amount_paid}
                  onChange={handleReleaseInputChange}
                  className="w-full rounded-md border-gray-300 bg-gray-50"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={handleReleaseSubmit}
                  disabled={processingRelease}
                >
                  {processingRelease ? "Processing..." : "Release"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="!bg-green-600 hover:!bg-green-700 text-white"
                  onClick={handleCompleteTransaction}
                  disabled={processingComplete}
                >
                  {processingComplete ? "Processing..." : "Complete Transaction"}
                </Button>
                <Button
                  type="button"
                  className="!bg-gray-500 hover:!bg-gray-600 !text-white"
                  onClick={() => setIsReleaseModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    )}
      <ToastContainer position="top-center"/>
    </AdminLayout>
  );
}
