export default function ReadOnlyField({ label, value, icon }) {
    return (
      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
        <div className="mt-0.5">{icon}</div>
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-sm font-medium">{value || "Not provided"}</p>
        </div>
      </div>
    )
  }
  
  