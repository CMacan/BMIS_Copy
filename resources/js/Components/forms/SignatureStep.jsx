"use client";

import { PenTool, RefreshCw } from "lucide-react";

export default function SignatureStep({
  signature,
  handleOpenSignatureModal,
  formSubmitted, // May be undefined for forms where SignatureStep is not the last step
  errors,
  formType = "",
  isLastStep = false,
}) {
  // List of forms where `formSubmitted` is not required
  const formsWithoutFormSubmitted = [
    "SOLO PARENT INTAKE FORM",
    "PWD INTAKE FORM",
    "SENIOR CITIZEN INTAKE FORM",
  ];

  // Determine if the current form is in the list
  const isSimpleForm = formsWithoutFormSubmitted.includes(formType);

  // Error logic for forms where `formSubmitted` is not required
  const alternativeError = isSimpleForm && !signature && errors?.signature;

  // Use `shouldShowError` only for forms where `formSubmitted` is provided
  const shouldShowError =
    !isSimpleForm &&
    formSubmitted !== undefined &&
    formSubmitted &&
    !signature &&
    errors?.signature;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/5 z-0"></div>
        <div className="relative z-10 px-8 py-7 flex items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
            <PenTool className="w-5 h-5" />
          </div>
          <div className="ml-5">
            <h2 className="text-xl font-semibold text-gray-800">Signature</h2>
            <p className="text-gray-500 mt-1">
              {isSimpleForm
                ? "Please add your signature"
                : "Please add your signature to complete the form"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-7">
        <div
          onClick={handleOpenSignatureModal}
          className={`group relative border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors duration-300 flex flex-col items-center justify-center ${
            (shouldShowError || alternativeError)
              ? "border-red-300 hover:border-red-400 bg-gradient-to-r from-red-50/50 to-red-100/50"
              : "border-indigo-200 hover:border-indigo-400 bg-gradient-to-r from-indigo-50/50 to-blue-50/50"
          }`}
        >
          {signature ? (
            <div className="text-center relative">
              <img
                src={URL.createObjectURL(signature)}
                alt="Your signature"
                className="max-w-full max-h-40 mx-auto mb-3 rounded-lg shadow-sm"
              />
              <div
                className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg ${
                  shouldShowError || alternativeError
                    ? "bg-red-900/10"
                    : "bg-indigo-900/10"
                }`}
              >
                <div
                  className={`rounded-full p-2 shadow-md ${
                    shouldShowError || alternativeError
                      ? "bg-red-100"
                      : "bg-white"
                  }`}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      shouldShowError || alternativeError
                        ? "text-red-600"
                        : "text-indigo-600"
                    }`}
                  />
                </div>
              </div>
              <p
                className={`text-sm font-medium mt-2 ${
                  shouldShowError || alternativeError
                    ? "text-red-600"
                    : "text-indigo-600"
                }`}
              >
                Click to change signature
              </p>
            </div>
          ) : (
            <>
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                  shouldShowError || alternativeError
                    ? "bg-red-100 group-hover:bg-red-200"
                    : "bg-indigo-100 group-hover:bg-indigo-200"
                }`}
              >
                <PenTool
                  className={`w-8 h-8 ${
                    shouldShowError || alternativeError
                      ? "text-red-500"
                      : "text-indigo-500"
                  }`}
                />
              </div>
              <p
                className={`font-medium text-center mb-2 ${
                  shouldShowError || alternativeError
                    ? "text-red-700"
                    : "text-indigo-700"
                }`}
              >
                Click here to add your signature
              </p>
              <p
                className={`text-sm text-center ${
                  shouldShowError || alternativeError
                    ? "text-red-500"
                    : "text-indigo-500"
                }`}
              >
                Tap or click to open signature pad
              </p>
            </>
          )}
        </div>

        {/* Error message */}
        {(shouldShowError || alternativeError) && (
          <div className="mt-2 text-red-500 text-sm flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            {errors.signature}
          </div>
        )}

        {/* Disclaimer box */}
        <div
          className={`mt-8 p-5 rounded-xl border ${
            shouldShowError || alternativeError
              ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
              : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
          }`}
        >
          <p
            className={`text-sm leading-relaxed ${
              shouldShowError || alternativeError
                ? "text-red-700"
                : "text-gray-700"
            }`}
          >
            By signing this form, I confirm that all the information provided is
            accurate and complete to the best of my knowledge.
          </p>
        </div>
      </div>
    </div>
  );
}