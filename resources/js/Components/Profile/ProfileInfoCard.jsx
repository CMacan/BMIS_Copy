export default function ProfileInfoCard({ title, subtitle, icon: Icon, children, actions }) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 transition-all hover:shadow-md">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Icon className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        {children}
      </div>
    )
  }
  
  