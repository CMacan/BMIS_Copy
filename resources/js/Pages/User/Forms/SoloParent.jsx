"use client"

import UserLayout from "@/Layouts/UserLayout"
import SignatureModal from "@/components/User/SignatureModal"
import { Head, usePage, router } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Heart, Users } from "lucide-react"
import ProgressBar from "@/components/forms/ProgressBar"
import PersonalInformationStep from "@/components/forms/PersonalInformationStep"
import DocumentUploadStep from "@/components/forms/DocumentUploadStep";
import AdditionalDetailsStep from "@/components/forms/AdditionalDetailsStep"
import SignatureStep from "@/components/forms/SignatureStep"
import FormNavigation from "@/components/forms/FormNavigation"
import { useToast } from "@/Contexts/ToastContext"

export default function SoloParentIntakeForm() {
  const { auth, registrationType, userData, form_id } = usePage().props

  const [data, setData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    city: "",
    province: "",
    block: "",
    barangay: "",
    sitio: "",
    birthDate: "",
    age: "",
    occupation: "",
    sex: "",
    civilStatus: "",
    education: "",
    contact: "",
    nature_of_disability: "",
    facebook_account: "",
    familyMembers: [], // New field for Family Composition
    form_id: form_id,
    prof_religion:"",
    monthlyIncome: "",
    familyMonthlyIncome: "",
    soloParentClassification: "",
    soloParentNeeds: "",
    familyResources: "",
    soloParentDocument: null,
    formType: "SOLO PARENT INTAKE FORM",
  })

  const [soloParentDocument, setSoloParentDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [signature, setSignature] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [householdData, setHouseholdData] = useState([]);

  const isReadOnly = registrationType === "self" || !auth.user.profile?.prof_is_house_head

  useEffect(() => {
    if (userData) {
      setData((prevData) => ({
        ...prevData,
        firstName: userData.firstName || "",
        middleName: userData.middleName || "",
        lastName: userData.lastName || "",
        city: userData.city || "",
        province: userData.province || "",
        block: userData.block || "",
        barangay: userData.barangay || "",
        sitio: userData.sitio || "",
        birthDate: userData.birthDate || "",
        age: userData.age || "",
        occupation: userData.occupation || "",
        sex: userData.sex || "",
        civilStatus: userData.status || "",
        education: userData.education || "",
        contact: userData.contact || "",
        prof_religion: userData.prof_religion || "",
      }))
    }
  }, [userData])

  const handleOpenSignatureModal = () => {
    setIsModalOpen(true)
  }

  const handleSaveSignature = (signatureFile) => {
    setSignature(signatureFile)
    setIsModalOpen(false)
  }

  const showToast = useToast()

  const nextStep = () => {
    const newErrors = {}

    if (currentStep === 2) {
      if (!data.monthlyIncome) newErrors.monthlyIncome = true
      if (!data.familyMonthlyIncome) newErrors.familyMonthlyIncome = true
      if (!data.soloParentClassification) newErrors.soloParentClassification = true
      if (!data.soloParentNeeds) newErrors.soloParentNeeds = true
      if (!data.familyResources) newErrors.familyResources = true
    }

    if (currentStep === 3 ) {
      if(!signature) {
      newErrors.signature = "Signature is required."
    }
  }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitted(true)

    let newErrors = {}

    if (currentStep === totalSteps && !soloParentDocument) {
      newErrors.pwdDocument = "A Solo Parent document is required.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setProcessing(true)

    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
    formData.append("form_id", form_id)

    if (signature) {
      formData.append("signature", signature, signature.name)
    }

    try {
      const response = await fetch("/submit", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
      })

      if (response.ok) {
        const result = await response.json()
        showToast("Your form has been successfully submitted!", "success")
        setTimeout(() => {
          router.visit(result.redirect)
        }, 2000)
      } else {
        const errorText = await response.text()
        console.error("Server error:", errorText)
        showToast("Failed to submit form. Please try again.", "error")
      }
    } catch (error) {
      console.error("An error occurred:", error)
      showToast("An unexpected error occurred. Please try again.", "error")
    } finally {
      setProcessing(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }))
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const stepLabels = [
    "Personal Information",
    "Additional Details",
    "Signature",
    "Document Upload",
  ]

  return (
    <UserLayout>
      <Head title="Solo Parent Intake Form" />
      <div className="px-4 md:px-8 py-6 w-full max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black-800">Solo Parent Intake Form</h1>
          <p className="text-gray-600 mt-2">
            {isReadOnly
              ? "Please review your information and complete the remaining sections"
              : "Please fill in the information for the household member"}
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} stepLabels={stepLabels} />

        <form  className="space-y-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <PersonalInformationStep
              data={data}
              handleInputChange={handleInputChange}
              errors={errors}
              isReadOnly={isReadOnly}
              formType= "SOLO PARENT INTAKE FORM"
            />
          )}

        

        {/* Step 2: Additional Details */}
        {currentStep === 2 && (
        <AdditionalDetailsStep
          data={data}
          handleInputChange={handleInputChange}
          errors={errors}
          title="Additional Information"
          description="Please provide the details needed."
          icon={<Heart className="w-5 h-5 text-white" />}
          formType={data.formType} // ✅ Ensure it's being used properly
        />
      )}

          {/* Step 4: Signature */}
          {currentStep === 3 && (
            <SignatureStep
              signature={signature}
              handleOpenSignatureModal={handleOpenSignatureModal}
              formSubmitted={formSubmitted}
              errors={errors}
              formType="SOLO PARENT INTAKE FORM"
            />
          )}
          {/* Step 5: Document Upload */}
                    {currentStep === 4 && (
                      <DocumentUploadStep 
                        title="Upload Solo Parent Certification"
                        description="Please upload a scanned copy of your PWD ID or medical certificate."
                        acceptedFormats=".pdf,.jpg,.png"
                        file={soloParentDocument} 
                        setFile={setSoloParentDocument} 
                        errors={errors} 
                        setErrors={setErrors} 
                        formSubmitted={formSubmitted} // ✅ Pass formSubmitted prop
                      />
                    )}

          {/* Navigation Buttons */}
          <FormNavigation currentStep={currentStep} totalSteps={totalSteps} prevStep={prevStep} nextStep={nextStep} onSubmit={handleSubmit} processing={processing} />
        </form>
        <SignatureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSignature} />
      </div>
    </UserLayout>
  )
}
