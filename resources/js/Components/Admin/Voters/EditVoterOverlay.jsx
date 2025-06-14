import React from "react";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Contexts/ToastContext";

const EditVoterOverlay = ({ voter, precincts, onClose, onSave }) => {
  const { data, setData, put, processing, errors } = useForm({
    vote_fname: voter.vote_fname,
    vote_lname: voter.vote_lname,
    precinct_id: voter.precinct_id,
  });

  const showToast = useToast();

  const handleChange = (e) => {
    setData(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting form data:", data); // Debugging
    put(route("admin.voters.update", voter.id), {
      onSuccess: () => {
        // Call the onSave callback with the updated voter data
        onSave({
          ...voter, // Spread the existing voter data
          ...data, // Override with the updated data
        });
        onClose(); // Close the overlay
        showToast("Voter updated successfully.", "success"); // Show a toast notification
      },
      onError: (errors) => {
        console.error("Failed to update voter:", errors); // Debugging
      },
    });
  };

  console.log("Processing state:", processing); // Debugging
  console.log("Form errors:", errors); // Debugging

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Voter</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="vote_fname"
                      value={data.vote_fname}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.vote_fname && <p className="text-red-500 text-sm mt-1">{errors.vote_fname}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="vote_lname"
                      value={data.vote_lname}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.vote_lname && <p className="text-red-500 text-sm mt-1">{errors.vote_lname}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Precinct Number</label>
                    <select
                      name="precinct_id"
                      value={data.precinct_id || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Precinct</option>
                      {precincts.map((precinct) => (
                        <option key={precinct.id} value={precinct.id}>
                          {precinct.precinct_number}
                        </option>
                      ))}
                    </select>
                    {errors.precinct_id && <p className="text-red-500 text-sm mt-1">{errors.precinct_id}</p>}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="mr-2 px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      {processing ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVoterOverlay;