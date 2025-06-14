import { X } from "lucide-react"
import { useForm } from "@inertiajs/react"
import { useToast } from "@/Contexts/ToastContext"
import { usePage } from "@inertiajs/react"

export default function JoinHouseholdModal({ isOpen, onClose }) {
  const showToast = useToast()
  const { data, setData, post, processing, errors, reset } = useForm({
    house_id: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    post(route("household.join"), {
      onSuccess: () => {
        showToast("Join request sent successfully!", "success")
        reset()
        onClose()
      },
      onError: () => {
        showToast("Failed to send join request. Please check the household ID.", "error")
      },
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Join a Household</h2>
        <p className="text-gray-600 mb-6">
          Enter the household ID to send a join request. The household head will need to approve your request.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="house_id" className="block text-sm font-medium text-gray-700">
              Household ID
            </label>
            <input
              type="text"
              id="house_id"
              value={data.house_id}
              onChange={(e) => setData("house_id", e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter household ID"
            />
            {errors.house_id && <p className="mt-1 text-sm text-red-600">{errors.house_id}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {processing ? "Sending..." : "Send Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

