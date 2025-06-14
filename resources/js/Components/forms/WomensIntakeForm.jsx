"use client"

import FormSelect from "./FormSelect"

export default function WomensSpecificFields({ data, handleInputChange, errors }) {
  const breadwinnerOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormSelect
        name="isBreadwinner"
        label="Are you the breadwinner of your family?"
        options={breadwinnerOptions}
        value={data.isBreadwinner}
        onChange={handleInputChange}
        error={errors.isBreadwinner}
        required
      />
      {/* Add more Women's specific fields here as needed */}
    </div>
  )
}