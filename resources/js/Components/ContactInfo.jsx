import { Facebook, Mail, MapPin, Phone, ExternalLink, Smartphone } from "lucide-react"
import { useEffect, useState } from "react"
import { usePage } from "@inertiajs/react"


export default function ContactInfo() {
  const [mounted, setMounted] = useState(false)
  const { barangay } = usePage().props;


  const colors = {
      blue: "#1e40af",
      lightBlue: "#3b82f6",
      red: "#dc2626",
      lightRed: "#ef4444",
      yellow: "#eab308",
      lightYellow: "#facc15",
      white: "#ffffff",
      offWhite: "#f8fafc",
    }

  useEffect(() => {
    setMounted(true)
  }, [])

  const contactInfo = {
    facebook: barangay?.bar_fb_link || "https://facebook.com/leromitsom",
    location: barangay?.bar_location || "Leromitsom, Lorem City",
    email: barangay?.bar_email || "leromitsom@gmail.com",
    phone: barangay?.bar_contact || "09123456789",
    mapLocation: barangay?.bar_gmaplink || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16013028.102170127!2d111.90151866202028!3d11.520931175388483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x324053215f87de63%3A0x784790ef7a29da57!2sPhilippines!5e0!3m2!1sen!2sph!4v1742287350426!5m2!1sen!2sph",
  }


  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Aesthetic Background Design with new color theme */}

      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#111827] to-[#1f2937]" />

        {/* Decorative elements with new colors */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#3b82f6] opacity-10 rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#facc15] opacity-10 rounded-tr-full" />

      {/* Top Left */}
<div className="absolute top-[3%] left-[8%] opacity-10">
  <Phone size={90} color="#facc15" strokeWidth={1} />
</div>

{/* Slightly Lower Left */}
<div className="absolute top-[10%] left-[15%] opacity-10 transform rotate-3">
  <Smartphone size={110} color="#3b82f6" strokeWidth={1} />
</div>

{/* Top Right */}
<div className="absolute top-[12%] right-[5%] opacity-10 transform rotate-6">
  <Mail size={100} color="#facc15" strokeWidth={1} />
</div>

{/* Middle Center */}
<div className="absolute top-[52%] left-[40%] opacity-10 transform rotate-12">
  <Phone size={95} color="#facc15" strokeWidth={1} />
</div>

{/* Middle Right */}
<div className="absolute bottom-[5%] right-[30%] opacity-10 transform -rotate-12">
  <Smartphone size={100} color="#3b82f6" strokeWidth={1} />
</div>

{/* Bottom Left */}
<div className="absolute bottom-[12%] left-[10%] opacity-10 transform rotate-3">
  <Mail size={90} color="#facc15" strokeWidth={1} />
</div>

{/* Bottom Center */}
<div className="absolute bottom-[18%] left-[45%] opacity-10 transform -rotate-6">
  <Facebook size={80} color="#3b82f6" strokeWidth={1} />
</div>

{/* Bottom Right */}
<div className="absolute bottom-[5%] right-[5%] opacity-10 transform rotate-6">
  <Phone size={95} color="#facc15" strokeWidth={1} />
</div>

{/* Extra Random Placements */}
<div className="absolute bottom-[10%] left-[25%] opacity-10 transform -rotate-6">
  <MapPin size={85} color="#3b82f6" strokeWidth={1} />
</div>

<div className="absolute bottom-[32%] right-[22%] opacity-10 transform rotate-6">
  <Mail size={80} color="#facc15" strokeWidth={1} />
</div>

<div className="absolute top-[20%] left-[50%] opacity-10 transform rotate-12">
  <Facebook size={90} color="#3b82f6" strokeWidth={1} />
</div>

<div className="absolute bottom-[25%] right-[35%] opacity-10 transform -rotate-3">
  <Phone size={85} color="#facc15" strokeWidth={1} />
</div>

<div className="absolute bottom-[60%] left-[30%] opacity-10 transform rotate-6">
  <Smartphone size={95} color="#3b82f6" strokeWidth={1} />
</div>

<div className="absolute bottom-[50%] right-[15%] opacity-10 transform -rotate-6">
  <Mail size={100} color="#facc15" strokeWidth={1} />
</div>


        {/* Animated floating elements with new colors */}
        {mounted && (
          <>
            <div className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-[#ef4444]/10 blur-2xl animate-float-slow" />
            <div className="absolute top-[40%] right-[10%] w-80 h-80 rounded-full bg-[#3b82f6]/10 blur-2xl animate-float-medium" />
            <div className="absolute bottom-[15%] left-[25%] w-72 h-72 rounded-full bg-[#facc15]/10 blur-2xl animate-float-fast" />
          </>
        )}

        {/* Diagonal stripes with theme colors */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-0 left-0 w-full h-12 bg-[#dc2626] transform -skew-y-6" />
          <div className="absolute top-20 left-0 w-full h-8 bg-[#3b82f6] transform -skew-y-6" />
          <div className="absolute top-36 left-0 w-full h-6 bg-[#facc15] transform -skew-y-6" />
        </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-20 py-20">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Contact Information */}
                <div className="w-full md:w-1/3">
                  <div className="bg-white shadow-lg rounded-xl p-10 h-[450px]">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">You may reach us through</h2>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-200 p-3 rounded-full shadow-md">
                          <Facebook className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Facebook</p>
                          <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                           {barangay?.bar_fbname || "Leromitsom Hub"}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-blue-200  p-3 rounded-full shadow-md">
                          <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Email</p>
                          <a href={`mailto:${contactInfo.email}`} className="font-medium text-gray-800 hover:text-blue-600 transition-colors">
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-blue-200 p-3 rounded-full shadow-md">
                          <Phone className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Phone</p>
                          <a
                            href={`tel:${contactInfo?.phone?.replace(/\s+/g, "") || ""}`}
                            className="font-medium text-gray-800 hover:text-blue-600 transition-colors"
                          >
                            {contactInfo?.phone || "No phone available"}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="bg-blue-200  p-3 rounded-full shadow-md">
                          <MapPin className="h-6 w-6  text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Location</p>
                          <p className="font-medium text-gray-800 ">{contactInfo.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                 {/* Right Column - Map */}
                 <div className="w-full md:w-2/3">
                  <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                  <iframe
                      src={contactInfo.mapLocation}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Location Map"
                      className="w-full"
                    />
                  </div>
                </div>

              </div>
            </div>
                </div>
   )
 }


