"use client"

import { useState } from "react"
import {
  User,
  FileText,
  Calendar,
  MapPin,
  FileSignature,
  Mail,
  Phone,
  Home,
  Info,
  Check,
  X,
  Clock,
  File,
  Maximize2,
  ArrowLeft,
  AlertCircle,
  Badge,
  Building,
  GraduationCap,
  Briefcase,
} from "lucide-react"

export default function SubmissionModal({ isOpen, onClose, submission, onApprove, onDeny }) {
  const [imageError, setImageError] = useState(false)
  const [profileImageError, setProfileImageError] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [fullscreenDoc, setFullscreenDoc] = useState(null)
  const [showDeclineReason, setShowDeclineReason] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [isSubmittingDecline, setIsSubmittingDecline] = useState(false)

  if (!isOpen || !submission) return null

  // List of form types that should show the documents tab
  const documentFormTypes = [
    "PWD INTAKE FORM",
    "SOLO PARENT INTAKE FORM",
    "SENIOR CITIZEN INTAKE FORM",
    "ERPAT INTAKE FORM",
  ]

  // Check if we should show documents tab
  const showDocumentsTab = documentFormTypes.includes(submission.formType)

  // Format date and time
  function formatDateTime(dateString) {
    if (!dateString) return "N/A"
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get profile picture URL
  const currentProfilePicture = submission.profilePictureUrl
    ? `/storage/${submission.profilePictureUrl.replace("/storage/", "")}`
    : "/images/default-profile.jpg"

  // Enhanced Personal Info Fields with better icons
  const personalFields = [
    { key: "firstName", label: "First Name", icon: <User className="h-4 w-4 text-blue-500" />, category: "name" },
    { key: "middleName", label: "Middle Name", icon: <User className="h-4 w-4 text-blue-500" />, category: "name" },
    { key: "lastName", label: "Last Name", icon: <User className="h-4 w-4 text-blue-500" />, category: "name" },
    {
      key: "birthDate",
      label: "Birth Date",
      icon: <Calendar className="h-4 w-4 text-purple-500" />,
      category: "personal",
    },
    { key: "age", label: "Age", icon: <Badge className="h-4 w-4 text-purple-500" />, category: "personal" },
    { key: "sex", label: "Sex", icon: <Info className="h-4 w-4 text-purple-500" />, category: "personal" },
    {
      key: "civilStatus",
      label: "Civil Status",
      icon: <Info className="h-4 w-4 text-purple-500" />,
      category: "personal",
    },
    { key: "contact", label: "Contact", icon: <Phone className="h-4 w-4 text-green-500" />, category: "contact" },
    { key: "email", label: "Email", icon: <Mail className="h-4 w-4 text-green-500" />, category: "contact" },
    {
      key: "education",
      label: "Education",
      icon: <GraduationCap className="h-4 w-4 text-orange-500" />,
      category: "background",
    },
    {
      key: "occupation",
      label: "Occupation",
      icon: <Briefcase className="h-4 w-4 text-orange-500" />,
      category: "background",
    },
  ]

  // Enhanced Address Info Fields
  const addressFields = [
    { key: "block", label: "Block", icon: <Home className="h-4 w-4 text-indigo-500" /> },
    { key: "sitio", label: "Sitio", icon: <MapPin className="h-4 w-4 text-indigo-500" /> },
    { key: "barangay", label: "Barangay", icon: <Building className="h-4 w-4 text-indigo-500" /> },
    { key: "city", label: "City", icon: <Building className="h-4 w-4 text-indigo-500" /> },
    { key: "province", label: "Province", icon: <MapPin className="h-4 w-4 text-indigo-500" /> },
  ]

  // Dynamically get fields from known form-specific prefixes
  const formPrefixes = ["lgbt_", "solo_", "erpa_", "senior_", "pwd_", "indigenous_", "other_"]
  const formFieldKeys = Object.keys(submission).filter((key) => formPrefixes.some((prefix) => key.startsWith(prefix)))
  const formSpecificFields = formFieldKeys.map((key) => ({
    key,
    label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    icon: <Info className="h-4 w-4 text-slate-500" />,
  }))

  // Document fields based on form type
  const documentFields = {
    "PWD INTAKE FORM": {
      key: "pwdDocument",
      label: "PWD Document",
      description: "PWD ID or Medical Certificate",
    },
    "SOLO PARENT INTAKE FORM": {
      key: "soloParentDocument",
      label: "Solo Parent Document",
      description: "Solo Parent ID or Certification",
    },
    "SENIOR CITIZEN INTAKE FORM": {
      key: "seniorDocument",
      label: "Senior Citizen Document",
      description: "Senior Citizen ID",
    },
    "ERPAT INTAKE FORM": {
      key: "erpatDocument",
      label: "ERPAT Document",
      description: "ERPAT Certification",
    },
  }

  // Enhanced status badge with modern styling
  const getStatusBadge = () => {
    const status = submission.status?.toLowerCase() || "pending"

    const statusConfig = {
      approved: {
        bg: "bg-gradient-to-r from-emerald-50 to-green-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: <Check className="h-3.5 w-3.5 mr-1.5" />,
      },
      pending: {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: <Clock className="h-3.5 w-3.5 mr-1.5" />,
      },
      declined: {
        bg: "bg-gradient-to-r from-rose-50 to-red-50",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: <X className="h-3.5 w-3.5 mr-1.5" />,
      },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} shadow-sm`}
      >
        {config.icon}
        <span className="capitalize">{status}</span>
      </span>
    )
  }

  // Define tabs with enhanced styling
  const baseTabs = [
    { id: "personal", label: "Personal Info", icon: <User className="h-4 w-4" />, color: "text-blue-600" },
    { id: "address", label: "Address", icon: <MapPin className="h-4 w-4" />, color: "text-indigo-600" },
    { id: "form", label: "Form Details", icon: <FileText className="h-4 w-4" />, color: "text-slate-600" },
    { id: "signature", label: "Signature", icon: <FileSignature className="h-4 w-4" />, color: "text-purple-600" },
  ]

  // Add documents tab if needed
  const tabs = showDocumentsTab
    ? [
        ...baseTabs,
        { id: "documents", label: "Documents", icon: <File className="h-4 w-4" />, color: "text-orange-600" },
      ]
    : baseTabs

  // Handle decline submission
  const handleDeclineSubmit = () => {
    if (!declineReason.trim()) return

    setIsSubmittingDecline(true)
    onDeny(submission.id, declineReason.trim())

    setDeclineReason("")
    setShowDeclineReason(false)
    setIsSubmittingDecline(false)
  }
  // Replace the currentProfilePicture with form image handling
const currentFormImage = submission.formImage
  ? submission.formImage.startsWith('/') 
    ? submission.formImage 
    : `/${submission.formImage}`
  : "/images/default-form.png";
  // Cancel decline
  const handleCancelDecline = () => {
    setShowDeclineReason(false)
    setDeclineReason("")
  }

  // Modern field component
  const FieldDisplay = ({ field, value, className = "" }) => (
    <div
      className={`group p-4 rounded-xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
          {field.icon}
        </div>
        <span className="text-sm font-medium text-gray-600">{field.label}</span>
      </div>
      <p className="text-base font-semibold text-gray-900 leading-relaxed">
        {value || <span className="text-gray-400 font-normal">Not provided</span>}
      </p>
    </div>
  )

  // Render document preview
  const renderDocumentPreview = () => {
    if (!showDocumentsTab) return null

    const documentConfig = documentFields[submission.formType]
    if (!documentConfig) return null

    const documentUrl = submission[documentConfig.key]
    const fileExtension = documentUrl?.split(".").pop()?.toLowerCase()

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mb-4">
            <File className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{documentConfig.label}</h3>
          <p className="text-gray-600">{documentConfig.description}</p>
        </div>

        {documentUrl ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {["jpg", "jpeg", "png"].includes(fileExtension) ? (
              <div className="relative">
                <img
                  src={`/storage/${documentUrl}`}
                  alt={documentConfig.label}
                  className="w-full h-80 object-contain bg-gray-50"
                  onError={() => setImageError(true)}
                />
                <button
                  onClick={() =>
                    setFullscreenDoc({
                      url: `/storage/${documentUrl}`,
                      title: documentConfig.label,
                      type: "image",
                    })
                  }
                  className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-xl shadow-lg text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm"
                  aria-label="View fullscreen"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileText className="h-10 w-10 text-red-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-2">PDF Document</p>
                <p className="text-gray-600 mb-6 text-center">Click below to view or open in fullscreen</p>
                <div className="flex gap-3">
                  <a
                    href={`/storage/${documentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Document
                  </a>
                  <button
                    onClick={() =>
                      setFullscreenDoc({
                        url: `/storage/${documentUrl}`,
                        title: documentConfig.label,
                        type: "pdf",
                      })
                    }
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Fullscreen
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <File className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No document uploaded</p>
          </div>
        )}
      </div>
    )
  }

  // Fullscreen document viewer
  const renderFullscreenViewer = () => {
    if (!fullscreenDoc) return null

    return (
      <div className="fixed inset-0 z-[60] bg-black/95 flex flex-col">
        <div className="p-6 flex items-center justify-between bg-black/50 backdrop-blur-sm border-b border-white/10">
          <button
            onClick={() => setFullscreenDoc(null)}
            className="text-white hover:text-gray-200 p-3 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <h3 className="text-white font-semibold text-lg">{fullscreenDoc.title}</h3>
          <div className="w-[100px]"></div>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
          {fullscreenDoc.type === "image" ? (
            <img
              src={fullscreenDoc.url || "/placeholder.svg"}
              alt={fullscreenDoc.title}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
            />
          ) : (
            <iframe
              src={fullscreenDoc.url}
              title={fullscreenDoc.title}
              className="w-full h-full bg-white rounded-lg shadow-2xl"
            />
          )}
        </div>
      </div>
    )
  }

  // Modern personal info fields rendering
  const renderPersonalInfoFields = () => {
    const nameFields = personalFields.filter((f) => f.category === "name")
    const personalInfo = personalFields.filter((f) => f.category === "personal")
    const contactInfo = personalFields.filter((f) => f.category === "contact")
    const backgroundInfo = personalFields.filter((f) => f.category === "background")

    return (
      <div className="space-y-8">
        {/* Profile Section */}
        <div className="text-center py-8">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-blue-100 to-indigo-100">
              {!profileImageError ? (
                <img
                  src={currentProfilePicture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setProfileImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-500" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Information</h3>
          <p className="text-gray-600">Applicant's personal identification details</p>
        </div>

        {/* Name Section */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            Full Name
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nameFields.map((field) => (
              <FieldDisplay key={field.key} field={field} value={submission[field.key]} />
            ))}
          </div>
        </div>

        {/* Personal Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
              <Info className="h-4 w-4 text-purple-600" />
            </div>
            Personal Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {personalInfo.map((field) => (
              <FieldDisplay key={field.key} field={field} value={submission[field.key]} />
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactInfo.map((field) => (
              <FieldDisplay key={field.key} field={field} value={submission[field.key]} />
            ))}
          </div>
        </div>

        {/* Background Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-orange-600" />
            </div>
            Background Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {backgroundInfo.map((field) => (
              <FieldDisplay key={field.key} field={field} value={submission[field.key]} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Modern address fields rendering
  const renderAddressInfoFields = () => {
    return (
      <div className="space-y-8">
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl mb-4">
            <MapPin className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Address Information</h3>
          <p className="text-gray-600">Complete residential address details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addressFields.map((field) => (
            <FieldDisplay key={field.key} field={field} value={submission[field.key]} />
          ))}
        </div>

        {/* Address Summary Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Home className="h-5 w-5 text-indigo-600" />
            Complete Address
          </h4>
          <p className="text-gray-700 leading-relaxed">
            {[
              submission.block && `Block ${submission.block}`,
              submission.sitio,
              submission.barangay && `Barangay ${submission.barangay}`,
              submission.city,
              submission.province,
            ]
              .filter(Boolean)
              .join(", ") || "Address information not complete"}
          </p>
        </div>
      </div>
    )
  }

  // Modern form specific fields rendering
  const renderFormSpecificFields = () => {
    return (
      <div className="space-y-8">
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-gray-100 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Form-Specific Details</h3>
          <p className="text-gray-600">Additional information related to {submission.formType}</p>
        </div>

        {formSpecificFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formSpecificFields.map((field) => (
              <FieldDisplay key={field.key} field={field} value={submission[field.key]} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No form-specific fields available</p>
            <p className="text-gray-400 text-sm mt-1">This form type doesn't have additional custom fields</p>
          </div>
        )}
      </div>
    )
  }

  // Modern decline reason form
  const renderDeclineReasonForm = () => {
    return (
      <div className="border-t border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-rose-900">Decline Reason Required</h4>
              <p className="text-sm text-rose-700 mt-1">Please provide a clear reason for declining this submission.</p>
            </div>
          </div>

          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Enter detailed reason for declining this application..."
            className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none"
            rows={4}
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancelDecline}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDeclineSubmit}
              disabled={!declineReason.trim() || isSubmittingDecline}
              className={`px-4 py-2 text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center gap-2 ${
                !declineReason.trim() || isSubmittingDecline ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <X className="h-4 w-4" />
              Confirm Decline
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[95vh] flex flex-col">
          {/* Modern Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
            <div className="flex items-center gap-4">
               <div className="relative">
      <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-lg bg-white">
       <img
          src={currentFormImage}
          alt={submission.formType || "Form"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            
          }}
        />
      </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{submission.formType || "Application"}</h2>
                  {getStatusBadge()}
                </div>
                <p className="text-sm text-gray-500">
                  Application ID: <span className="font-mono">{submission.id}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modern Tabs */}
          <div className="border-b border-gray-100 bg-white">
            <div className="flex overflow-x-auto px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-all duration-200 border-b-2 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? `text-gray-900 border-gray-900 ${tab.color}`
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modern Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30" style={{ minHeight: "500px" }}>
            {activeTab === "personal" && renderPersonalInfoFields()}
            {activeTab === "address" && renderAddressInfoFields()}
            {activeTab === "form" && renderFormSpecificFields()}

            {/* Modern Signature Tab */}
            {activeTab === "signature" && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-4">
                    <FileSignature className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Signature</h3>
                  <p className="text-gray-600">Applicant's electronic signature for verification</p>
                </div>

                {submission.signatureUrl ? (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="relative">
                      <img
                        src={submission.signatureUrl || "/placeholder.svg"}
                        alt="Applicant signature"
                        className="w-full h-60 object-contain bg-gray-50 p-8"
                        onError={() => setImageError(true)}
                      />
                      <button
                        onClick={() =>
                          setFullscreenDoc({
                            url: submission.signatureUrl,
                            title: "Applicant Signature",
                            type: "image",
                          })
                        }
                        className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-xl shadow-lg text-gray-700 hover:text-gray-900 transition-all duration-200 backdrop-blur-sm"
                        aria-label="View fullscreen"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileSignature className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No signature available</p>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && renderDocumentPreview()}
          </div>

          {/* Modern Footer */}
          <div className="border-t border-gray-100 bg-white rounded-b-2xl">
            {/* Status-specific content with modern styling */}
            {submission.status === "approved" && (
              <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-emerald-800">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="font-semibold">Approved by: {submission.approvedByName || "Admin"}</span>
                  </div>
                  {submission.approvedAt && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(submission.approvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {submission.status === "declined" && (
              <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-red-50 border-b border-rose-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-rose-800">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <X className="h-4 w-4 text-rose-600" />
                    </div>
                    <span className="font-semibold">Declined by: {submission.declinedByName || "Admin"}</span>
                  </div>
                  {submission.declinedAt && (
                    <div className="flex items-center gap-2 text-sm text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(submission.declinedAt)}</span>
                    </div>
                  )}
                </div>
                {submission.declineReason && (
                  <div className="mt-4 pt-4 border-t border-rose-200">
                    <p className="text-sm text-rose-800 font-semibold mb-1">Decline Reason:</p>
                    <p className="text-sm text-rose-700 bg-rose-100 p-3 rounded-lg">{submission.declineReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Decline reason form */}
            {showDeclineReason && renderDeclineReasonForm()}

            {/* Modern action buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 gap-4">
              <div className="text-sm text-gray-600 w-full sm:w-auto text-center sm:text-left bg-gray-50 px-4 py-2 rounded-lg">
                <span className="font-medium">Submitted:</span> {formatDateTime(submission.submissionDate)}
              </div>
              <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm font-medium"
                >
                  Close
                </button>

                {submission.status === "pending" && (
                  <>
                    {!showDeclineReason ? (
                      <button
                        onClick={() => setShowDeclineReason(true)}
                        className="px-6 py-2.5 text-white bg-gradient-to-r from-rose-500 to-red-500 rounded-xl hover:from-rose-600 hover:to-red-600 transition-all duration-200 shadow-sm font-medium flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Decline
                      </button>
                    ) : null}
                    <button
                      onClick={() => onApprove(submission.id)}
                      className="px-6 py-2.5 text-white bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-200 shadow-sm font-medium flex items-center gap-2"
                      disabled={showDeclineReason}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen document viewer */}
      {renderFullscreenViewer()}
    </>
  )
}
