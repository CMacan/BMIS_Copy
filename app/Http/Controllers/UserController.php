<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::with('profile')->get();
        return Inertia::render('Admin/AllAccounts', [
            'users' => $users,
            'success' => session('success'),
            'error' => session('error')
        ]);
    }

    /**
     * Display a listing of the users.
     */
    public function allUsers()
    {
        try {
            $users = User::with('profile')->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'user_uname' => $user->user_uname,
                    'user_contact' => $user->user_contact,
                    'user_status' => $user->user_status,
                    'profile' => $user->profile ? : null,
                ];
            });

            return response()->json([
                'success' => true,
                'users' => $users,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching users: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users.',
            ], 500);
        }
    }

    /**
     * Store a newly created user in the database.
     */
    public function store(Request $request)
    {
        // Validate the request data
        Log::info('Raw request data received:', $request->all());
        $validated = $request->validate([
            // Profile data
            'prof_fname' => 'required|string|max:255',
            'prof_lname' => 'required|string|max:255',
            'prof_gender' => 'required|in:Male,Female,Other',
            'prof_birthdate' => 'required|date',
            'prof_cstatus' => 'required|in:Single,Married,Widowed,Separated',
            
            // User data
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::min(8)],
            
        ]);
        Log::info('Validated data:', $validated);
        
        try {
            DB::beginTransaction();
    
            // 1. Create Profile first
            $profile = Profile::create([
                'prof_fname' => $validated['prof_fname'],
                'prof_lname' => $validated['prof_lname'],
                'prof_gender' => $validated['prof_gender'],
                'prof_birthdate' => $validated['prof_birthdate'],
                'prof_cstatus' => $validated['prof_cstatus'],
            ]);
            Log::info('Created profile:', $profile->toArray());
    
            // 2. Create User with required fields
            $user = User::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'prof_id' => $profile->id,
                'user_status' => 'active', // Required field with default
                'user_uname' => strtolower($validated['prof_fname'].'.'.$validated['prof_lname']), // Optional but unique
            ]);
            Log::info('Created user:', $user->toArray());
    
            DB::commit();
    
            return redirect()->route('admin.all-accounts')
                ->with('success', 'Account created successfully');
    
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Account creation failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Account creation failed: '.$e->getMessage())
                ->withInput();
        }
    }
    
    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        // Load the user with their profile
        $user->load('profile');
        return response()->json($user);
    }

    /**
     * Update the specified user in the database.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'user_contact' => 'nullable|string|max:20',
        ]);

        try {
            $user->update([
                'email' => $validated['email'],
                'user_contact' => $validated['user_contact'] ?? $user->user_contact,
            ]);

            return back()->with('success', 'User updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update user: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified user from the database.
     */
    public function destroy(User $user)
    {
        try {
            if ($user->profile) {
                $user->profile->delete();
            }
            $user->delete();
            
            return back()->with('success', 'User deleted successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete user: '.$e->getMessage());
        }
    }

    public function user_request(Request $request)
    {
        return Inertia('User/Document_Request', [
            'auth' => [
                'user' => $request->user()->load('profile'),
            ]
        ]);
    }

  
    public function allAccounts()
    {
        $users = User::with('profile')->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'email' => $user->email,
                'user_uname' => $user->user_uname,
                'user_contact' => $user->user_contact,
                'user_status' => $user->user_status,
                'profile' => $user->profile ? [
                    'prof_birthdate' => $user->profile->prof_birthdate,
                    // Include other profile fields if needed
                ] : null
            ];
        });

        return Inertia::render('Admin/AllAccounts', [
            'users' => $users,
        ]);
    }
}