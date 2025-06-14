import React from 'react';
import { usePage } from '@inertiajs/react';

export default function RequestOption({ onSelect, onClose }) {
  const { householdMembers } = usePage().props;
  const hasHouseholdMembers = householdMembers && householdMembers.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative z-50">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Who is requesting the document?</h2>
        </div>
        <div className="p-6">
          <button
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B3990] hover:bg-[#232d73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990] mb-4"
            onClick={() => onSelect('self')}
          >
            I am requesting for myself
          </button>
          {hasHouseholdMembers && (
            <button
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B3990] hover:bg-[#232d73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990] mb-4"
              onClick={() => onSelect('other')}
            >
              I am requesting for someone else
            </button>
          )}
          <button
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B3990] hover:bg-[#232d73] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990]"
            onClick={() => onSelect('others')}
          >
            Others
          </button>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
}
