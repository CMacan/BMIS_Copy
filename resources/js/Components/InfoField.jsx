// resources/js/Components/InfoField.jsx
"use client"

const InfoField = ({ label, value }) => {
  return (
    <div className="border border-gray-200 rounded-md p-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

export default InfoField
