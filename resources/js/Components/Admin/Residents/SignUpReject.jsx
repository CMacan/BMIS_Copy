import React, { useState } from "react";
import { X } from "lucide-react";

export default function SignUpReject({
  requestId,
  setShowRejectionModal,
  showToast,
  setIsLoading,
}) {
  const [rejectionMessage, setRejectionMessage] = useState("");

  const handleReject = async () => {
    if (!rejectionMessage.trim()) {
      showToast("Please provide a rejection message.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/admin/sign-up-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rejection_message: rejectionMessage }),
      });

      if (response.ok) {
        showToast("Sign-up request rejected successfully.", "success");
        setShowRejectionModal(false);
        window.location.reload(); // Reload the page to update the list
      } else {
        const error = await response.json();
        showToast(error.message || "Failed to reject the request.", "error");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      showToast("An error occurred while rejecting the request.", "error");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Rejection Modal */}
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Sign-Up Request</h3>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 mb-4"
            rows="4"
            placeholder="Enter rejection message..."
            value={rejectionMessage}
            onChange={(e) => setRejectionMessage(e.target.value)}
          ></textarea>
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              onClick={() => setShowRejectionModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={handleReject}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
}