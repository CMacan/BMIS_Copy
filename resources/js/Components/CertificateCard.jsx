import { Link } from "@inertiajs/react"

export default function CertificateCard({ title, onProceed }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="flex items-start space-x-4">
          <div className="rounded-lg bg-blue-100 p-2">
            <svg
              className="h-6 w-6 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">
            View the requirements needed for barangay certificate and acquire online now
          </p>
        </div>
      </div>
      <div className="px-6 pb-6">
        <button
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B3990] hover:bg-[#232d73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990]"
          onClick={onProceed} // Call the onProceed function when clicked
        >
          Proceed
        </button>
      </div>
    </div>
  )
}

