import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import { Link } from "@inertiajs/react" // Import Link from inertia

export default function ContactInformationSection({ data, setData, errors, mustVerifyEmail, user, status }) {
  return (
    <div className="space-y-6">
      <div>
        <InputLabel htmlFor="email" value="Email" />
        <TextInput
          id="email"
          type="email"
          className="mt-1 block w-full"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
          required
          autoComplete="email"
        />
        <InputError className="mt-2" message={errors.email} />
      </div>

      <div>
        <InputLabel htmlFor="user_contact" value="Contact Number" />
        <TextInput
          id="user_contact"
          type="text"
          className="mt-1 block w-full"
          value={data.user_contact || ""}
          onChange={(e) => setData("user_contact", e.target.value)}
        />
        <InputError className="mt-2" message={errors.user_contact} />
      </div>

      {mustVerifyEmail && user.email_verified_at === null && (
        <div>
          <p className="mt-2 text-sm text-gray-800">
            Your email address is unverified.
            <Link
              href={route("verification.send")}
              method="post"
              as="button"
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Click here to re-send the verification email.
            </Link>
          </p>

          {status === "verification-link-sent" && (
            <div className="mt-2 text-sm font-medium text-green-600">
              A new verification link has been sent to your email address.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

