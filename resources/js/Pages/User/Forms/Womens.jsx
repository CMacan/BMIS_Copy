"use client"

import UserLayout from "@/Layouts/UserLayout"
import SignatureModal from "@/components/User/SignatureModal"
import { Head, usePage, router } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Info } from "lucide-react"

// Import form components
import ProgressBar from "@/components/forms/ProgressBar"
import PersonalInformationStep from "@/components/forms/PersonalInformationStep"
import AdditionalDetailsStep from "@/components/forms/AdditionalDetailsStep"
import SignatureStep from "@/components/forms/SignatureStep"
import FormNavigation from "@/components/forms/FormNavigation"
import { useToast } from "@/Contexts/ToastContext"

export default function WomensIntakeForm() {
  const { auth, userData, form_id } = usePage().props

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
    emerg_fname: "",
    emerg_lname: "",
    emerge_contact: "",
    isBreadwinner: "",
    form_id: form_id,
    formType: "WOMENS INTAKE FORM",
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [signature, setSignature] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [formSubmitted, setFormSubmitted] = useState(false)
  const showToast = useToast()

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
        emerg_lname: userData.emerg_lname || "",
        emerg_fname: userData.emerg_fname || "",
        emerg_contact: userData.emerg_contact || "",
      }))
    }
  }, [userData])

  const breadwinnerOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ]

  const handleOpenSignatureModal = () => setIsModalOpen(true)
  const handleSaveSignature = (signatureFile) => {
    setSignature(signatureFile)
    setIsModalOpen(false)
  }

  const nextStep = () => {
    if (currentStep === 3 && !signature) {
      setErrors({ signature: "Signature is required." })
      return
    }
    setErrors({})
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitted(true)
    let newErrors = {}

    if (!signature) {
      newErrors.signature = "Signature is required."
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
      setProcessing(true)
      const formData = new FormData()
      Object.keys(data).forEach((key) => formData.append(key, data[key]))
      formData.append("form_id", form_id)
      if (signature) formData.append("signature", signature, signature.name)
      
      try {
        const response = await fetch("/submit", {
          method: "POST",
          body: formData,
          headers: {
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
          },
        })

        if (response.ok) {
          const result = await response.json()
          showToast("Your form has been successfully submitted!", "success")
          setTimeout(() => router.visit(result.redirect), 2000)
        } else {
          showToast("Failed to submit form. Please try again.", "error")
        }
      } catch (error) {
        showToast("An unexpected error occurred. Please try again.", "error")
      } finally {
        setProcessing(false)
      }
    
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // For select inputs, we want to store just the value, not the whole option object
    const inputValue = e.target.selectedOptions ? e.target.selectedOptions[0].value : value;
    
    setData((prevData) => ({ ...prevData, [name]: inputValue }));
    if (errors[name]) setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  return (
    <UserLayout>
      <Head title="Women's Intake Form" />
      <div className="px-4 md:px-8 py-6 w-full max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black-800">Women's Intake Form</h1>
          <p className="text-gray-600 mt-2">Please review your information and complete the remaining sections.</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} stepLabels={["Personal Information","Additonal Details", "Signature"]} />

        <form  className="space-y-8">
          {currentStep === 1 && (
            <PersonalInformationStep data={data} handleInputChange={handleInputChange} errors={errors} formType="WOMENS INTAKE FORM" />
          )}
          {currentStep === 2 && (
          <AdditionalDetailsStep
            data={data}
            handleInputChange={handleInputChange}
            errors={errors}
            formType="WOMENS INTAKE FORM"
            title="Additional Information"
            description="Please provide these additional details about your situation"
            icon={<Info className="h-5 w-5" />}
            infoText="This information helps us understand your family situation and provide appropriate support services."
          />
        )}
          {currentStep === 3 && (
            <SignatureStep signature={signature} handleOpenSignatureModal={handleOpenSignatureModal} formSubmitted={formSubmitted}  errors={errors} />
          )}

          <FormNavigation currentStep={currentStep} totalSteps={totalSteps} prevStep={prevStep} nextStep={nextStep} onSubmit={handleSubmit} processing={processing} />
        </form>
        <SignatureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSignature} />
      </div>
    </UserLayout>
  )
}
