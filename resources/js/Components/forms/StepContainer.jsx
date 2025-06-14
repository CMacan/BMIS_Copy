export default function StepContainer({ icon, title, description, children }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">{icon}</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
        {children}
      </div>
    )
  }
  
  