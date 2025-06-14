import { useForm } from "@inertiajs/react"
import { Transition } from "@headlessui/react"
import PrimaryButton from "@/Components/PrimaryButton"
import PersonalInformationSection from "@/Components/Profile/PersonalInformationSection"
import ContactInformationSection from "@/Components/Profile/ContactInformationSection"
import PersonalDetailsSection from "@/Components/Profile/PersonalDetailsSection"
import ProfilePictureSection from "@/Components/Profile/ProfilePictureSection"
import { useToast } from "@/Contexts/ToastContext"
import { usePage } from "@inertiajs/react"

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = "", profile, user }) {
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    source: "admin",
    // User fields
    email: user.email || "",
    user_contact: user.user_contact || "",

    // Profile fields
    prof_fname: profile.prof_fname || "",
    prof_lname: profile.prof_lname || "",
    prof_mname: profile.prof_mname || "",
    prof_suffix: profile.prof_suffix || "",
    prof_gender: profile.prof_gender || "",
    prof_religion: profile.prof_religion || "",
    prof_cstatus: profile.prof_cstatus || "",
    prof_educattain: profile.prof_educattain || "",
    prof_occupation: profile.prof_occupation || "",
    prof_is_4ps: profile.prof_is_4ps || "",
    prof_birthdate: profile.prof_birthdate || "",
  })

  const showToast = useToast()

  const submit = (e) => {
    e.preventDefault()
    patch(route("profile.update"), {
      onSuccess: () => showToast("Profile updated successfully!", "success"),
      onError: (errors) => {
        console.error("Update failed:", errors); // Log the error for debugging
        showToast(
            errors?.message || "Failed to update profile. Please check the form for errors.",
            "error"
        );
    },
    })
  }

  return (
    <section className={className}>
      <div className="space-y-6">
        {/* Profile Picture Section */}
        <ProfilePictureSection profile={profile} />

        {/* Main Profile Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <header className="mb-6">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            <p className="mt-1 text-sm text-gray-600">Update your account's profile information and email address.</p>
          </header>

          <form onSubmit={submit} className="space-y-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
                <PersonalInformationSection data={data} setData={setData} errors={errors} />
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Contact Information</h3>
                <ContactInformationSection
                  data={data}
                  setData={setData}
                  errors={errors}
                  mustVerifyEmail={mustVerifyEmail}
                  user={user}
                  status={status}
                />
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Personal Details</h3>
                <PersonalDetailsSection data={data} setData={setData} errors={errors} />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <PrimaryButton disabled={processing}>Save Changes</PrimaryButton>

              <Transition
                show={recentlySuccessful}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
              >
                <p className="text-sm text-gray-600">Saved.</p>
              </Transition>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

