"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserCircle, Users } from "lucide-react"

const OptionCard = ({ icon: Icon, title, description, onClick, isSelected }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`cursor-pointer bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 ${
      isSelected ? "ring-2 ring-blue-500" : ""
    }`}
    onClick={onClick}
  >
    <Icon className="w-12 h-12 text-blue-500 mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </motion.div>
)

export default function RegistrationOptions({ onSelect, selectedForm = {} }) {
  const [selectedOption, setSelectedOption] = useState(null)

  const handleSelect = (option) => {
    setSelectedOption(option)
    onSelect(option)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mt-24 mx-auto p-6 bg-gray-50 rounded-2xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6">
        Who would you like to register{selectedForm.title ? ` for ${selectedForm.title}` : ""}?
      </h2>
      <div className="grid mt-12 md:grid-cols-2 gap-6 mb-8">
        <OptionCard
          icon={UserCircle}
          title="Register Myself"
          description="Proceed with registering your own information"
          onClick={() => handleSelect("self")}
          isSelected={selectedOption === "self"}
        />
        <OptionCard
          icon={Users}
          title="Register a Household Member"
          description="Register someone from your household"
          onClick={() => handleSelect("household")}
          isSelected={selectedOption === "household"}
        />
      </div>
    </motion.div>
  )
}

