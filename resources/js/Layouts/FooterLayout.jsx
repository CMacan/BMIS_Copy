import { usePage, Link } from "@inertiajs/react"
import React from "react"
import "../../css/footer.css"

export default function Footer() {
     const { barangay } = usePage().props;
  return (
    
    <div className="footer-container  text-white">
        <div className="upper text-white">
        <div className=" px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Office Hours */}
            <div className="mx-auto">
                <h3 className="font-bold text-lg mb-4">Office Hours</h3>
                <div className="space-y-1">
                <p>{barangay?.bar_stday || "Monday"} - {barangay?.bar_endday || "Sunday"}</p>
                <p> {new Date(`1970-01-01T${barangay?.bar_sthour || "07:00"}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}  -  {new Date(`1970-01-01T${barangay?.bar_endhour || "20:00"}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
                </div>
            </div>

            {/* Logo and Tagline */}
            <div className="flex flex-col items-center text-center">
                <img
                src={barangay?.bar_logo ? `/${barangay.bar_logo}` : "/images/officialseal.png"}
                alt="Barangay Seal"
                className="w-24 h-24 mb-2 rounded-full"
                />
                <p className="uppercase text-sm font-medium"> {barangay?.bar_motto || "Lorem Ipsum Dolor Sit"} </p>
            </div>

            {/* More Pages */}
            <div>
                <h3 className="font-bold text-lg mb-4 ml-20">More Pages</h3>
                <div className="grid grid-cols-2 gap-2 ">
                <div className="space-y-2">
                    <Link href="/" className="block hover:text-gray-300">
                    Home
                    </Link>
                    <Link  href="/about" className="block hover:text-gray-300">
                    About Us
                    </Link>
                </div>
                <div className="space-y-2">
                    <Link href="/services" className="block hover:text-gray-300">
                    Services
                    </Link>
                    <Link href="/announcements" className="block hover:text-gray-300">
                    Announcements
                    </Link>
                </div>
                </div>
            </div>
            </div>
            </div>
            {/* Copyright */}
            <div className="copyright-container bg-black mt-8 pt-4 border-t border-gray-800 text-center text-sm">
            <p>© {new Date().getFullYear()} | COPYRIGHT : BARANGAY {barangay?.bar_name?.toUpperCase() || " LEROMITSOM"}  </p>
         
                   
         
            </div>
        </div>
    </div>  
  )
}

