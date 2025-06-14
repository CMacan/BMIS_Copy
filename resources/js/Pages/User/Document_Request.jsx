"use client"

import { useState } from "react"
import UserLayout from "@/Layouts/UserLayout"
import { Head, usePage } from "@inertiajs/react"
import DocumentRequestForm from "@/Pages/User/DocumentRequestForm"
import BusinessClearanceForm from "@/Pages/User/BussinesForm"
import SKCertificateForm from "@/Pages/User/SkForm"
import { X, FileText, Award, Building, Home } from "lucide-react"

export default function Document_Request() {
  const { auth } = usePage().props
  const user = auth.user
  const profile = auth.user.profile || {}
  const household = auth.household || {}
  const householdMembers = auth.householdMembers || []
  const address = auth.address || {}

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState(null)

  const handleOpenModal = (documentType) => {
    setSelectedDocumentType(documentType)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedDocumentType(null)
  }

  // Prepare the initial data for the form
  const initialFormData = {
    name: `${profile.prof_fname || ""} ${profile.prof_lname || ""}`.trim(),
    address:
      `${address.addr_block || ""} ${address.addr_street || ""}, ${address.addr_sitio || ""}, ${address.addr_barangay || ""}, ${address.addr_city || ""}`.trim(),
    block: address.addr_block || "",
    age: profile.prof_age || "",
    civil_status: profile.prof_cstatus || "",
    religion: profile.prof_religion || "",
    occupation: profile.prof_occupation || "",
    purpose: "",
    copies: "1",
    household_members: householdMembers.map((member) => ({
      name: `${member.prof_fname || ""} ${member.prof_lname || ""}`.trim(),
      relationship: member.prof_relationship || "",
      age: member.prof_age || "",
    })),
  }

  const documentTypes = [
    {
      id: "transparency-form",
      title: "BARANGAY CLEARANCE",
      description: "View the requirements needed for barangay clearance and acquire online now",
      icon: FileText,
      component: "clearance",
    },
    {
      id: "certificate-indigency",
      title: "CERTIFICATE OF INDIGENCY",
      description: "View the requirements needed for certificate of indigency and acquire online now",
      icon: Award,
      component: "general",
    },
    {
      id: "business-clearance",
      title: "BUSINESS CLEARANCE",
      description: "View the requirements needed for business clearance and acquire online now",
      icon: Building,
      component: "business",
    },
    {
      id: "certificate-residency",
      title: "CERTIFICATE OF RESIDENCY",
      description: "View the requirements needed for certificate residency and acquire online now",
      icon: Home,
      component: "general",
    },
  ]

  const renderForm = () => {
    const docType = documentTypes.find((doc) => doc.id === selectedDocumentType)
    if (!docType) return null

    const commonProps = {
      onClose: handleCloseModal,
      user: user,
      initialData: initialFormData,
    }

    switch (docType.component) {
      case "business":
        return <BusinessClearanceForm documentType={docType.title} {...commonProps} />
      case "sk":
        return <SKCertificateForm documentType={docType.title} {...commonProps} />
      default:
        return <DocumentRequestForm documentType={docType.title} requesterType="self" {...commonProps} />
    }
  }

  return (
    <UserLayout>
      <Head title="Document Request" />
      <div className="py-12 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentTypes.map((docType) => {
              const IconComponent = docType.icon
              return (
                <div
                  key={docType.id}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{docType.title}</h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">{docType.description}</p>
                  <button
                    onClick={() => handleOpenModal(docType.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded-md transition-colors duration-200"
                  >
                    Proceed
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleCloseModal}></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {documentTypes.find((doc) => doc.id === selectedDocumentType)?.title || "Document Request"}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">{renderForm()}</div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  )
}
