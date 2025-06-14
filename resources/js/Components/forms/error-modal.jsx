"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Clock, CheckCircle, XCircle } from "lucide-react"

export default function ErrorModal({ isOpen, message, onClose }) {
  if (!isOpen) return null

  const isPendingMessage = message.includes("pending application")
  const isAppliedMessage = message.includes("already applied")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center mb-6">
              {isPendingMessage ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="text-amber-500"
                >
                  <Clock className="w-16 h-16" />
                </motion.div>
              ) : isAppliedMessage ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="text-emerald-500"
                >
                  <CheckCircle className="w-16 h-16" />
                </motion.div>
              ) : (
                <XCircle className="w-16 h-16 text-rose-500" />
              )}
              <h3 className="text-2xl font-bold text-center mt-4 mb-2">
                {isPendingMessage ? "Pending Application" : isAppliedMessage ? "Already Applied" : "Not Eligible"}
              </h3>
            </div>
            <p className="text-gray-600 text-center mb-6">{message}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl py-3 px-4 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg shadow-blue-500/25"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

