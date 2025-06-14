"use client"

import { Pencil, Trash2, ImageIcon, Info } from "lucide-react"

export default function FormTable({ filteredForms, handleEdit, handleDelete, searchTerm, filterCategory }) {
  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse ">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-indigo-100">
                Additional Details
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b border-indigo-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredForms.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="bg-indigo-50 p-4 rounded-full mb-4">
                      <Info className="h-10 w-10 text-indigo-500" />
                    </div>
                    <p className="text-lg font-medium text-indigo-900">No forms found</p>
                    <p className="text-sm text-indigo-500 mt-1">
                      {searchTerm || filterCategory
                        ? "Try adjusting your search or filters"
                        : "Click 'Add New Form' to create one"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredForms.map((form, index) => (
                <tr
                  key={form.id}
                  className={`group hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="px-6 py-4 text-sm font-bold text-black-900 border-b border-indigo-100">
                    {form.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 border-b border-indigo-100">
                    {form.image ? (
                      <div className="relative h-16 w-20 overflow-hidden rounded-lg border border-indigo-200 group-hover:border-indigo-300 transition-colors shadow-sm">
                        <img
                           src={`/${form.image}`}
                          alt={form.name}
                          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=64&width=80"
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-20 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 group-hover:border-indigo-300 transition-colors">
                        <ImageIcon className="h-8 w-8 text-indigo-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-black-700 border-b border-indigo-100 max-w-[200px]">
                    <div className="line-clamp-2">{form.description}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-indigo-700 border-b border-indigo-100">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {form.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-black-700 border-b border-indigo-100 max-w-[200px]">
                    <div className="line-clamp-2">{form.addtl_detail || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 border-b border-indigo-100 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(form)}
                        className="p-2 rounded-lg text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 transition-colors duration-200"
                        title="Edit"
                      >
                        <Pencil className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(form.id, form.name)}
                        className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

