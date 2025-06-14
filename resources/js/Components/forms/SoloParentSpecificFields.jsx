"use client"
import { InfoIcon } from "lucide-react"
import FormField from "./FormField"

const INCOME_RANGES = [
  { value: "below-25k", label: "Below ₱25,000" },
  { value: "25k-50k", label: "₱25,000 - ₱50,000" },
  { value: "50k-75k", label: "₱50,000 - ₱75,000" },
  { value: "75k-100k", label: "₱75,000 - ₱100,000" },
  { value: "100k-150k", label: "₱100,000 - ₱150,000" },
  { value: "above-150k", label: "More than ₱150,000" }
]

export default function SoloParentSpecificFields({ data, handleInputChange, errors }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
          <h3 className="text-2xl font-semibold text-gray-800">Solo Parent Information</h3>
        </div>
        <p className="text-gray-500 ml-[18px]">Please provide details about your specific situation as a solo parent</p>
      </div>

      <div className="space-y-8">
        {/* Financial Information Section */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h4 className="text-lg font-medium text-blue-800 mb-4">Financial Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Income Dropdown */}
            <div className={errors.monthlyIncome ? "border-l-2 border-red-500 pl-3" : ""}>
              <label 
                htmlFor="monthlyIncome" 
                className={`block text-sm font-medium ${errors.monthlyIncome ? "text-red-600" : "text-gray-700"} mb-1`}
              >
                Your Monthly Income
              </label>
              <select
                id="monthlyIncome"
                name="monthlyIncome"
                className={`w-full p-3 border rounded-md focus:ring-2 ${
                  errors.monthlyIncome 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={data.monthlyIncome}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select your income range</option>
                {INCOME_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <p className="text-xs mt-1 ml-1 text-gray-500">
                Your personal income from all sources
              </p>
              {errors.monthlyIncome && (
                <p className="mt-1 text-sm text-red-600">
                  {typeof errors.monthlyIncome === 'string' ? errors.monthlyIncome : ""}
                </p>
              )}
            </div>

            {/* Family Monthly Income Dropdown */}
            <div className={errors.familyMonthlyIncome ? "border-l-2 border-red-500 pl-3" : ""}>
              <label 
                htmlFor="familyMonthlyIncome" 
                className={`block text-sm font-medium ${errors.familyMonthlyIncome ? "text-red-600" : "text-gray-700"} mb-1`}
              >
                Total Family Income
              </label>
              <select
                id="familyMonthlyIncome"
                name="familyMonthlyIncome"
                className={`w-full p-3 border rounded-md focus:ring-2 ${
                  errors.familyMonthlyIncome 
                    ? "border-red-500 focus:ring-red-500" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={data.familyMonthlyIncome}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select family income range</option>
                {INCOME_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <p className="text-xs mt-1 ml-1 text-gray-500">
                Combined income of all household members
              </p>
              {errors.familyMonthlyIncome && (
                <p className="mt-1 text-sm text-red-600">
                  {typeof errors.familyMonthlyIncome === 'string' ? errors.familyMonthlyIncome : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Circumstances Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Your Circumstances</h4>

          {/* Classification/Circumstances */}
          <div className={`mb-6 ${errors.soloParentClassification ? "border-l-2 border-red-500 pl-3" : ""}`}>
            <div className="flex items-start gap-2 mb-1">
              <label 
                htmlFor="soloParentClassification" 
                className={`block text-sm font-medium ${errors.soloParentClassification ? "text-red-600" : "text-gray-700"}`}
              >
                Classification/Circumstances
              </label>
              <div className="group relative">
                <InfoIcon size={16} className={`${errors.soloParentClassification ? "text-red-400" : "text-gray-400"} cursor-help`} />
                <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  Examples: unmarried mother/father, widowed, separated, abandoned, etc.
                </div>
              </div>
            </div>
            <select
              id="soloParentClassification"
              name="soloParentClassification"
              className={`w-full p-3 border rounded-md focus:ring-2 ${
                errors.soloParentClassification 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              }`}
              value={data.soloParentClassification}
              onChange={handleInputChange}
            >
              <option value="">Select your circumstance</option>
              <option value="Unmarried mother/father">Unmarried mother/father</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated/abandoned">Separated/abandoned</option>
              <option value="Spouse with physical/mental incapacity">Spouse with physical/mental incapacity</option>
              <option value="Spouse serving jail term">Spouse serving jail term</option>
              <option value="Other">Other (please specify)</option>
            </select>
            {data.soloParentClassification === "Other" && (
              <textarea
                name="soloParentClassificationOther"
                placeholder="Please specify your circumstance"
                className={`w-full mt-2 p-3 border rounded-md focus:ring-2 ${
                  errors.soloParentClassificationOther
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={data.soloParentClassificationOther || ""}
                onChange={handleInputChange}
                rows={2}
              />
            )}
            {errors.soloParentClassification && (
              <p className="mt-1 text-sm text-red-600">{errors.soloParentClassification}</p>
            )}
          </div>
        </div>

        {/* Needs and Resources Section */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-800 mb-4">Needs & Resources</h4>

          <div className="space-y-6">
            {/* Needs/Problems */}
            <div className={errors.soloParentNeeds ? "border-l-2 border-red-500 pl-3" : ""}>
              <label 
                htmlFor="soloParentNeeds" 
                className={`block text-sm font-medium ${errors.soloParentNeeds ? "text-red-600" : "text-gray-700"} mb-1`}
              >
                Needs/Challenges as a Solo Parent
              </label>
              <textarea
                id="soloParentNeeds"
                name="soloParentNeeds"
                placeholder="Describe your specific needs or challenges (e.g., childcare, financial assistance, housing, etc.)"
                className={`w-full p-3 border rounded-md focus:ring-2 ${
                  errors.soloParentNeeds
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={data.soloParentNeeds}
                onChange={handleInputChange}
                rows={3}
              />
              {errors.soloParentNeeds && <p className="mt-1 text-sm text-red-600">{errors.soloParentNeeds}</p>}
            </div>

            {/* Family Resources */}
            <div className={errors.familyResources ? "border-l-2 border-red-500 pl-3" : ""}>
              <label 
                htmlFor="familyResources" 
                className={`block text-sm font-medium ${errors.familyResources ? "text-red-600" : "text-gray-700"} mb-1`}
              >
                Family Resources
              </label>
              <textarea
                id="familyResources"
                name="familyResources"
                placeholder="Describe available family support, community resources, or other assistance you currently have"
                className={`w-full p-3 border rounded-md focus:ring-2 ${
                  errors.familyResources
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                value={data.familyResources}
                onChange={handleInputChange}
                rows={3}
              />
              {errors.familyResources && <p className="mt-1 text-sm text-red-600">{errors.familyResources}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}