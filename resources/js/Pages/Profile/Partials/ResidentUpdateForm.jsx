"use client"

import { useForm } from "@inertiajs/react"
import { Transition } from "@headlessui/react"
import PrimaryButton from "@/Components/PrimaryButton"
import { useToast } from "@/Contexts/ToastContext"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"

export default function ResidentUpdateForm({ status, className = "", profile, user, onSuccess }) {
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    source: "profile",
    // User fields
    email: user.email || "",
    user_contact: user.user_contact || "",

    // Profile fields
    prof_mname: profile.prof_mname || "",
    prof_suffix: profile.prof_suffix || "",
    prof_religion: profile.prof_religion || "",
    prof_educattain: profile.prof_educattain || "",
    prof_occupation: profile.prof_occupation || "",
    prof_is_4ps: profile.prof_is_4ps ?? false,
  })

  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile on initial render and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on mount
    checkIfMobile()

    // Add resize listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const showToast = useToast()

  const submit = (e) => {
    e.preventDefault()
    post(route("profile.update.resident"), {
        onSuccess: () => {
            showToast("Profile updated successfully!", "success")
            if (typeof onSuccess === "function") {
              onSuccess(); // Trigger the reload function
            }
          },
      onError: (errors) => {
        console.error("Update failed:", errors) // Log the error for debugging
        showToast(
          errors?.message || "Failed to update profile. Please check the form for errors.",
          "error"
        )
      },
    })
  }

  return (
    <section className={`${className} max-h-[70vh] md:max-h-none overflow-y-auto md:overflow-visible`}>
      <div className="space-y-4 md:space-y-6">
        <div className="bg-white rounded-xl shadow-sm">
          <header className="mb-4 md:mb-6 border-b pb-4 px-4 pt-4 md:px-6 md:pt-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            <p className="mt-1 text-sm text-gray-600">Update your account's profile information.</p>
          </header>

          <form onSubmit={submit} className="px-4 pb-3 md:px-6">
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">
                    <Check className="w-4 h-4" />
                  </span>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="user_contact" className="block text-sm font-medium text-gray-700">
                      Contact Number
                    </label>
                    <input
                      id="user_contact"
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
                      value={data.user_contact || ""}
                      onChange={(e) => setData("user_contact", e.target.value)}
                    />
                    {errors.user_contact && <p className="mt-2 text-sm text-red-600">{errors.user_contact}</p>}
                  </div>
                </div>
              </div>

              {/* Additional Profile Information */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2">
                    <Check className="w-4 h-4" />
                  </span>
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="prof_mname" className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                      id="prof_mname"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
                      value={data.prof_mname || ""}
                      onChange={(e) => setData("prof_mname", e.target.value)}
                    />
                    {errors.prof_mname && <p className="mt-2 text-sm text-red-600">{errors.prof_mname}</p>}
                  </div>

                  <div>
                    <label htmlFor="prof_suffix" className="block text-sm font-medium text-gray-700">
                      Suffix
                    </label>
                    <select
                      id="prof_suffix"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
                      value={data.prof_suffix || ""}
                      onChange={(e) => setData("prof_suffix", e.target.value)}
                    >
                      <option value="">Select Suffix</option>
                      <option value="Jr.">Jr.</option>
                      <option value="Sr.">Sr.</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                      <option value="V">V</option>
                    </select>
                    {errors.prof_suffix && <p className="mt-2 text-sm text-red-600">{errors.prof_suffix}</p>}
                  </div>

                  <div>
                    <label htmlFor="prof_religion" className="block text-sm font-medium text-gray-700">
                      Religion
                    </label>
                    <select
                      id="prof_religion"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
                      value={data.prof_religion || ""}
                      onChange={(e) => setData("prof_religion", e.target.value)}
                    >
                      <option value="">Select Religion</option>
                      <option value="Roman Catholic">Roman Catholic</option>
                      <option value="Iglesia ni Cristo">Iglesia ni Cristo</option>
                      <option value="Protestant">Protestant</option>
                      <option value="Islam">Islam</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Born Again">Born Again</option>
                      <option value="Jehovah's Witnesses">Jehovah's Witnesses</option>
                      <option value="Seventh-day Adventist">Seventh-day Adventist</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.prof_religion && <p className="mt-2 text-sm text-red-600">{errors.prof_religion}</p>}
                  </div>

                  <div>
                    <label htmlFor="prof_educattain" className="block text-sm font-medium text-gray-700">
                      Educational Attainment
                    </label>
                    <select
                      id="prof_educattain"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
                      value={data.prof_educattain || ""}
                      onChange={(e) => setData("prof_educattain", e.target.value)}
                    >
                      <option value="">Select Educational Attainment</option>
                      <option value="elementary">Elementary</option>
                      <option value="high school">High School</option>
                      <option value="college">College</option>
                      <option value="vocational">Vocational</option>
                      <option value="post graduate">Post Graduate</option>
                    </select>
                    {errors.prof_educattain && <p className="mt-2 text-sm text-red-600">{errors.prof_educattain}</p>}
                  </div>

                  <div>
                    <label htmlFor="prof_occupation" className="block text-sm font-medium text-gray-700">
                      Occupation
                    </label>
                    <input
                      id="prof_occupation"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
                      value={data.prof_occupation || ""}
                      onChange={(e) => setData("prof_occupation", e.target.value)}
                    />
                    {errors.prof_occupation && <p className="mt-2 text-sm text-red-600">{errors.prof_occupation}</p>}
                  </div>

                  {/* <div>
                    <label htmlFor="prof_is_4ps" className="block text-sm font-medium text-gray-700">
                        Are you a 4ps member?
                    </label>
                    <input
                        id="prof_is_4ps"
                        type="checkbox"
                        className="mt-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={data.prof_is_4ps} // Bind the checkbox to the `prof_is_4ps` value
                        onChange={(e) => setData("prof_is_4ps", e.target.checked)} // Update the value on change
                    />
                    {errors.prof_is_4ps && <p className="mt-2 text-sm text-red-600">{errors.prof_is_4ps}</p>}
                  </div> */}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 mt-6 border-t">
              <PrimaryButton disabled={processing} className="w-full sm:w-auto">
                {processing ? "Saving..." : "Save Changes"}
              </PrimaryButton>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Changes saved successfully!
                </p>
              </Transition>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
