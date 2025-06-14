import { User, Calendar, Info, MapPin, Briefcase, Heart, GraduationCap, Phone } from "lucide-react"
import ReadOnlyField from "./ReadOnlyField"
import StepContainer from "./StepContainer"

export default function PersonalInformationStep({ data, formType }) {
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const showEmergencyContacts = ["CHILDREN INTAKE FORM", "WOMENS INTAKE FORM", "LGBT FORM INTAKE FORM"].includes(
    formType,
  )

  const showReligion = ["SOLO PARENT INTAKE FORM"].includes(formType)

  return (
    <StepContainer
      icon={<User className="w-5 h-5 text-indigo-600" />}
      title="Personal Information"
      description="Your basic personal details"
    >
      <div className="mb-8 text-sm text-gray-700 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400 border border-blue-100 flex items-start">
        <Info className="w-5 h-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-medium text-blue-700">Information Source:</span> The data displayed below is
          synchronized with your profile information. For any updates or corrections, please navigate to your profile
          settings.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <ReadOnlyField
            label="Full Name"
            value={`${data.firstName} ${data.middleName} ${data.lastName}`}
            icon={<User className="w-4 h-4 text-indigo-500" />}
          />
          <ReadOnlyField
            label="Birth Date"
            value={formatDate(data.birthDate)}
            icon={<Calendar className="w-4 h-4 text-indigo-500" />}
          />
          <ReadOnlyField label="Age" value={data.age} icon={<Info className="w-4 h-4 text-indigo-500" />} />
          <ReadOnlyField label="Sex" value={data.sex} icon={<User className="w-4 h-4 text-indigo-500" />} />
          {showEmergencyContacts && (
            <ReadOnlyField
              label="Emergency Contact Name"
              value={`${data.emerg_fname || ""} ${data.emerg_lname || ""}`.trim() || "Not specified"}
              icon={<GraduationCap className="w-4 h-4 text-indigo-500" />}
            />
          )}
          {showReligion && (
            <ReadOnlyField
              label="Religion"
              value={data.prof_religion || "Not specified"}
              icon={<GraduationCap className="w-4 h-4 text-indigo-500" />}
            />
          )}
        </div>
        <div className="space-y-4">
          <ReadOnlyField
            label="Address"
            value={`${data.block || ""} ${data.sitio || ""}, ${data.barangay || ""}, ${data.city || ""}, ${data.province || ""}`}
            icon={<MapPin className="w-4 h-4 text-indigo-500" />}
          />
          <ReadOnlyField
            label="Occupation"
            value={data.occupation}
            icon={<Briefcase className="w-4 h-4 text-indigo-500" />}
          />
          <ReadOnlyField
            label="Civil Status"
            value={data.civilStatus}
            icon={<Heart className="w-4 h-4 text-indigo-500" />}
          />
          <ReadOnlyField
            label="Education"
            value={data.education}
            icon={<GraduationCap className="w-4 h-4 text-indigo-500" />}
          />
          <ReadOnlyField
            label="Contact Number"
            value={data.contact}
            icon={<Phone className="w-4 h-4 text-indigo-500" />}
          />
          {showEmergencyContacts && (
            <ReadOnlyField
              label="Emergency Contact Number"
              value={data.emerg_contact || "Not specified"}
              icon={<Phone className="w-4 h-4 text-indigo-500" />}
            />
          )}
        </div>
      </div>
    </StepContainer>
  )
}
