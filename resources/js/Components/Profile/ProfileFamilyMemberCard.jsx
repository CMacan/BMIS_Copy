import { User, ChevronRight, Edit2, Phone } from "lucide-react"

export default function ProfileFamilyMemberCard({ member, onEdit }) {
  return (
    <div className="group bg-white rounded-xl border p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{member.name}</h4>
            <p className="text-sm text-gray-500">{member.relationship}</p>
            {member.contact && (
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3" />
                {member.contact}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

