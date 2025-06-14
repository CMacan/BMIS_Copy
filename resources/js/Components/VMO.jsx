import { useState } from "react"

export default function VMO() {
    const [activeTab, setActiveTab] = useState("vision")
  
   
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              {tab.id.toUpperCase()}
            </button>
          ))}
        </div>
  
        <div className="text-center space-y-6">
          <p className="text-gray-600">
            We are determined to continue pushing boundaries and making an impact in our community. Let's take a look at
            what we have been working on and what our future plans are.
          </p>
  
          <div className="bg-blue-50 p-8 rounded-lg">
            <p className="text-gray-800 whitespace-pre-line text-left ml-20">{tabs.find((tab) => tab.id === activeTab)?.content}</p>
          </div>
        </div>
      </div>
    )
  }
  
  