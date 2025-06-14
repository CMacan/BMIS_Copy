"use client"

import { useState } from "react"
import { usePage, router, Head } from "@inertiajs/react"
import UserLayout from "@/Layouts/UserLayout"
import ErrorModal from "@/components/forms/error-modal"
import FormCard from "@/components/forms/form-card"
import SearchFilter from "@/components/forms/search-filter"
import RegistrationOptions from "@/components/User/RegistrationOptions"
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function Forms() {
  const { auth, forms, submissions } = usePage().props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const [showOptions, setShowOptions] = useState(false)
  const [selectedForm, setSelectedForm] = useState(null)
  const [expandedForms, setExpandedForms] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const profile = auth.user.profile
  const isVerified = profile?.prof_is_verified ?? false
  const isHouseHead = profile?.prof_is_house_head ?? false

  const categories = ["All", ...new Set(forms.map((form) => form.category))]

   const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        icon: <Clock className="h-4 w-4" />,
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      declined: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: <XCircle className="h-4 w-4" />,
      },
    };
    const config = statusConfig[status?.toLowerCase()] || {};

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.icon && <span className="mr-1">{config.icon}</span>}
        {status?.toUpperCase() || "NOT APPLIED"}
      </span>
    );
  };
   // Get button text and style based on status
  const getButtonConfig = (form, formId) => {
    const submission = submissions?.[formId];
    const status = submission?.status?.toLowerCase();
    
    if (!isVerified) {
      return {
        text: "Not Verified",
        disabled: true,
        className: "bg-gray-300 text-gray-600 cursor-not-allowed",
      };
    }

    switch (status) {
      case 'pending':
        return {
          text: "Pending",
          disabled: true,
          className: "bg-amber-100 text-amber-800 cursor-not-allowed",
        };
      case 'approved':
        return {
          text: "View Programs",
          disabled: false,
          className: "bg-green-600 hover:bg-green-700 text-white",
         
        };
      case 'declined':
        return {
          text: "Re-apply",
          disabled: false,
          className: "bg-red-600 hover:bg-red-700 text-white",
          onClick: () => router.visit(window.route("forms.show", { id: formId })),
        };
      default:
        return {
          text: "Apply Now",
          disabled: false,
          className: "bg-indigo-600 hover:bg-indigo-700 text-white",
          onClick: () => handleFormSelect(form),
        };
    }
  };

  const handleErrorClick = (message) => {
    setModalMessage(message)
    setIsModalOpen(true)
  }

  const handleOptionSelect = (option) => {
    if (selectedForm) {
      router.visit(`/LGBT/${option}`)
    }
    setShowOptions(false)
  }

  const handleFormSelect = (form) => {
    const age = profile?.prof_age ?? 0
    const gender = profile?.prof_gender

    if (
      (form.name === "WOMEN INTAKE FORM" && age >= 60) ||
      (form.name === "WOMEN INTAKE FORM" && gender !== "female")
    ) {
      handleErrorClick("You are not eligible to apply for the Women's Intake Form.")
      return
    }

    if (form.name === "CHILDREN INTAKE FORM" && age >= 18) {
      handleErrorClick("You are not eligible to apply for the Children's Intake Form.")
      return
    }

    if (isVerified) {
      setSelectedForm(form)
      if (isHouseHead) {
        setShowOptions(true)
      } else {
        router.visit(window.route("forms.show", { id: form.id }))
      }
    } else if (!isVerified) {
      handleErrorClick("Your profile needs to be verified before you can apply.")
    } else {
      handleErrorClick("You have a pending application. Please wait for verification.")
    }
  }

  const toggleFormExpansion = (formId) => {
    setExpandedForms((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(formId)) {
        newSet.delete(formId)
      } else {
        newSet.add(formId)
      }
      return newSet
    })
  }

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || form.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <UserLayout>
      <Head>
        <title>Forms</title>
      </Head>

      <div className="px-4 sm:px-6 lg:px-8 py-8  min-h-screen">
        {/* Enhanced Page Header with more visual appeal */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Attractive header with gradient background */}
            <div className="bg-gradient-to-r from-gray-900 to-black px-8 py-6 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-20 -mb-20"></div>

              <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white mb-2">Sectoral Forms</h1>
                <p className="text-indigo-100 max-w-2xl">
                  Select the appropriate form to begin your application process.
                </p>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="px-8 py-6 border-b border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Easy Application</h3>
                    <p className="text-sm text-slate-600">Simple forms designed for quick completion</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Secure Process</h3>
                    <p className="text-sm text-slate-600">Your information is protected and confidential</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">Fast Verification</h3>
                    <p className="text-sm text-slate-600">Quick review and approval of your application</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mt-8">
            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          </div> */}
        </div>

        {showOptions ? (
          <RegistrationOptions onSelect={handleOptionSelect} selectedForm={selectedForm} />
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Category Pills */}
            <div className="mb-6 overflow-x-auto pb-2">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredForms.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-xl font-medium text-slate-800 mb-2">No forms found</p>
                <p className="text-slate-500 max-w-md mx-auto">
                  No forms match your search criteria. Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                {filteredForms.map((form) => {
                  const submission = submissions?.[form.id];
                  const buttonConfig = getButtonConfig(form, form.id);
                  const status = submission?.status;

                  return (
                    <FormCard
                      key={form.id}
                      id={`form-${form.id}`}
                      image={form.image}
                      title={form.name}
                      description={form.description}
                      category={form.category}
                      details={form.addtl_detail}
                      eligibility={form.requirements.map((req) => req.requirement)}
                      statusBadge={getStatusBadge(status)}
                      buttonText={buttonConfig.text}
                      buttonClassName={buttonConfig.className}
                      disabled={buttonConfig.disabled}
                      onClick={buttonConfig.onClick || (() => handleFormSelect(form))}
                      isExpanded={expandedForms.has(form.id)}
                      onToggleExpand={() => toggleFormExpansion(form.id)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <ErrorModal isOpen={isModalOpen} message={modalMessage} onClose={() => setIsModalOpen(false)} />
    </UserLayout>
  )
}

