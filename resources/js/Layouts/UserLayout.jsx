import { UserSidebar } from "@/Components/User/UserSidebar"
import { Header } from "@/Components/User/Header"
import { ProfilePictureProvider } from "@/Contexts/ProfilePictureContext"
import { NotificationProvider } from "@/Contexts/NotificationContext";
import { usePage } from "@inertiajs/react"

export default function UserLayout({ children }) {
  const { auth } = usePage().props;
  const profile = auth.user.profile || {};
  const initialProfilePicture = profile.prof_picture 
    ? `/storage/${profile.prof_picture}`
    : '/default-avatar.png';

  return (
    <NotificationProvider>
    <ProfilePictureProvider initialProfilePicture={initialProfilePicture}>
      <div className="flex h-screen bg-gray-100">
        <UserSidebar />
        <div className="flex-1 flex flex-col ml-18">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 mt-12">{children}</main>
        </div>
      </div>
    </ProfilePictureProvider>
    </NotificationProvider>
  )
}

