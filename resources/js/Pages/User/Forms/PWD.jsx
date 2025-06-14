"use client"

import UserLayout from "@/Layouts/UserLayout"
import SignatureModal from "@/components/User/SignatureModal"
import { Head, usePage, router } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
// Import form components
import ProgressBar from "@/components/forms/ProgressBar"
import PersonalInformationStep from "@/components/forms/PersonalInformationStep"
import AdditionalDetailsStep from "@/components/forms/AdditionalDetailsStep"
import SignatureStep from "@/components/forms/SignatureStep"
import DocumentUploadStep from "@/components/forms/DocumentUploadStep";
import FormNavigation from "@/components/forms/FormNavigation"
import { useToast } from "@/Contexts/ToastContext"

export default function PWDIntakeForm() {
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
    pwd_nature_of_disability: "",
    pwd_facebook_account: "",
    pwdDocument: null,
    form_id: form_id,
    formType: "PWD INTAKE FORM",
  })

  const [pwdDocument, setPwdDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [signature, setSignature] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

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
      if (!data.pwd_nature_of_disability) {
        newErrors.pwd_nature_of_disability = "Nature of Disability is required."
      }
    }
  
    if (currentStep === 3 ) {
      if(!signature) {
      newErrors.signature = "Signature is required."
    }
  }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return // Stop proceeding if there are errors
    }
  
    setErrors({}) // Clear errors when valid
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true); // Mark form as submitted
  
    let newErrors = {}; 
  
    // Validate PWD Document only if user has submitted
    if (currentStep === totalSteps && !pwdDocument) {
      newErrors.pwdDocument = "A PWD document is required.";
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); 
      return;
    }
  
    // Proceed with submission
    setProcessing(true);
  
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    formData.append("form_id", form_id);
  
    if (signature) {
      formData.append("signature", signature, signature.name);
    }
  
    if (pwdDocument) {
      formData.append("pwdDocument", pwdDocument, pwdDocument.name);
    }
  
    try {
      const response = await fetch("/submit", {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
      });
  
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const result = await response.json();
          showToast("Your form has been successfully submitted!", "success");
          setTimeout(() => {
            router.visit(result.redirect);
          }, 2000);
        } else {
          throw new Error("Unexpected response from server");
        }
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        showToast("Failed to submit form. Please try again.", "error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
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
    // Clear the error if the user provides a valid value
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

  const stepLabels = ["Personal Information","Additional Details","Signature" ,"Upload"]

  return (
    <UserLayout>
      <Head title="PWD Intake Form" />
      <div className="px-4 md:px-8 py-6 w-full max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-black-800">PWD Intake Form</h1>
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
            />
          )}

          {/* Step 2: PWD-Specific Information */}
          {currentStep === 2 && (
            <AdditionalDetailsStep
              data={data}
              handleInputChange={handleInputChange}
              errors={errors}
              title="Additional Information"
              description="Please provide the details needed."
              icon={<Heart className="w-5 h-5 text-white-600" />}
              fields={[
                {
                  name: "pwd_nature_of_disability",
                  label: "Nature of Disability",
                  type: "text",
                  placeholder: "Enter nature of disability",
                  required: true
                },
                {
                  name: "pwd_facebook_account",
                  label: "Facebook Account (Optional)",
                  type: "text",
                  placeholder: "Enter your Facebook account",
                  required: false
                },
              ]}
              infoText="This information helps us provide appropriate services and support. All information is kept confidential and protected."
              useInputFields={true} // Use input fields instead of dropdowns
            />
          )}

          {/* Step 3: Signature */}
          {currentStep === 3 && (
            <SignatureStep
              signature={signature}
              handleOpenSignatureModal={handleOpenSignatureModal}
              errors={errors}
              formSubmitted={formSubmitted} // ✅ Pass formSubmitted prop
              formType="PWD INTAKE FORM"
            />
          )}
          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <DocumentUploadStep 
              title="Upload PWD Certification"
              description="Please upload a scanned copy of your PWD ID or medical certificate."
              acceptedFormats=".pdf,.jpg,.png"
              file={pwdDocument} 
              setFile={setPwdDocument} 
              errors={errors} 
              setErrors={setErrors} 
              formSubmitted={formSubmitted} // ✅ Pass formSubmitted prop
            />
          )}


          {/* Navigation Buttons */}
          <FormNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            prevStep={prevStep}
            nextStep={nextStep}
            onSubmit={handleSubmit}
            processing={processing}
          />
        </form>
        <SignatureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSignature} />
      </div>
    </UserLayout>
  )
}

