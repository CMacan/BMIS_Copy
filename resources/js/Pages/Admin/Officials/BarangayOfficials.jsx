import { useState } from "react";
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { UserPlus, Users, Search, Edit, Filter } from "lucide-react";
import AddOfficialModal from "./addOfficialModal"; 
import EditOfficialModal from "./editOfficialModal";


export default function BarangayOfficial({ barangay_official = [] }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedOfficial, setSelectedOfficial] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");

    const handleFilter = (status) => {
    console.log("Filter selected:", status);
    setFilterStatus(status);       
    setShowFilterDropdown(false);    
    };
    
    
    const handleAddOfficial = (newOfficial) => {
        console.log("New official added:", newOfficial);
        setIsAddModalOpen(false); 
    };


    const handleEditClick = (official) => {
        setSelectedOfficial(official);
        setIsEditModalOpen(true);
    };

     // Filter based on search query
     const filteredOfficials = barangay_official.filter(official => {
        const fullName = [
            official.profile?.prof_fname || "",
            official.profile?.prof_mname || "",
            official.profile?.prof_lname || "",
        ].filter(Boolean).join(" ").toLowerCase();
        
        const position = official.bar_off_position?.toLowerCase() || "";
        const profileId = official.prof_id?.toString() || ""; 
        const status = official.bar_off_status || "";

        const statusMatch = filterStatus === "All" || status === filterStatus;
        
        return (
        statusMatch &&
        (
            fullName.includes(searchQuery.toLowerCase()) ||
            position.includes(searchQuery.toLowerCase()) ||
            profileId.includes(searchQuery.toLowerCase()) 
        )
        );
    });


    const hasOfficials = barangay_official.length > 0;
    const showingAll = searchQuery === "";
    const hasSearchResults = filteredOfficials.length > 0;

    return (
        <AdminLayout>
            <Head title="Barangay Officials Management" />
            <div className="container mx-auto py-5 px-8">
                <h2 className="text-2xl font-semibold mt-6 mb-10">Manage Barangay Officials</h2>
               
                {hasOfficials && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                 {/* Search Button */}
                <div className="relative w-full max-w-sm">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                        <input
                            type="search"
                            placeholder="Search officials by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200"
                        />
                </div>
                <div className=" w-full flex items-center justify-end gap-4 mr-5">
                 {/* Filter Button and Dropdown */}
                <div className="relative">
                    <button  onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition"  >
                    <Filter className="w-4 h-4 text-blue-600" />  <span>Filter</span>
                    </button>

                    {/* Dropdown menu */}
                    {showFilterDropdown && (
                    <div className="absolute z-10 right--3 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul className="text-sm text-gray-700">
                        <li  className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilter("All")} >
                            All Officials
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilter("Active")} >
                            Active
                        </li>
                        <li  className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleFilter("Inactive")} >
                            Inactive
                        </li>
                        </ul>
                    </div>
                    )}
                </div>
                 {/* Add Officials Button */}
                <div>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <UserPlus className="w-5 h-5" /> <span>Add Official</span>
                    </button>
                </div> 
                </div> 
            </div> )}

            {/* Officials Table */}
            <div className="overflow-hidden mt-10">
            {hasOfficials ? ( showingAll || hasSearchResults ? (
                        <table className="w-full border-collapse ">
                            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                                 <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <th className="px-10 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                                        Image
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                                        Full Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                                        Position
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                                        Term Start
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                                        Term End
                                        </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOfficials.map((official) => {
                                    // Concatenate full name
                                    const fullName = [
                                        official.profile?.prof_fname || "",
                                        official.profile?.prof_mname || "",
                                        official.profile?.prof_lname || "",
                                    ].filter(Boolean).join(" ");

                                    return (
                                        <tr key={official.id} className="border-b border-gray-200 text-[14px]">
                                            <td className="px-6 py-4 text-sm font-bold text-black-900 border-b border-indigo-100">
                                                  <div className="relative h-16 w-20 overflow-hidden border border-gray-300 rounded-[2px] group-hover:border-indigo-300 transition-colors shadow-sm">
                                                  <img
                                                        src={official.profile?.prof_picture 
                                                            ? `/storage/${official.profile.prof_picture}` 
                                                            : '/images/default-profile.jpg'}
                                                        alt="Profile"
                                                         className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                                                    />
                                                    </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-black-900 border-b border-indigo-100">{fullName || "No Name"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-black-900 border-b border-indigo-100">{official.bar_off_position || "N/A"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-black-900 border-b border-indigo-100">{official.bar_off_term_st || "N/A"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-black-900 border-b border-indigo-100">{official.bar_off_term_end || "N/A"}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-black-900 border-b border-indigo-100"> 
                                                <div className="flex items-center gap-1"> 
                                                    <span className={`inline-block w-2 h-2 rounded-full ${ official.bar_off_status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    <span>{official.bar_off_status || "N/A"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold space-x-2">
                                                <button onClick={() => handleEditClick(official)}  className="inline-flex items-center px-3 py-1.5 bg-indigo-200 text-indigo-700 rounded-md text-xs hover:bg-indigo-200 transition-colors">
                                                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                                    <Search className="h-12 w-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No matching officials found</h3>
                                <p className="text-gray-500 mx-auto max-w-md mb-6">
                                    Your search didn't match any officials.
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                                <Users className="h-12 w-12 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No officials found</h3>
                            <p className="text-gray-500 mx-auto max-w-md mb-6">
                                Your barangay officials list is empty. Add officials to manage the leadership structure of your barangay.
                            </p>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                                <UserPlus size={20} /> Add First Official
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Official Modal */}
            <AddOfficialModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddOfficial}
            />

             {/* Edit Official Modal */}
                        {selectedOfficial && (
                            <EditOfficialModal
                                barangay_official={selectedOfficial}
                                isOpen={isEditModalOpen}
                                onClose={() => {
                                    setIsEditModalOpen(false);
                                    setSelectedOfficial(null);
                                }}
                            />
                        )}
        </AdminLayout>
    );
}
