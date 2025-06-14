"use client"

import { useState } from "react"
import { Info, ChevronRight } from "lucide-react"
import FormSelect from "./FormSelect"
import FormField from "./FormField"
import SoloParentSpecificFields from "./SoloParentSpecificFields"
import ERPATSpecificFields from "./ERPATSpecificFields"
import WomensSpecificFields from "./WomensIntakeForm" // Create this new component

export default function AdditionalDetailsStep({
  data,
  handleInputChange,
  errors,
  fields,
  title,
  description,
  icon,
  infoText,
  useInputFields = false,
  formType,
  required,
}) {
  const [expandedInfo, setExpandedInfo] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/5 z-0"></div>
        <div className="relative z-10 px-8 py-7 flex items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            {icon}
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-7">
        {/* Add Women's specific fields */}
        {formType === "WOMENS INTAKE FORM" && (
          <div className="mb-8">
            <WomensSpecificFields
              data={data}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </div>
        )}
        
        {formType === "SOLO PARENT INTAKE FORM" && (
          <div className="mb-8">
            <SoloParentSpecificFields
              data={data}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </div>
        )}
        
        {formType === "ERPAT INTAKE FORM" && (
          <div className="mb-8">
            <ERPATSpecificFields
              data={data}
              handleInputChange={handleInputChange}
              errors={errors}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {fields &&
            fields.length > 0 &&
            fields.map((field) => {
              const { name, label, options, type = "text", placeholder } = field

              return useInputFields ? (
                <FormField
                  key={name}
                  name={name}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  value={data[name]}
                  onChange={handleInputChange}
                  error={errors[name]}
                  required={required}
                />
              ) : (
                <FormSelect
                  key={name}
                  name={name}
                  label={label}
                  options={options}
                  value={data[name]}
                  onChange={handleInputChange}
                  error={errors[name]}
                  required={required}
                />
              )
            })}
        </div>

        {infoText && (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setExpandedInfo(!expandedInfo)}
              className="w-full flex items-center justify-between text-left px-5 py-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100/80 hover:from-indigo-100 hover:to-blue-100 transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Info className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-indigo-900">
                    Why we collect this information
                  </h4>
                  <p
                    className={`mt-1 text-sm text-indigo-700 line-clamp-1 ${
                      expandedInfo ? "line-clamp-none" : ""
                    }`}
                  >
                    {infoText}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-indigo-500 transition-transform duration-300 ${
                  expandedInfo ? "rotate-90" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedInfo ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 py-4 bg-indigo-50 rounded-xl border border-indigo-100/80">
                <p className="text-sm text-indigo-700 leading-relaxed">
                  {infoText}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}