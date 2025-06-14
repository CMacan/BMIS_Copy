import { useForm, usePage, Head } from "@inertiajs/react";
import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext"
import { MapPin, Clock, Phone } from "lucide-react";
import BarangayLogoSection from "@/Components/Admin/BarangayLogoSection"

export default function BarangayDetails({ barangay }) {
    const { flash } = usePage().props;
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState({});
    
    const { data, setData, patch, processing } = useForm({
            bar_name: barangay?.bar_name || "Leromitsom",
            municipal_or_city: barangay?.municipal_or_city || "Lorem City",
            bar_prov: barangay?.bar_prov || "Lorem",
            bar_location: barangay?.bar_location || "Leromitsom, Lorem City",
            bar_gmaplink: barangay?.bar_gmaplink || "https://maps.google.com/",
            bar_contact: barangay?.bar_contact || "09123456789",
            bar_email: barangay?.bar_email || "leromitsom@gmail.com",
            bar_fbname: barangay?.bar_fbname || "Leromitsom Hub",
            bar_fb_link: barangay?.bar_fb_link || "https://facebook.com/leromitsom",
            bar_stday: barangay?.bar_stday || "Monday",
            bar_endday: barangay?.bar_endday || "Sunday",
            bar_sthour: barangay?.bar_sthour || "08:00:00",
            bar_endhour: barangay?.bar_endhour || "17:00:00",
            bar_motto: barangay?.bar_motto || "Lorem Ipsum Dolor Sit",
            bar_systname: barangay?.bar_systname || "Leromitsmo-GOV",
            bar_vision: barangay?.bar_vision || "A lorem and lorem community",
            bar_mission: barangay?.bar_mission || "To provide lorem service to residents",
            bar_value: barangay?.bar_value || "Lorem, Ipsum, Dolor",
    });

    
    const showToast = useToast()


    const validateForm = () => {
        let newErrors = {};
        Object.keys(data).forEach((key) => {
            if (!data[key]) {
                newErrors[key] = "This field is required";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      patch(route("admin.update"), {
          preserveScroll: true,
          onSuccess: () => showToast("Profile updated successfully!", "success"),
          onError: () => showToast("Failed to update profile.", "error"),
         })
         
  };

    return (
        <AdminLayout>
            <Head title="Details" />
            <div className="container mx-auto py-5">
            <h2 className="text-2xl font-semibold mt-4 mb-1 ml-10">Barangay Details</h2>
            <p className="text-sm ml-10 mb-4">Manage Barangay Information Details</p>

                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-500 text-white p-3 rounded mb-4">
                        {flash.success}
                    </div>
                )}

                {/* Barangay Info Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8 max-w-[95%]  mx-auto">
                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-2">
                            <MapPin className="mr-2" />
                            <h2 className="text-lg font-semibold">Address</h2>
                        </div>
                        <p> {barangay?.bar_location || "Leromitsom, Lorem City"}</p>
                    </div>

                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-2">
                            <Clock className="mr-2" />
                            <h2 className="text-lg font-semibold">Office Hours</h2>
                        </div>
                        <p>{barangay?.bar_stday && barangay?.bar_endday ? `${barangay.bar_stday} - ${barangay.bar_endday}` : "Monday - Sunday"}</p>
                        <p> {barangay?.bar_sthour && barangay?.bar_endhour  ? `${new Date(`1970-01-01T${barangay.bar_sthour}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} - 
                            ${new Date(`1970-01-01T${barangay.bar_endhour}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`  : "7:00AM - 8:00PM"}  </p>

                    </div>

                    <div className="p-6 bg-white shadow-lg rounded-lg">
                        <div className="flex items-center mb-2">
                            <Phone className="mr-2" />
                            <h2 className="text-lg font-semibold">Contact Information</h2>
                        </div>
                        <div>
                        <p>Phone:    {barangay?.bar_contact || "09123456789"}</p>
                        <p>Email:    {barangay?.bar_email || "leromitsom@gmail.com"}</p>
                        {/* <p>Facebook: {barangay?.bar_fbname || "Leromitsom Hub"}</p> */}
                        </div>
                    </div>
                </div>

                {/* Form to Update Barangay Details */}
                <div className="p-6 bg-white shadow-lg rounded-lg">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-2lg border-2">
                    
                       {/* Barangay Logo */}
                        <BarangayLogoSection barangay={barangay} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                            <div>
                                <label className="block text-sm font-medium">Barangay</label>
                                <input type="text" className="w-full border p-2 rounded" value={data.bar_name} onChange={(e) => setData("bar_name", e.target.value)} disabled={!isEditing} />
                                {errors.bar_name && <p className="text-red-500 text-sm">{errors.bar_name}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium">Province</label>
                                <input type="text" className="w-full border p-2 rounded" value={data.bar_prov} onChange={(e) => setData("bar_prov", e.target.value)} disabled={!isEditing}/>
                                {errors.bar_prov && <p className="text-red-500 text-sm">{errors.bar_prov}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Municipal/City</label>
                                <input type="text" className="w-full border p-2 rounded" value={data.municipal_or_city} onChange={(e) => setData("municipal_or_city", e.target.value)} disabled={!isEditing}/>
                                {errors.municipal_or_city && <p className="text-red-500 text-sm">{errors.municipal_or_city}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={data.bar_location}
                                    onChange={(e) => setData("bar_location", e.target.value)}
                                    disabled={!isEditing}
                                />
                                {errors.bar_location && <p className="text-red-500 text-sm">{errors.bar_location}</p>}

                                <label className="block text-sm font-medium mt-2">Embed a Map Link</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={data.bar_gmaplink}
                                        onChange={(e) => {
                                            const inputValue = e.target.value;
                                            let extractedSrc = inputValue;

                                            // Extract only the src attribute if the user inputs an iframe
                                            const match = inputValue.match(/<iframe[^>]+src="([^"]+)"/);
                                            if (match) {
                                                extractedSrc = match[1]; // Get only the src attribute
                                            }

                                            setData("bar_gmaplink", extractedSrc);
                                        }}
                                        disabled={!isEditing}
                                    />
                                    {errors.bar_gmaplink && <p className="text-red-500 text-sm">{errors.bar_gmaplink}</p>}
                            </div>


                            
                            </div>

                        <h3 className="text-base font-semibold mt-10 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium">Contact Number</label>
                                <input type="text" className="w-full border p-2 rounded" value={data.bar_contact} onChange={(e) => setData("bar_contact", e.target.value)} disabled={!isEditing}/>
                                {errors.bar_contact && <p className="text-red-500 text-sm">{errors.bar_contact}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input type="email" className="w-full border p-2 rounded" value={data.bar_email} onChange={(e) => setData("bar_email", e.target.value)} disabled={!isEditing}/>
                                {errors.bar_email && <p className="text-red-500 text-sm">{errors.bar_email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Facebook Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={data.bar_fbname} onChange={(e) => setData("bar_fbname", e.target.value)} disabled={!isEditing} />
                                {errors.bar_fbname && <p className="text-red-500 text-sm">{errors.bar_fbname}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Facebook Link</label>
                                <input type="text" className="w-full border p-2 rounded" value={data.bar_fb_link} onChange={(e) => setData("bar_fb_link", e.target.value)} disabled={!isEditing} />
                                {errors.bar_fb_link && <p className="text-red-500 text-sm">{errors.bar_fb_link}</p>}
                            </div>
                         </div>


                         <h3 className="text-base font-semibold mt-10 mb-4">Office Hours</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium">Start Day</label>
                              <select type= "text" className="w-full border p-2 rounded"  value={data.bar_stday}  onChange={(e) => setData("bar_stday", e.target.value)} disabled={!isEditing}  >
                                <option value="" disabled>Select End Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                              </select>
                            </div>
                       

                            <div>
                              <label className="block text-sm font-medium">End Day</label>
                              <select type= "text" className="w-full border p-2 rounded"  value={data.bar_endday}  onChange={(e) => setData("bar_endday", e.target.value)} disabled={!isEditing}  >
                                <option value="" disabled>Select End Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                              </select>
                            </div>
                           <div>
                                <label className="block text-sm font-medium">Open Hours</label>
                                <input type="time" className="w-full border p-2 rounded" value={data.bar_sthour} onChange={(e) => setData("bar_sthour", e.target.value)} disabled={!isEditing} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Close Hours</label>
                                <input type="time" className="w-full border p-2 rounded" value={data.bar_endhour} onChange={(e) => setData("bar_endhour", e.target.value)} disabled={!isEditing} />
                            </div>
                         </div>
                      
                         <h3 className="text-base font-semibold mt-10 mb-4">Other Information</h3>
                         <div className="grid gap-6">
                            <div>
                                <label className="block text-sm font-medium">System Name</label>
                                <input type="text" className="w-full border p-2 rounded" value={data.bar_systname} onChange={(e) => setData("bar_systname", e.target.value)} disabled={!isEditing} />
                                {errors.bar_systname && <p className="text-red-500 text-sm">{errors.bar_systname}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Barangay Motto</label>
                                <textarea type="text" className="w-full border p-2 rounded" value={data.bar_motto} onChange={(e) => setData("bar_motto", e.target.value)} disabled={!isEditing} />
                                {errors.bar_motto && <p className="text-red-500 text-sm">{errors.bar_motto}</p>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium">Vision</label>
                                <textarea type="text" className="w-full border p-2 rounded" value={data.bar_vision} onChange={(e) => setData("bar_vision", e.target.value)} disabled={!isEditing} />
                                {errors.bar_vision && <p className="text-red-500 text-sm">{errors.bar_vision}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Mission</label>
                                <textarea type="text" className="w-full border p-2 rounded" value={data.bar_mission} onChange={(e) => setData("bar_mission", e.target.value)} disabled={!isEditing} />
                                {errors.bar_mission && <p className="text-red-500 text-sm">{errors.bar_mission}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Core Values </label>
                                <textarea type="text" className="w-full border p-2 rounded" value={data.bar_value} onChange={(e) => setData("bar_value", e.target.value)} disabled={!isEditing} />
                                {errors.bar_value && <p className="text-red-500 text-sm">{errors.bar_value}</p>}
                            </div>
                         </div>


                    <div className="my-5">
                        {!isEditing ? (
                            <button
                                className="bg-blue-500 text-white px-5 py-2 rounded" onClick={() => setIsEditing(true)} >
                                Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsEditing(false)} >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-900 text-white px-4 py-2 rounded" disabled={processing} >
                                    {processing ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </div>
                </form>
                </div>
            </div>
        </AdminLayout>
    );
}
