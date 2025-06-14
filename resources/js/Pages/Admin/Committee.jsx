import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import SearchableSelect from "@/Components/SearchableSelect";
import { Plus, Users, UserPlus, MoreVertical } from "lucide-react";
import axios from "axios";

export default function Committee({ committees, members }) {
  const [showCommitteeForm, setShowCommitteeForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [message, setMessage] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [editCommittee, setEditCommittee] = useState(null);
  const [formData, setFormData] = useState({ com_name: "", com_description: "" });

  const handleDelete = async (committeeId) => {
    if (!window.confirm("Are you sure you want to delete this committee?")) return;
  
    try {
      await axios.delete(`/admin/committees/${committeeId}`);
      alert("Committee deleted successfully.");
      // Refresh or update state to remove the deleted committee
    } catch (error) {
      console.error("Failed to delete committee", error);
      alert("Failed to delete committee.");
    }
  };

  const handleEditClick = (committee) => {
    setEditCommittee(committee);
    setFormData({ com_name: committee.com_name, com_description: committee.com_description });
    setOpenMenu(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/admin/committees/${editCommittee.id}`, formData);
      alert("Committee updated successfully.");
      setEditCommittee(null);
    } catch (error) {
      console.error("Failed to update committee", error);
      alert("Failed to update committee.");
    }
  };
  const {
    data: committeeData,
    setData: setCommitteeData,
    post: postCommittee,
    reset: resetCommittee,
  } = useForm({
    com_name: "",
    com_description: "",
  });

  const {
    data: memberData,
    setData: setMemberData,
    post: postMember,
    reset: resetMember,
  } = useForm({
    member_role: "",
    user_id: selectedProfile ? selectedProfile.id : "",
    com_id: selectedCommittee ? selectedCommittee.id : "",
  });

  useEffect(() => {
    fetch("/admin/profiles")
      .then((response) => response.json())
      .then((data) => setProfiles(data));
  }, []);

  useEffect(() => {
    if (selectedCommittee) {
      fetch(`/admin/committees/${selectedCommittee.id}/members`)
        .then((response) => response.json())
        .then((data) => setCommitteeMembers(data));
    }
  }, [selectedCommittee]);

  const submitCommittee = (e) => {
    e.preventDefault();
    postCommittee("/admin/committees", {
      onSuccess: () => {
        resetCommittee();
        setShowCommitteeForm(false);
        setMessage({ type: "success", text: "Committee created successfully." });
      },
      onError: () => {
        setMessage({ type: "error", text: "Failed to create committee." });
      },
    });
  };

  const submitMember = async (e) => {
    e.preventDefault();
    if (!selectedProfile) {
      setMessage({ type: "error", text: "Please select a valid profile." });
      return;
    }

    // Ensure user_id is set correctly in memberData
    setMemberData("user_id", selectedProfile.id);

    // Log memberData before creating the data object
    console.log("memberData before creating data object:", memberData);

    // Create the data object to be sent to the backend
    const data = {
      ...memberData,
      user_id: selectedProfile.id, // Ensure user_id is included
    };

    console.log("Submitting member data:", data); // Log the data being submitted

    postMember("/admin/members", {
      data, // Pass the data object
      onSuccess: () => {
        resetMember();
        setShowMemberForm(false);
        setMessage({ type: "success", text: "Member added successfully." });
        window.location.reload(); // Reload the page to reflect changes
      },
      onError: () => {
        setMessage({ type: "error", text: "Failed to add member." });
      },
    });
  };

  return (
    <AdminLayout>
      <Head title="Committee Management" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Committee Management</h1>

        {message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Add Committee Section */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Add Committee Department
              </h2>
              <button
                onClick={() => setShowCommitteeForm(!showCommitteeForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                {showCommitteeForm ? "Hide Form" : "Add Committee"}
              </button>
              {showCommitteeForm && (
                <form onSubmit={submitCommittee} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Committee Name</label>
                    <input
                      type="text"
                      value={committeeData.com_name}
                      onChange={(e) => setCommitteeData("com_name", e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={committeeData.com_description}
                      onChange={(e) => setCommitteeData("com_description", e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                  >
                    Save Committee
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Add Member Section */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserPlus className="h-6 w-6 mr-2" />
                Add Member/Employee
              </h2>
              <button
                onClick={() => setShowMemberForm(!showMemberForm)}
                className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center ${
                  committees.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={committees.length === 0}
              >
                <Plus className="h-5 w-5 mr-2" />
                {showMemberForm ? "Hide Form" : "Add Member"}
              </button>
              {committees.length === 0 && (
                <p className="text-sm text-gray-600 mt-2">Please create a committee first to add members.</p>
              )}
              {showMemberForm && (
                <form onSubmit={submitMember} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Member Role</label>
                    <select
                      value={memberData.member_role}
                      onChange={(e) => setMemberData("member_role", e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="Chairman">Chairman</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Select Profile</label>
                    <SearchableSelect
                      profiles={profiles}
                      selectedProfile={selectedProfile}
                      setSelectedProfile={(profile) => {
                        setSelectedProfile(profile);
                        setMemberData("user_id", profile?.id || "");
                      }}
                    />
                    {!selectedProfile && <p className="text-sm text-red-500 mt-1">Please select a valid profile.</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Committee</label>
                    <select
                      value={memberData.com_id}
                      onChange={(e) => setMemberData("com_id", e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Committee</option>
                      {committees.map((committee) => (
                        <option key={committee.id} value={committee.id}>
                          {committee.com_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ease-in-out"
                  >
                    Save Member
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Display Committees */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-8">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Committees</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {committees.map((committee) => (
            <div
              key={committee.id}
              onClick={() => setSelectedCommittee(committee)}
              className="bg-gray-50 p-4 rounded-lg shadow-md relative cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
            >
              {/* Title & More Options */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{committee.com_name}</h3>
                <button
                  className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition"
                  onClick={() =>
                    setOpenMenu(openMenu === committee.id ? null : committee.id)
                  }
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600">{committee.com_description}</p>

              {/* Dropdown Menu */}
              {openMenu === committee.id && (
                <div className="absolute right-2 top-10 bg-white shadow-lg rounded-md py-2 w-36 border">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => handleEditClick(committee)}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => handleDelete(committee.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Committee Form (Modal or Inline Form) */}
      {editCommittee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Committee</h2>
            <form onSubmit={handleUpdate}>
              <label className="block mb-2 text-sm font-medium">Committee Name</label>
              <input
                type="text"
                name="com_name"
                value={formData.com_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
                required
              />
              
              <label className="block mb-2 text-sm font-medium">Description</label>
              <textarea
                name="com_description"
                value={formData.com_description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded mb-4"
              ></textarea>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditCommittee(null)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>

        {/* Display Members Table for Selected Committee */}
        {selectedCommittee && (
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Members of {selectedCommittee.com_name}</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {committeeMembers.map((member) => {
                      const profile = profiles.find((p) => p.id === member.member.user_id);
                      return (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {profile ? `${profile.prof_lname}, ${profile.prof_fname}` : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{member.member.member_role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{member.com_mem_assigned_date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}