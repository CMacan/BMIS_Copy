import React from 'react';
import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function UpdateHouseholdForm({ household, address, showToast }) {
  const { data, setData, post, processing, errors } = useForm({
    addr_city: address.addr_city || '',
    addr_barangay: address.addr_barangay || '',
    addr_region: address.addr_region || '',
    addr_block: address.addr_block || '',
    addr_sitio: address.addr_sitio || '',
    addr_street: address.addr_street || '',
    addr_houseno: address.addr_houseno || '',
    addr_province: address.addr_province || '',
    addr_type: address.addr_type || '',
    house_type: household.house_type || '',
    // house_ownership: 'owner',
    house_year: household.house_year || '',
  });

  const handleHouseholdSubmit = (e) => {
    e.preventDefault();
    post(route('household.update', {household: household.id}), {
      onSuccess: () => {
        showToast('Household updated successfully!', 'success');
      },
      onError: () => {
        showToast('Failed to update household.', 'error');
      },
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleHouseholdSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={data.addr_city}
            onChange={(e) => setData('addr_city', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <InputError message={errors.addr_city} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Barangay</label>
          <input
            type="text"
            value={data.addr_barangay}
            onChange={(e) => setData('addr_barangay', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <InputError message={errors.addr_barangay} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Region</label>
          <input
            type="text"
            value={data.addr_region}
            onChange={(e) => setData('addr_region', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <InputError message={errors.addr_region} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Block</label>
          <select
            value={data.addr_block}
            onChange={(e) => setData('addr_block', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7A">7A</option>
            <option value="7B">7B</option>
          </select>
          <InputError message={errors.addr_block} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sitio</label>
          <input
            type="text"
            value={data.addr_sitio}
            onChange={(e) => setData('addr_sitio', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <InputError message={errors.addr_sitio} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            value={data.addr_street}
            onChange={(e) => setData('addr_street', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <InputError message={errors.addr_street} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">House Number</label>
          <input
            type="text"
            value={data.addr_houseno}
            onChange={(e) => setData('addr_houseno', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <InputError message={errors.addr_houseno} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Province</label>
          <input
            type="text"
            value={data.addr_province}
            onChange={(e) => setData('addr_province', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <InputError message={errors.addr_province} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address Type</label>
          <select
            value={data.addr_type}
            onChange={(e) => setData('addr_type', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="permanent">Permanent</option>
            <option value="temporary">Temporary</option>
          </select>
          <InputError message={errors.addr_type} className="mt-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">House Type</label>
          <select
            value={data.house_type}
            onChange={(e) => setData('house_type', e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="singlefamily">Single Family</option>
            <option value="apartment">Apartment</option>
            <option value="townhouse">Townhouse</option>
          </select>
          <InputError message={errors.house_type} className="mt-2" />
        </div>
      </div>
      <div className="flex justify-end">
        <PrimaryButton disabled={processing} type="submit">Save Changes</PrimaryButton>
      </div>
    </form>
  );
}