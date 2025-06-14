"use client"

import { CheckCircle2 } from "lucide-react"

export default function ProgressBar({ currentStep, totalSteps, stepLabels }) {
  return (
    <div className="mb-10">
      {/* Step indicators */}
      <div className="relative flex justify-between mb-4">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {/* Step circles */}
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="z-10 relative">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                currentStep > step
                  ? "bg-indigo-500 border-indigo-500 text-white"
                  : currentStep === step
                    ? "bg-white border-indigo-500 text-indigo-600"
                    : "bg-white border-gray-300 text-gray-400"
              }`}
            >
              {currentStep > step ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </div>

            {/* Pulse animation for current step */}
            {currentStep === step && (
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 left-0 w-full h-full rounded-full bg-indigo-500 opacity-20 animate-ping"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step labels */}
      <div className="flex justify-between mt-2">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`text-sm font-medium transition-colors duration-300 ${
              currentStep > index + 1
                ? "text-indigo-600"
                : currentStep === index + 1
                  ? "text-indigo-600"
                  : "text-gray-500"
            }`}
            style={{
              width: `${100 / stepLabels.length}%`,
              textAlign: index === 0 ? "left" : index === stepLabels.length - 1 ? "right" : "center",
              paddingLeft: index === 0 ? "0" : "",
              paddingRight: index === stepLabels.length - 1 ? "0" : "",
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

