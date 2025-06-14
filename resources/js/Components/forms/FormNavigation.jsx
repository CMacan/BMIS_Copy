"use client"

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"

export default function FormNavigation({
  currentStep,
  totalSteps,
  prevStep,
  nextStep,
  onSubmit,// Add this prop
  processing = false,
  submitButtonText = "Submit Form",
}) {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Previous
          </button>
        ) : (
          <div></div>
        )}

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md"
          >
            Next
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        ) : (
          <button
          type="button" // Prevent default form submission
          onClick={onSubmit} // Call the onSubmit function
            disabled={processing}
            className="flex items-center px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {submitButtonText}
                <CheckCircle2 className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}