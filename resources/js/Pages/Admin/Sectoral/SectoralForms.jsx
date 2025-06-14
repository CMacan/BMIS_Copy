"use client"

import AdminLayout from "@/Layouts/AdminLayout"
import { Head, usePage, router } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Plus, FileText, BarChart3 } from "lucide-react"

// Import Components
import SearchFilter from "@/components/Admin/sectoral-forms/SearchFilter"
import FormTable from "@/components/Admin/sectoral-forms/FormTable"
import FormModal from "@/components/Admin/sectoral-forms/FormModal"
import SuccessToast from "@/components/Admin/sectoral-forms/SuccessToast"

export default function SectoralForms() {
  const { sectoralForms } = usePage().props
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedForm, setSelectedForm] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filteredForms, setFilteredForms] = useState(sectoralForms)
  const [categories, setCategories] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newForm, setNewForm] = useState({
    name: "",
    description: "",
    category: "",
    addtl_detail: "",
    requirements: [],
    image: null,
  })

  // Extract unique categories for filter
  useEffect(() => {
    const uniqueCategories = [...new Set(sectoralForms.map((form) => form.category))]
    setCategories(uniqueCategories)
  }, [sectoralForms])

  // Filter forms based on search term and category
  useEffect(() => {
    let results = sectoralForms

    if (searchTerm) {
      results = results.filter(
        (form) =>
          form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterCategory) {
      results = results.filter((form) => form.category === filterCategory)
    }

    setFilteredForms(results)
  }, [searchTerm, filterCategory, sectoralForms])

  // Open Edit Modal
  const handleEdit = (form) => {
    setSelectedForm(form)
    setEditModalOpen(true)
    setFormErrors({})
  }

  // Open Add Modal
  const handleAdd = () => {
    setAddModalOpen(true)
    setFormErrors({})
  }

  // Close Modals
  const closeEditModal = () => {
    setEditModalOpen(false)
    setSelectedForm(null)
    setFormErrors({})
  }

  const closeAddModal = () => {
    setAddModalOpen(false)
    setNewForm({
      name: "",
      description: "",
      category: "",
      addtl_detail: "",
      requirements: [],
      image: null,
    })
    setFormErrors({})
  }

  // Validate form
  const validateForm = (data) => {
    const errors = {}

    if (!data.name.trim()) {
      errors.name = "Name is required"
    }

    if (!data.description.trim()) {
      errors.description = "Description is required"
    }

    if (!data.category.trim()) {
      errors.category = "Category is required"
    }

    return errors
  }

  // Handle Form Submission (Edit)
  const handleEditSubmit = () => {
    const errors = validateForm(selectedForm)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    // Create FormData for file upload
    const formData = new FormData()
    Object.keys(selectedForm).forEach((key) => {
      if (key === "requirements") {
        formData.append(key, JSON.stringify(selectedForm[key]))
      } else if (key !== "image" || (key === "image" && selectedForm[key] instanceof File)) {
        formData.append(key, selectedForm[key])
      }
    })

    router.post(`/admin/sectoral-update/${selectedForm.id}?_method=PUT`, formData, {
      onSuccess: () => {
        closeEditModal()
        setSuccessMessage("Form updated successfully!")
        setIsSubmitting(false)
      },
      onError: (errors) => {
        setFormErrors(errors)
        setIsSubmitting(false)
      },
    })
  }

  // Handle Form Submission (Add)
  const handleAddSubmit = () => {
    const errors = validateForm(newForm)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)

    // Create FormData for file upload
    const formData = new FormData()
    Object.keys(newForm).forEach((key) => {
      if (key === "requirements") {
        formData.append(key, JSON.stringify(newForm[key]))
      } else if (key !== "image" || (key === "image" && newForm[key] instanceof File)) {
        formData.append(key, newForm[key])
      }
    })

    router.post("/admin/sectoral-forms", formData, {
      onSuccess: () => {
        closeAddModal()
        setSuccessMessage("Form created successfully!")
        setIsSubmitting(false)
      },
      onError: (errors) => {
        setFormErrors(errors)
        setIsSubmitting(false)
      },
    })
  }

  // Handle Delete with confirmation
  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      router.delete(`/admin/sectoral-delete/${id}`, {
        onSuccess: () => {
          setSuccessMessage("Form deleted successfully!")
        },
      })
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setFilterCategory("")
  }

  return (
    <AdminLayout>
      <Head title="Sectoral Forms" />

      {/* Success Message Toast */}
      <SuccessToast message={successMessage} onClose={() => setSuccessMessage("")} />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          
          

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
            <div className="p-6 border-b border-indigo-100 bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-bold text-indigo-900">Sectoral Forms</h1>
                {/* <button
                  onClick={handleAdd}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add New Form</span>
                </button> */}
              </div>
            </div>

            {/* Search and Filter */}
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              categories={categories}
              resetFilters={resetFilters}
            />

            {/* Table */}
            <FormTable
              filteredForms={filteredForms}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              searchTerm={searchTerm}
              filterCategory={filterCategory}
            />
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      <FormModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        formData={selectedForm}
        setFormData={setSelectedForm}
        onSubmit={handleEditSubmit}
        isEdit={true}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        categories={categories}
      />

      {/* Add Form Modal */}
      <FormModal
        isOpen={addModalOpen}
        onClose={closeAddModal}
        formData={newForm}
        setFormData={setNewForm}
        onSubmit={handleAddSubmit}
        isEdit={false}
        formErrors={formErrors}
        isSubmitting={isSubmitting}
        categories={categories}
      />
    </AdminLayout>
  )
}

