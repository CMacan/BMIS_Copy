"use client"

import { useState } from "react"
import { router } from "@inertiajs/react"
import { MessageSquare, Send, Loader2, Star } from "lucide-react"

export default function FeedbackForm() {
  const [values, setValues] = useState({
    name: "",
    title: "",
    message: "",
  })

  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const key = e.target.name
    const value = e.target.value
    setValues((values) => ({
      ...values,
      [key]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setProcessing(true)

    router.post("/feedback", values, {
      onSuccess: () => {
        setValues({
          name: "",
          title: "",
          message: "",
        })
        setProcessing(false)
        setSuccess(true)
        setTimeout(() => setSuccess(false), 5000)
      },
      onError: (errors) => {
        setErrors(errors)
        setProcessing(false)
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-center text-3xl font-bold text-blue-800 mb-10">
          Barangay Sawang Calero Community Feedback
        </h1>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Form Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl border-t-4 border-blue-600">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-7 h-7 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Share Your Voice</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                />
                {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  placeholder="Feedback title"
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                />
                {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={values.message}
                  onChange={handleChange}
                  placeholder="Your feedback message"
                  rows={6}
                  className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                />
                {errors.message && <div className="text-red-600 text-sm mt-1">{errors.message}</div>}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Feedback Message Section */}
          <div className="rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-8 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-7 h-7 text-yellow-400" />
                <h2 className="text-2xl font-bold">We Value Your Feedback!</h2>
              </div>

              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Your voice matters to Barangay Sawang Calero! If you have any concerns, suggestions, or compliments,
                please don't hesitate to share them. Your input is crucial as we continuously strive to improve our
                services and address any issues you may encounter.
              </p>

              <div className="bg-blue-700 rounded-xl p-6 mb-6">
                <h3 className="text-yellow-400 font-bold text-lg mb-3">How Your Feedback Helps Us</h3>
                <ul className="space-y-3">
                  {[
                    "Improve community services",
                    "Address local concerns promptly",
                    "Plan better community programs",
                    "Strengthen our barangay together",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="bg-red-600 rounded-full p-1 mr-3 flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex justify-center">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="fixed bottom-5 right-5 bg-yellow-500 text-blue-900 p-4 rounded-md shadow-lg animate-bounce">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-bold">Feedback submitted successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

