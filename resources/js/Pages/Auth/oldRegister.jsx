"use client"

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Upload, X, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useToast } from "@/Contexts/ToastContext";

export default function Register() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const { data, setData, post, errors, reset } = useForm({
    fname: "",
    lname: "",
    birthdate: "",
    contact_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    identity_proofs: [],
  })

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

//   const submit = (e) => {
//     e.preventDefault()

//     const formData = new FormData()
//     Object.keys(data).forEach((key) => {
//       if (key === "identity_proofs") {
//         data[key].forEach((file) => {
//           formData.append("identity_proofs[]", file)
//         })
//       } else {
//         formData.append(key, data[key])
//       }
//     })

//     post(route("register"), {
//       onFinish: () => reset("password", "password_confirmation"),
//     })
//   }
    const submit = async (e) => {
        e.preventDefault()
        setProcessing(true)

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
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
              },
          })
          
          // Check if the response is a redirect
          if (response.redirected) {
            window.location.href = response.url;
            return;
          }

          const result = await response.json();
          showToast("Registration successful!", "success");
          reset("password", "password_confirmation");
        } catch (error) {
          showToast(`Registration failed. Please try again. ${error}`, "error");
          console.error(error);
        } finally {
          setProcessing(false);
        }
    };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  return (
    <GuestLayout>
      <Head title="Register" />

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Personal Information Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Personal Information</h3>
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
            {errors.fname && <InputError message={errors.fname} />}
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
            {errors.lname && <InputError message={errors.lname} />}
          </div>

          <div>
            <InputLabel htmlFor="birthdate" value="Birthdate" />
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              value={data.birthdate}
              onChange={(e) => setData("birthdate", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              max={today}
              required
            />
            {errors.birthdate && <InputError message={errors.birthdate} />}
          </div>

          <div>
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
          </div>
        </div>

        {/* Account Information Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Account Information</h3>
          <div>
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData("email", e.target.value)}
              className="mt-1 block w-full"
              autoComplete="email"
              required
            />
            {errors.email && <InputError message={errors.email} />}
          </div>

          <div>
            <InputLabel htmlFor="password" value="Password" />
            <TextInput
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData("password", e.target.value)}
              className="mt-1 block w-full"
              autoComplete="new-password"
              required
            />
            {errors.password && <InputError message={errors.password} />}
          </div>

          <div>
            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
            <TextInput
              type="password"
              name="confirm password"
              value={data.password_confirmation}
              onChange={(e) => setData("password_confirmation", e.target.value)}
              className="mt-1 block w-full"
              required
            />
            {errors.password_confirmation && <InputError message={errors.password_confirmation} />}
          </div>
        </div>

        {/* Identity Proof Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Proof of Identity</h3>
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Please provide valid identification documents (e.g., National ID, Driver's License, Passport, Voter's ID) along with picture of yourself.
            </p>

            <div
              className={`flex justify-center rounded-lg border border-dashed border-gray-900/25 px-4 py-8 ${
                dragActive ? "border-indigo-500 bg-indigo-50" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-300" />
                <div className="mt-3 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
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
                      required
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF up to 10MB each</p>
              </div>
            </div>

            {/* File List */}
            {data.identity_proofs.length > 0 && (
              <div className="mt-4 space-y-2">
                {data.identity_proofs.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {errors.identity_proofs && (
              <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.identity_proofs}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Full Width */}
        <div className="md:col-span-3 flex items-center justify-end gap-4">
          <Link href={route("login")} className="text-sm text-gray-600 underline hover:text-gray-900">
            Already registered?
          </Link>

          <PrimaryButton disabled={processing}>
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Register"
            )}
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  )
}

