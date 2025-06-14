import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Contexts/ToastContext"
import ToggleSwitch from "@/Components/ToggleSwitch";
import SearchableSelect from "@/Components/SearchableSelect";




export default function AddOfficialModal({ barangay_official, isOpen, onClose }) {
  if (!isOpen) return null;

  const { data, setData, post, processing } = useForm({
    prof_id: "",
    bar_off_position: "",
    bar_off_term_st: "",
    bar_off_term_end: "",
    bar_off_status: "Inactive",
  });

 
  const positionOptions = ["Captain", "Councilor", "Secretary", "Treasurer"];
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  useEffect(() => {
      fetch("/admin/profiles")
        .then((response) => response.json())
        .then((data) => setProfiles(data));
    }, []);


  const showToast = useToast()
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.prof_id) {
      alert("Please select a profile!");
      return;
    }
    post(route("barangay-officials.store"), {
      preserveScroll: true,
      onSuccess: () => {
        showToast("Official added successfully!", "success");
        onClose(); 
      },
      onError: () => showToast("Failed to add Official.", "error"),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md min-w-[400px]">
        <h2 className="text-lg font-bold text-center mb-4">Add New Official</h2>
        <hr className="mb-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
       {/* Profile ID or Name Search */}
        <div className="relative">   
         <div className="flex items-center justify-between"><label className="block text-sm font-medium">Search Profile</label>{!selectedProfile && <p className="text-[12px]  mr-2 text-red-500 mt-1">Please select a valid profile.</p>}</div> 
          <div className="relative"> {/* Container that prevents expansion */}
          <div className="absolute top-full left-0 right-0 max-h-80 min-h-20 overflow-hidden"> 
                <SearchableSelect
                profiles={profiles}
                selectedProfile={selectedProfile}
                setSelectedProfile={(profile) => {
                setSelectedProfile(profile);
                setData("prof_id", profile?.id || ""); }} 
                />
          </div> 
          </div> 
        </div>

          <div className="pt-[45px]" >
            <label className="block text-sm font-medium">Position</label>
            <select
              value={data.bar_off_position}
              onChange={(e) => setData("bar_off_position", e.target.value)}
              className="w-full p-2 border rounded-lg" required
            >
              <option value="" disabled className="text-gray-400">
                Select position
              </option>
              {positionOptions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

        
          <div>
            <label className="block text-sm font-medium">Term Start</label>
            <input
              type="date"
              value={data.bar_off_term_st}
              onChange={(e) => setData("bar_off_term_st", e.target.value)}
              className="w-full p-2 border rounded-lg" required
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium">Term End</label>
            <input
              type="date"
              value={data.bar_off_term_end}
              onChange={(e) => setData("bar_off_term_end", e.target.value.toString())}
              className="w-full p-2 border rounded-lg" required
            />
          </div>

     
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  data.bar_off_status === "Active" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {data.bar_off_status}
            </label>
            
            <ToggleSwitch
              isChecked={data.bar_off_status === "Active"} 
              onChange={(checked) => setData("bar_off_status", checked ? "Active" : "Inactive")}
            />
          </div>


          {/* Submit & Cancel Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              disabled={processing}
            >
              {processing ? "Saving..." : "Add Official"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
