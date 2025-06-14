"use client"

import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput from "@/Components/TextInput"
import GuestLayout from "@/Layouts/GuestLayout"
import "../../../css/register.css"
import { Head, Link, useForm } from "@inertiajs/react"
import {
  Upload,
  X,
  FileText,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
  User,
  Shield,
  Check,
  PinIcon,
  Mail,
  HomeIcon,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/Contexts/ToastContext"
import { usePage } from "@inertiajs/react"
import CustomSelect from "@/Components/CustomSelect"
import CustomDatePicker from "@/Components/CustomDatePicker"

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [stepsCompleted, setStepsCompleted] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  })
  const fileInputRef = useRef(null)

  // Updated form state to match new DB columns
  const { data, setData, post, reset } = useForm({
    fname: "",
    lname: "",
    birthdate: "",
    gender: "",
    cstatus: "",
    // Address fields (new rows)
    sign_up_city: "Cebu City",
    sign_up_barangay: "Sawang Calero",
    sign_up_region: "VII",
    sign_up_block: "",
    sign_up_sitio: "",
    sign_up_street: "",
    sign_up_houseno: "",
    sign_up_province: "Cebu",
    // Optional: addr_type if you add it to DB
    email: "",
    password: "",
    password_confirmation: "",
    identity_proofs: [],
  })

  const [errors, setErrors] = useState({});

  // Step validation logic for 4 steps
  useEffect(() => {
    // Step 1: Personal Info
    if (currentStep === 1) {
      const isStep1Valid =
        data.fname.trim() !== "" &&
        data.lname.trim() !== "" &&
        data.birthdate !== "" &&
        data.gender.trim() !== "" &&
        data.cstatus.trim() !== ""
      setStepsCompleted((prev) => ({ ...prev, 1: isStep1Valid }))
    }
    // Step 2: Address Info
    if (currentStep === 2) {
      const isStep2Valid =
        data.sign_up_city.trim() !== "" &&
        data.sign_up_barangay.trim() !== "" &&
        data.sign_up_block.trim() !== "" &&
        data.sign_up_houseno.trim() !== ""
        // data.sign_up_region.trim() !== "" &&
        // data.sign_up_province.trim() !== ""
      setStepsCompleted((prev) => ({ ...prev, 2: isStep2Valid }))
    }
    // Step 3: Account Info
    if (currentStep === 3) {
      const isStep3Valid =
        data.email.trim() !== "" &&
        data.password.trim() !== "" &&
        data.password_confirmation.trim() !== ""
      setStepsCompleted((prev) => ({ ...prev, 3: isStep3Valid }))
    }
    // Step 4: Proof of Identity
    if (currentStep === 4) {
      const isStep4Valid = data.identity_proofs.length > 0
      setStepsCompleted((prev) => ({ ...prev, 4: isStep4Valid }))
    }
  }, [data, currentStep])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files) => {
    const newFiles = Array.from(files)
    setData("identity_proofs", [...data.identity_proofs, ...newFiles])

    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const removeFile = (index) => {
    setData(
      "identity_proofs",
      data.identity_proofs.filter((_, i) => i !== index),
    )
  }

  const showToast = useToast()

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const submit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setStepsCompleted(prev => ({ ...prev, 4: true }));

    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      if (key === "identity_proofs") {
        data[key].forEach((file) => formData.append("identity_proofs[]", file))
      } else {
        formData.append(key, data[key])
      }
    })

    try {
      const response = await fetch(route("register"), {
        method: "POST",
        body: formData,
        headers: {
          "X-CSRF-TOKEN": document.querySelector('meta[name=\"csrf-token\"]').getAttribute("content"),
        },
      })
      if (response.ok) {
        const result = await response.json();
        showToast(result.message, "success");
        if (result.errors) {
          setErrors(result.errors);
        }
        reset("password", "password_confirmation");
        window.location.reload();
      } else if (response.status === 422) {
        const result = await response.json();
        if (result.errors) {
          setErrors(result.errors);

          // Get the first error message from the errors object
          const firstError = Object.values(result.errors)[0][0];
          showToast(firstError, "error");
        } else {
          showToast(result.message, "error");
        }
      } else {
        showToast("An unexpected error occurred. Please try again.", "error");
      }
    } catch (error) {
      showToast(`Registration failed. Please try again. ${error}`, "error")
      console.error(error)
    } finally {
      setProcessing(false)
    }
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]
  
  // Gender options for select
  const genderOptions = [
    { value: "", label: "Select Gender" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]

  // Civil status options for select
  const civilStatusOptions = [
    { value: "", label: "Select Civil Status" },
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "widowed", label: "Widowed" },
    { value: "divorced", label: "Divorced" },
    { value: "separated", label: "Separated" },
  ]
  

  // Render progress steps
  const renderSteps = () => {
    return (
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-center">
          {/* Step 1 - Personal Info */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              } transition-colors duration-300`}
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div
              className={`ml-1 sm:ml-2 text-xs sm:text-sm ${
                currentStep >= 1 ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              <span className="hidden xs:inline">Personal</span>
            </div>
          </div>

          {/* Connector after Step 1 */}
          <div
            className={`w-6 sm:w-12 h-1 mx-1 sm:mx-3 ${
              currentStep > 1 ? "bg-blue-600" : "bg-gray-200"
            } transition-colors duration-300`}
          ></div>

          {/* Step 2 - Address */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              } transition-colors duration-300`}
            >
              <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div
              className={`ml-1 sm:ml-2 text-xs sm:text-sm ${
                currentStep >= 2 ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              <span className="hidden xs:inline">Address</span>
            </div>
          </div>

          {/* Connector after Step 2 */}
          <div
            className={`w-6 sm:w-12 h-1 mx-1 sm:mx-3 ${
              currentStep > 2 ? "bg-blue-600" : "bg-gray-200"
            } transition-colors duration-300`}
          ></div>

          {/* Step 3 - Account Info */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              } transition-colors duration-300`}
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div
              className={`ml-1 sm:ml-2 text-xs sm:text-sm ${
                currentStep >= 3 ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              <span className="hidden xs:inline">Account</span>
            </div>
          </div>

          {/* Connector after Step 3 */}
          <div
            className={`w-6 sm:w-12 h-1 mx-1 sm:mx-3 ${
              currentStep > 3 ? "bg-blue-600" : "bg-gray-200"
            } transition-colors duration-300`}
          ></div>

          {/* Step 4 - Proof of Identity */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                currentStep >= 4 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              } transition-colors duration-300`}
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div
              className={`ml-1 sm:ml-2 text-xs sm:text-sm ${
                currentStep >= 4 ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              <span className="hidden xs:inline">Identity</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <GuestLayout>
      <Head title="Register" />
      <div className="max-w-5xl mx-auto overflow-hidden">
        <div className="p-2">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Resident Account</h2>
          {renderSteps()}
          <form onSubmit={submit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6 transition-all duration-300 animate-fadeIn">
                <div className="max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="fname" value="First Name" />
                      <TextInput
                        type="text"
                        name="first name"
                        value={data.fname}
                        onChange={(e) => setData("fname", e.target.value)}
                        className="mt-1 block w-full"
                        autoComplete="fname"
                        required
                      />
                      {errors.fname && <InputError message={errors.fname[0]} />}
                    </div>

                    <div>
                      <InputLabel htmlFor="lname" value="Last Name" />
                      <TextInput
                        type="text"
                        name="last name"
                        value={data.lname}
                        onChange={(e) => setData("lname", e.target.value)}
                        className="mt-1 block w-full"
                        autoComplete="lname"
                        required
                      />
                      {errors.lname && <InputError message={errors.lname[0]} />}
                    </div>

                    <div>
                      <InputLabel htmlFor="birthdate" value="Birthdate" />
                      <input
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        value={data.birthdate}
                        onChange={(e) => setData("birthdate", e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        max={today}
                        required
                      />
                      {errors.birthdate && <InputError message={errors.birthdate[0]} />}
                    </div>

                    {/* <div>
                      <InputLabel htmlFor="contact_number" value="Contact Number" />
                      <TextInput
                        type="tel"
                        name="contact number"
                        value={data.contact_number}
                        onChange={(e) => setData("contact_number", e.target.value)}
                        className="mt-1 block w-full"
                        autoComplete="tel"
                        required
                      />
                      {errors.contact_number && <InputError message={errors.contact_number} />}
                    </div> */}

                    <div>
                      <CustomSelect
                        id="gender"
                        label="Gender"
                        value={data.gender}
                        onChange={(e) => setData("gender", e.target.value)}
                        options={genderOptions}
                        required
                        error={errors.gender}
                      />
                    </div>

                    <div>
                      <CustomSelect
                        id="cstatus"
                        label="Civil Status"
                        value={data.cstatus}
                        onChange={(e) => setData("cstatus", e.target.value)}
                        options={civilStatusOptions}
                        required
                        error={errors.cstatus}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Information */}
            {currentStep === 2 && (
              <div className="space-y-6 transition-all duration-300 animate-fadeIn">
                <div className="max-w-3xl mx-auto">
                  <h3 className="font-medium text-gray-900 text-lg border-b pb-2 mb-6">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="sign_up_city" value="City" />
                      <TextInput
                        type="text"
                        name="City"
                        value={data.sign_up_city}
                        className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <InputLabel htmlFor="sign_up_barangay" value="Barangay" />
                      <TextInput
                        type="text"
                        name="Barangay"
                        value={data.sign_up_barangay}
                        className="mt-1 block w-full bg-gray-100 cursor-not-allowed"
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <InputLabel htmlFor="sign_up_block" value="Block" />
                      <select
                        id="sign_up_block"
                        name="sign_up_block"
                        value={data.sign_up_block}
                        onChange={e => setData("sign_up_block", e.target.value)}
                        className="mt-1 block w-full rounded-md border-black-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      >
                        <option value="" disabled>Select Block</option>
                        <option value="1">Block 1</option>
                        <option value="2">Block 2</option>
                        <option value="3">Block 3</option>
                        <option value="4">Block 4</option>
                        <option value="5">Block 5</option>
                        <option value="6">Block 6</option>
                        <option value="7">Block 7</option>
                        <option value="7A">Block 7A</option>
                        <option value="7B">Block 7B</option>
                      </select>
                    </div>
                    {/* <div>
                      <InputLabel htmlFor="sign_up_sitio" value="Sitio" />
                      <TextInput
                        type="text"
                        name="sign_up_sitio"
                        value={data.sign_up_sitio}
                        onChange={e => setData("sign_up_sitio", e.target.value)}
                        className="mt-1 block w-full"
                      />
                    </div> */}
                    <div>
                      <InputLabel htmlFor="sign_up_street" value="Street" />
                      <TextInput
                        type="text"
                        name="Street"
                        value={data.sign_up_street}
                        onChange={e => setData("sign_up_street", e.target.value)}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <div>
                      <InputLabel htmlFor="sign_up_houseno" value="House No." />
                      <TextInput
                        type="text"
                        name="House No."
                        value={data.sign_up_houseno}
                        onChange={e => setData("sign_up_houseno", e.target.value)}
                        className="mt-1 block w-full"
                      />
                    </div>
                    {/* <div>
                      <InputLabel htmlFor="sign_up_province" value="Province" />
                      <TextInput
                        type="text"
                        name="Province"
                        value={data.sign_up_province}
                        onChange={e => setData("sign_up_province", e.target.value)}
                        className="mt-1 block w-full"
                        required
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Account Information */}
            {currentStep === 3 && (
              <div className="space-y-6 transition-all duration-300 animate-fadeIn">
                <div className="max-w-3xl mx-auto">
                  <h3 className="font-medium text-gray-900 text-lg border-b pb-2 mb-6">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <InputLabel htmlFor="email" value="Email" />
                      <TextInput
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={e => setData("email", e.target.value)}
                        className="mt-1 block w-full"
                        required
                      />
                      {errors.email && <InputError message={errors.email[0]} />}
                    </div>
                    <div>
                      <InputLabel htmlFor="password" value="Password" />
                      <TextInput
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={e => setData("password", e.target.value)}
                        className="mt-1 block w-full"
                        required
                      />
                      {errors.password && <InputError message={errors.password[0]} />}
                    </div>
                    <div>
                      <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                      <TextInput
                        type="password"
                        name="Confirm Password"
                        value={data.password_confirmation}
                        onChange={e => setData("password_confirmation", e.target.value)}
                        className="mt-1 block w-full"
                        required
                      />
                      {errors.password_confirmation && <InputError message={errors.password_confirmation[0]} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Proof of Identity */}
            {currentStep === 4 && (
              <div className="space-y-6 transition-all duration-300 animate-fadeIn">
                <div className="max-w-2xl mx-auto">
                  {/* <h3 className="font-medium text-gray-900 text-lg border-b pb-2 mb-4">Proof of Identity</h3> */}

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                    <p className="text-sm text-blue-700">
                      Please provide valid identification documents (e.g., National ID, Driver's License, Passport,
                      Voter's ID) along with a picture of yourself.
                    </p>
                  </div>

                  <div
                    className={`flex justify-center rounded-lg border-2 border-dashed ${
                      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                    } px-6 py-6 transition-colors duration-300`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex flex-col items-center text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer  border-2 border-gray-300 rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500 px-4 py-2 shadow-sm"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            ref={fileInputRef}
                            multiple
                            onChange={(e) => handleFiles(e.target.files)}
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                        </label>
                        <p className="pl-1 mt-2">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600 mt-2">PNG, JPG, PDF up to 10MB each</p>
                    </div>
                  </div>

                  {/* File List */}
                  {data.identity_proofs.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Uploaded Documents</h4>
                      {data.identity_proofs.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">{uploadProgress}% uploaded</p>
                    </div>
                  )}

                  {errors.identity_proofs && (
                    <div className="mt-4 flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span>{errors.identity_proofs[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Back
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Link
                  href={route("login")}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:underline order-2 sm:order-1 mt-2"
                >
                  Already registered?
                </Link>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!stepsCompleted[currentStep]}
                    className={`flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center order-1 sm:order-2 ${!stepsCompleted[currentStep] ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Next
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </button>
                ) : (
                  <PrimaryButton
                    disabled={processing || !stepsCompleted[4]}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto justify-center text-xs sm:text-sm px-3 sm:px-4 py-2 order-1 sm:order-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </PrimaryButton>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  )
}

