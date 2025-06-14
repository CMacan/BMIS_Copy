<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    /**
     * Display a listing of roles and their permissions.
     */
    public function index()
    {
        try {
            $roles = Role::with('permissions')->get();
            $permissions = Permission::all();

            return response()->json([
                'roles' => $roles,
                'permissions' => $permissions,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching roles and permissions: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to fetch roles and permissions.'], 500);
        }
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $request->validate([
            'role_name' => 'required|string|max:255|unique:roles',
            'role_descr' => 'nullable|string|max:255',
        ]);

        try {
            $role = Role::create($request->only('role_name', 'role_descr'));

            return response()->json([
                'message' => 'Role created successfully.',
                'role' => $role,
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating role: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to create role.'], 500);
        }
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'role_name' => 'required|string|max:255|unique:roles,role_name,' . $role->id,
            'role_descr' => 'nullable|string|max:255',
        ]);

        try {
            $role->update($request->only('role_name', 'role_descr'));

            return response()->json([
                'message' => 'Role updated successfully.',
                'role' => $role,
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating role: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to update role.'], 500);
        }
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        try {
            $role->delete();

            return response()->json([
                'message' => 'Role deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting role: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to delete role.'], 500);
        }
    }

    /**
     * Assign permissions to a role.
     */
    public function assignPermission(Request $request, Role $role)
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        try {
            $role->permissions()->sync($request->permissions);

            return response()->json([
                'message' => 'Permissions assigned successfully.',
                'role' => $role->load('permissions'),
            ]);
        } catch (\Exception $e) {
            Log::error('Error assigning permissions to role: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to assign permissions.'], 500);
        }
    }

    /**
     * Assign roles to a user.
     */
    // public function assignRoles(Request $request, User $user)
    // {
    //     $request->validate([
    //         'roles' => 'required|array',
    //         'roles.*' => 'exists:roles,id',
    //     ]);

    //     try {
    //         $user->roles()->sync($request->roles);

    //         return response()->json(['message' => 'Roles updated successfully.']);
    //     } catch (\Exception $e) {
    //         Log::error('Error assigning roles to user: ' . $e->getMessage());
    //         return response()->json(['message' => 'Failed to assign roles.'], 500);
    //     }
    // }

    /**
     * Assign a specific role to a user.
     */
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role_id' => 'required|exists:roles,id', // Ensure the role exists
        ]);

        try {
            // Assign the role to the user
            $user->role_id = $request->role_id;
            $user->save();

            return response()->json(['message' => 'Role assigned successfully.']);
        } catch (\Exception $e) {
            Log::error('Error assigning role to user: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to assign role.'], 500);
        }
    }

    /**
     * Remove a specific permission from a role.
     */
    public function removePermission(Request $request, Role $role)
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id',
        ]);

        try {
            $role->permissions()->detach($request->permission_id);

            return response()->json([
                'message' => 'Permission removed successfully.',
                'role' => $role->load('permissions'),
            ]);
        } catch (\Exception $e) {
            Log::error('Error removing permission from role: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to remove permission.'], 500);
        }
    }
}
