export default function ProfileTabButton({ active, icon: Icon, label, onClick, count }) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all transform hover:scale-105 ${
          active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
        {count && (
          <span
            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
              active ? "bg-white text-blue-600" : "bg-gray-200 text-gray-600"
            }`}
          >
            {count}
          </span>
        )}
      </button>
    )
  }
  
  