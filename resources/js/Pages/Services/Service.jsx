import { Link } from "@inertiajs/react"
import HeaderLayout from "@/Layouts/HeaderLayout"
import Landingbg from "../../Layouts/landingbg";
import Footer from "@/Layouts/FooterLayout"
import ContactInfo from "@/Components/ContactInfo"
import { FileText, Ticket } from 'lucide-react'

export default function Service() {
  return (
    <HeaderLayout>
      {/* Hero Section */}
      <Landingbg height="min-h-[40vh]" />
      <div className="min-h-screen bg-[#E6EEF9] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-2">Online Services</h1>
            <p className="text-gray-600">Barangay Certification, Barangay Clearance</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Clearance Card - Updated href to profile-verification */}
            <Link
              href="/profile-verification"
              className="bg-[#002366] rounded-lg p-8 text-center transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Clearance</h3>
                <p className="text-white/80 text-sm">Request</p>
              </div>
            </Link>

            {/* Ticket Card - Fixed href to match route */}
            <Link
              href="/ticket-check"
              className="bg-[#002366] rounded-lg p-8 text-center transition-transform hover:scale-105"
            >
              <div className="flex flex-col items-center">
                <div className="bg-white/10 p-4 rounded-full mb-4">
                  <Ticket className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ticket</h3>
                <p className="text-white/80 text-sm">Check</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <ContactInfo />
      <Footer />
    </HeaderLayout>
  )
}
