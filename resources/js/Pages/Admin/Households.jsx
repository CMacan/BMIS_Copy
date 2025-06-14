import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Households() {
  const { households } = usePage().props;
  const [searchQuery, setSearchQuery] = useState("");

  // Filter households based on search query
  const filteredHouseholds = households.filter(household =>
    household.house_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Households</h2>}
      user={usePage().props.auth.user}
    >
      <Head title="Households" />
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="mb-4 flex items-center justify-between">
          <input
            type="search"
            placeholder="Search households..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utility Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Income</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHouseholds.map((household, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">{household.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{household.house_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{household.house_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{household.house_util_access}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{household.house_year}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{household.house_income}</td>
                </tr>
              ))}
              {filteredHouseholds.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-sm text-center text-gray-500">No households found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}