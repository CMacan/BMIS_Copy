export default function ProfileQuickInfoCard({ icon: Icon, label, value }) {
    return (
      <div className="bg-white rounded-xl border p-4 hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    )
  }
  
  