"use client"

import { useState, useEffect } from "react"
import { Head, usePage } from "@inertiajs/react"
import AdminLayout from "@/Layouts/AdminLayout"
import axios from "axios"
import { useToast } from "@/Contexts/ToastContext"
import {
  Filter,
  SortAsc,
  SortDesc,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  X,
  Shield,
  Users,
} from "lucide-react"

export default function Roles() {
  const { rolepermissions, roleusers, auth } = usePage().props
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [isUserRoleModalOpen, setIsUserRoleModalOpen] = useState(false)
  const [roleForm, setRoleForm] = useState({
    role_name: "",
    role_description: "",
  })
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUserRoles, setSelectedUserRoles] = useState([])
  const [userSearchQuery, setUserSearchQuery] = useState("")

  const showToast = useToast()

  useEffect(() => {
    fetchRoles()
    fetchUsers()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await axios.get(route("roles.index"));
      setRoles(response.data.roles);
      setPermissions(response.data.permissions);
    } catch (error) {
      showToast("Failed to fetch roles.", "error");
      console.error("Error fetching roles:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(route("users.index"))
      setUsers(response.data.users)
    } catch (error) {
      showToast("Failed to fetch users.", "error")
      console.error("Error fetching users:", error)
    }
  }

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Cycle through: asc -> desc -> none
        if (prev.direction === "asc") {
          return { key, direction: "desc" }
        } else if (prev.direction === "desc") {
          return { key: null, direction: null }
        }
      }
      // Default to ascending for a new column
      return { key, direction: "asc" }
    })
  }

  const sortedRoles = [...roles].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) {
      return 0 // No sorting
    }

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const filteredRoles = sortedRoles.filter((role) => role.role_name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRoles.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1) // Reset to first page when items per page changes
  }

  // Helper function to get pagination range
  const getPaginationRange = (current, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    if (current <= 3) {
      return [1, 2, 3, 4, 5]
    }

    if (current >= total - 2) {
      return [total - 4, total - 3, total - 2, total - 1, total]
    }

    return [current - 2, current - 1, current, current + 1, current + 2]
  }

  // Role form handlers
  const openCreateModal = () => {
    setRoleForm({
      role_name: "",
      role_description: "",
    })
    setIsModalOpen(true)
    setSelectedRole(null)
  }

  const openEditModal = (role) => {
    setRoleForm({
      role_name: role.role_name,
      role_description: role.role_description,
    })
    setIsModalOpen(true)
    setSelectedRole(role)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRole(null)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setRoleForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (selectedRole) {
      await updateRole(selectedRole.id, roleForm)
    } else {
      await createRole(roleForm)
    }

    closeModal()
  }

  // Permission modal handlers
  const openPermissionModal = (role) => {
    setSelectedRole(role)
    // Initialize selected permissions based on the role's current permissions
    const rolePermissionIds = role.permissions ? role.permissions.map((p) => p.id) : []
    setSelectedPermissions(rolePermissionIds)
    setIsPermissionModalOpen(true)
  }

  const closePermissionModal = () => {
    setIsPermissionModalOpen(false)
    setSelectedRole(null)
    setSelectedPermissions([])
  }

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId)
      } else {
        return [...prev, permissionId]
      }
    })
  }

  const handlePermissionSubmit = async (e) => {
    e.preventDefault()
    await assignPermissions(selectedRole.id, selectedPermissions)
    closePermissionModal()
  }

  // User role modal handlers
  const openUserRoleModal = () => {
    setSelectedUser(null)
    setSelectedUserRoles([])
    setIsUserRoleModalOpen(true)
  }

  const closeUserRoleModal = () => {
    setIsUserRoleModalOpen(false)
    setSelectedUser(null)
    setSelectedUserRoles([])
    setUserSearchQuery("")
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    // Initialize selected roles based on the user's current roles
    const userRoleIds = getUserRoles(user.id).map((role) => role.id)
    setSelectedUserRoles(userRoleIds)
  }

  const handleUserRoleChange = (roleId) => {
    setSelectedUserRoles((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId)
      } else {
        return [...prev, roleId]
      }
    })
  }

  const handleUserRoleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUser) {
      showToast("Please select a user first.", "error")
      return
    }
    await assignRolesToUser(selectedUser.id, selectedUserRoles)
    closeUserRoleModal()
  }

  // Get filtered users for the user role modal
  const filteredUsers = users.filter(
    (user) =>
      `${user.profile?.prof_fname || ""} ${user.profile?.prof_lname || ""}`
        .toLowerCase()
        .includes(userSearchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()),
  )

  // Helper function to get roles for a specific user
  const getUserRoles = (userId) => {
    const userRoleData = roleusers.filter((ru) => ru.user_id === userId)
    return roles.filter((role) => userRoleData.some((ur) => ur.role_id === role.id))
  }

  // API functions
  const createRole = async (roleData) => {
    try {
      const response = await axios.post(route("roles.store"), roleData)
      showToast(response.data.message, "success")
      fetchRoles()
    } catch (error) {
      showToast("Failed to create role.", "error")
      console.error("Failed to create role. Error:", error)
    }
  }

  const updateRole = async (roleId, roleData) => {
    try {
      const response = await axios.put(route("roles.update", roleId), roleData)
      showToast(response.data.message, "success")
      fetchRoles()
    } catch (error) {
      showToast("Failed to update role.", "error")
      console.error("Failed to update role. Error:", error)
    }
  }

  const deleteRole = async (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return

    try {
      const response = await axios.delete(route("roles.destroy", roleId))
      showToast(response.data.message, "success")
      fetchRoles()
    } catch (error) {
      showToast("Failed to delete role.", "error")
      console.error("Failed to delete role. Error:", error)
    }
  }

  const assignPermissions = async (roleId, permissions) => {
    try {
      const response = await axios.post(route("roles.assign-permissions", roleId), {
        permissions,
      })
      showToast(response.data.message, "success")
      fetchRoles()
    } catch (error) {
      showToast("Failed to assign permissions.", "error")
      console.error("Failed to assign permissions. Error:", error)
    }
  }

  const removePermission = async (roleId, permissionId) => {
    try {
      const response = await axios.post(route("roles.remove-permission", roleId), {
        permission_id: permissionId,
      })
      showToast(response.data.message, "success")
      fetchRoles()
    } catch (error) {
      showToast("Failed to remove permission.", "error")
      console.error("Failed to remove permission. Error:", error)
    }
  }

  const assignRolesToUser = async (userId, roles) => {
    try {
      const response = await axios.post(route("users.assign-role", userId), {
        roles,
      })
      showToast(response.data.message, "success")
      // Refresh data
      fetchRoles()
    } catch (error) {
      showToast("Failed to assign role to user.", "error")
      console.error("Failed to assign role to user. Error:", error)
    }
  }

  const assignRoleToUser = async (userId, roleId) => {
    try {
      const response = await axios.post(route("users.assign-role", userId), {
        role_id: roleId,
      });
      showToast(response.data.message, "success");
      fetchUsers(); // Refresh the user list
    } catch (error) {
      showToast("Failed to assign role to user.", "error");
      console.error("Failed to assign role to user. Error:", error);
    }
  };

  // Get users for a specific role
  const getRoleUsers = (roleId) => {
    return users.filter((user) => user.role && user.role.id === roleId);
  }

  return (
    <AdminLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Roles</h2>} user={auth.user}>
      <Head title="Roles" />
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="search"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              onClick={() => setShowFilterOptions(!showFilterOptions)}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={openUserRoleModal}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              <Users className="w-4 h-4" />
              Assign User Roles
            </button>
            <button
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Role
            </button>
          </div>
        </div>

        {showFilterOptions && (
          <div className="mb-4 p-4 border rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="mb-2 font-medium text-gray-700">Filter Options</h4>
                <p className="text-sm text-gray-600">Add your custom filter options here.</p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortConfig.key === "id" &&
                    sortConfig.direction &&
                    (sortConfig.direction === "asc" ? (
                      <SortAsc className="inline w-4 h-4 ml-1" />
                    ) : (
                      <SortDesc className="inline w-4 h-4 ml-1" />
                    ))}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("role_name")}
                >
                  Name
                  {sortConfig.key === "role_name" &&
                    sortConfig.direction &&
                    (sortConfig.direction === "asc" ? (
                      <SortAsc className="inline w-4 h-4 ml-1" />
                    ) : (
                      <SortDesc className="inline w-4 h-4 ml-1" />
                    ))}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                  onClick={() => handleSort("role_description")}
                >
                  Description
                  {sortConfig.key === "role_description" &&
                    sortConfig.direction &&
                    (sortConfig.direction === "asc" ? (
                      <SortAsc className="inline w-4 h-4 ml-1" />
                    ) : (
                      <SortDesc className="inline w-4 h-4 ml-1" />
                    ))}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{role.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{role.role_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{role.role_description}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {getRoleUsers(role.id)
                        .slice(0, 3)
                        .map((user) => (
                          <span
                            key={user.id}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs rounded-full"
                          >
                            {`${user.profile?.prof_fname || ""} ${user.profile?.prof_lname || ""}`.trim() || user.email}
                          </span>
                        ))}
                      {getRoleUsers(role.id).length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs rounded-full">
                          +{getRoleUsers(role.id).length - 3} more
                        </span>
                      )}
                      {getRoleUsers(role.id).length === 0 && (
                        <span className="text-gray-500 text-xs">No users</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <button
                      onClick={() => openPermissionModal(role)}
                      className="text-purple-600 hover:text-purple-800"
                      title="Manage Permissions"
                    >
                      <Shield className="inline w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openEditModal(role)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Role"
                    >
                      <Edit className="inline w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteRole(role.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Role"
                    >
                      <Trash2 className="inline w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500">
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex items-center text-sm text-gray-700">
            <span>Show</span>
            <select
              className="mx-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>items of {filteredRoles.length} total</span>
          </div>
          <nav className="flex items-center">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              <span className="sr-only">First page</span>
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="ml-2 p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex mx-2">
              {getPaginationRange(currentPage, totalPages).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-current={currentPage === pageNumber ? "page" : undefined}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="ml-2 p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              <span className="sr-only">Last page</span>
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </button>
          </nav>
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{selectedRole ? "Edit Role" : "Create New Role"}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                  <input
                    type="text"
                    name="role_name"
                    value={roleForm.role_name}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="role_description"
                    value={roleForm.role_description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {selectedRole ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Permissions Modal */}
      {isPermissionModalOpen && selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Permissions for {selectedRole.role_name}</h3>
                <button onClick={closePermissionModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handlePermissionSubmit}>
                <div className="mb-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center p-2 border rounded-md hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => handlePermissionChange(permission.id)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-sm">{permission.permission_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closePermissionModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Save Permissions
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign User Roles Modal */}
      {isUserRoleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Assign Role to User</h3>
                <button onClick={closeUserRoleModal} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User selection panel */}
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Select User</h4>
                  <input
                    type="search"
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="max-h-80 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className={`p-2 mb-1 rounded-md cursor-pointer ${selectedUser && selectedUser.id === user.id ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100"}`}
                      >
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && <div className="text-center text-gray-500 py-4">No users found</div>}
                  </div>
                </div>

                {/* Role assignment panel */}
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">
                  {selectedUser
                    ? `Assign Role to ${selectedUser.profile?.prof_fname || ""} ${selectedUser.profile?.prof_lname || ""}`.trim()
                    : "Select a user first"}
                  </h4>
                  {selectedUser ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        assignRoleToUser(selectedUser.id, selectedUserRoles[0]); // Assign the first selected role
                      }}
                    >
                      <div className="max-h-80 overflow-y-auto mb-4">
                        {roles.map((role) => (
                          <label
                            key={role.id}
                            className="flex items-center p-2 border rounded-md hover:bg-gray-50 mb-2"
                          >
                            <input
                              type="radio"
                              name="role"
                              value={role.id}
                              checked={selectedUserRoles.includes(role.id)}
                              onChange={() => setSelectedUserRoles([role.id])} // Allow only one role
                              className="form-radio h-5 w-5 text-blue-600"
                            />
                            <span className="ml-2 text-sm">{role.role_name}</span>
                          </label>
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={closeUserRoleModal}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                          Save Role
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center text-gray-500 py-10">Please select a user from the left panel</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
