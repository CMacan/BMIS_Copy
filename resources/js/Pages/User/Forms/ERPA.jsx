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

export default function ERPATIntakeForm() {
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
    erpa_skillsTalent:"",
    erpa_hobbies:"",
    erpa_otherSkills:"",
    erpa_schoolInvolvement:"",
    erpa_civicInvolvement:"",
    erpa_communityInvolvement:"",
    erpa_workplaceInvolvement:"",
    erpa_seminarTitle:"",
    erpa_seminarDate:"",
    erpa_seminarOrganizers:"",
    formType: "ERPAT INTAKE FORM",
  })

  const [ERPATDocument, setERPATDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [signature, setSignature] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
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
      if (!data.erpa_skillsTalent) newErrors.erpa_skillsTalent = true
      if (!data.erpa_hobbies) newErrors.erpa_hobbies = true
      if (!data.erpa_otherSkills) newErrors.erpa_otherSkills = true
      if (!data.erpa_schoolInvolvement) newErrors.erpa_schoolInvolvement = true
      if (!data.erpa_civicInvolvement) newErrors.erpa_civicInvolvement = true
      if (!data.erpa_communityInvolvement) newErrors.erpa_communityInvolvement = true
      if (!data.erpa_workplaceInvolvement) newErrors.erpa_workplaceInvolvement = true
      if (!data.erpa_seminarTitle) newErrors.erpa_seminarTitle = true
      if (!data.erpa_seminarDate) newErrors.erpa_seminarDate = true
      if (!data.erpa_seminarOrganizers) newErrors.erpa_seminarOrganizers = true
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
    e.preventDefault();
    setFormSubmitted(true);

    let newErrors = {};

    if (!signature) {
        newErrors.signature = "Signature is required.";
    }
    
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setProcessing(true);
    
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });
    formData.append("form_id", form_id);

    if (signature) {
        formData.append("signature", signature, signature.name);
    }

    try {
        const response = await fetch("/submit", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json", // Explicitly ask for JSON
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            },
        });

        const contentType = response.headers.get("content-type");
        
        if (response.ok) {
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                showToast("Your form has been successfully submitted!", "success");
                setTimeout(() => {
                    router.visit(result.redirect);
                }, 2000);
            } else {
                // Handle non-JSON response
                const text = await response.text();
                console.error("Non-JSON response:", text);
                showToast("Form submitted, but unexpected response from server.", "warning");
            }
        } else {
            if (contentType && contentType.includes("application/json")) {
                const errorData = await response.json();
                console.error("Server error:", errorData);
                showToast(errorData.message || "Failed to submit form. Please try again.", "error");
            } else {
                const errorText = await response.text();
                console.error("Server HTML error:", errorText);
                showToast("Server error occurred. Please try again.", "error");
            }
        }
    } catch (error) {
        console.error("Network error:", error);
        showToast("Network error occurred. Please check your connection.", "error");
    } finally {
        setProcessing(false);
    }
};

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
  ]

  return (
    <UserLayout>
      <Head title="ERPAT Intake Form" />
      <div className="px-4 md:px-8 py-6 w-full max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black-800">ERPAT Intake Form</h1>
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
          formType={data.formType} 
        />
      )}

          {/* Step 4: Signature */}
          {currentStep === 3 && (
            <SignatureStep
              signature={signature}
              handleOpenSignatureModal={handleOpenSignatureModal}
              formSubmitted={formSubmitted} 
             
              errors={errors}
              
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
