import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { User, Lock, Key } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";
import ProfileInfoCard from "@/Components/Profile/ProfileInfoCard";
import UpdateProfileInformationForm from "@/Pages/Profile/Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm";
import { useProfilePicture } from "@/Contexts/ProfilePictureContext";

export default function Account() {
  const { auth } = usePage().props;
  const user = auth.user;
  const profile = auth.user.profile || {};
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <AdminLayout>
      <Head title="Admin Account" />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-2">Manage your admin account information and security settings</p>

        {/* Tabs */}
        <div className="flex gap-4 mt-6 border-b pb-2">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "profile" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === "security" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6 space-y-6">
          {activeTab === "profile" && (
            <ProfileInfoCard
              title="Profile Information"
              subtitle="Update your personal information and email address"
              icon={User}
            >
              <UpdateProfileInformationForm profile={profile} user={user} />
            </ProfileInfoCard>
          )}

          {activeTab === "security" && (
            <ProfileInfoCard
              title="Update Password"
              subtitle="Ensure your account is using a strong password"
              icon={Key}
            >
              <UpdatePasswordForm />
            </ProfileInfoCard>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}