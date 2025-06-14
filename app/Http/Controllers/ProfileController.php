<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use App\Models\ActivityLog;
use App\Models\Household;
use App\Models\Profile;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user()->load('profile'); // Ensure profile is loaded

        // // Check if the user has a household, if not create one
        // if (!$user->profile->household) {
        //     $household = Household::create(['house_name' => 'Default Household']);
        //     $user->profile->household()->associate($household);
        //     $user->profile->save();
        // }
        
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
            'auth' => [
                'user' => $user,
                'profile' => $user->profile, // Pass profile data
                'household' => $user->profile->household, 
                'address' => $user->profile->household ? $user->profile->household->address : $user->profile->addresses,
                'householdMembers' => $user->profile->household ? $user->profile->household->profiles : [],
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $request->validate([
            'prof_fname' => 'required|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
            'prof_lname' => 'required|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
            'prof_mname' => 'nullable|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
            'prof_religion' => 'nullable|string|max:100|regex:/^[a-zA-Z\s\-]+$/',
            'prof_educattain' => 'nullable|string|max:100|regex:/^[a-zA-Z\s\-]+$/',
            'user_contact' => 'nullable|string|max:15|regex:/^[0-9\-\+\s]+$/',
        ]);
        
        $user = $request->user();
        $user->fill($request->validated());
        $src = $request->input('source');

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $user->save();

        // Update profile data
        $user->update($request->only([
            'user_contact',
        ]));

        // Update profile data
        $user->profile()->update($request->only([
            'prof_fname', 'prof_lname', 'prof_mname', 'prof_suffix', 
            'prof_gender', 'prof_religion', 'prof_cstatus', 
            'prof_educattain', 'prof_occupation'
        ]));

        
       // Log the update activity
       ActivityLog::create([
            'log_action' => $user->profile->prof_fname . ' ' . $user->profile->prof_lname . ' updated their profile',
            'log_table' => 'users',
            'log_table_id' => $user->id,
            // 'log_controller' => 'ProfileController',
            // 'log_con_funct' => 'update',
            'user_id' => $user->id,
        ]);

        if ($src == 'profile' || $src == '') {
            return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
        } elseif ($src == 'admin') {
            return Redirect::route('admin.account')->with('success', 'Account updated successfully.');
        }
    }

    /**
     * Update the user's profile information.
     */
    public function updateResident(ProfileUpdateRequest $request)
    {
        try {
            $request->validate([
                'prof_mname' => 'nullable|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
                'prof_suffix' => 'nullable|string|max:10',
                'prof_religion' => 'nullable|string|max:100|regex:/^[a-zA-Z\s\-]+$/',
                'prof_educattain' => 'nullable|string|max:100|regex:/^[a-zA-Z\s\-]+$/',
                'prof_occupation' => 'nullable|string|max:100',
                'prof_is_4ps' => 'nullable|boolean',
                'user_contact' => 'nullable|string|max:15|regex:/^[0-9\-\+\s]+$/',
            ]);

            Log::info('updateResident method hit. Validating request passed');

            $user = $request->user();
            $user->fill($request->validated());
            $src = $request->input('source');

            // if ($request->user()->isDirty('email')) {
            //     $request->user()->email_verified_at = null;
            // }

            $user->save();

            // Update profile data
            $user->update($request->only([
                'user_contact',
            ]));

            // Update profile data
            $user->profile()->update($request->only([
                'prof_mname', 'prof_suffix', 'prof_religion',
                'prof_educattain', 'prof_occupation', 'prof_is_4ps',
            ]));

            // Log the update activity
            ActivityLog::create([
                'log_action' => $user->profile->prof_fname . ' ' . $user->profile->prof_lname . ' updated their profile',
                'log_table' => 'users',
                'log_table_id' => $user->id,
                'user_id' => $user->id,
            ]);

            if ($src == 'profile' || $src == '') {
                return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
            } elseif ($src == 'admin') {
                return Redirect::route('admin.account')->with('success', 'Account updated successfully.');
            }
        } catch (\Exception $e) {
            Log::error('Failed to update resident profile: ' . $e->getMessage());
            return Redirect::back()->with('error', 'Failed to update profile. Please try again.');
        }
    }

    /**
     * Update the user's profile information.
     */
    public function upload_picture(Request $request)
    {
        try {
            $request->validate([
                'prof_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($request->hasFile('prof_picture')) {
                $file = $request->file('prof_picture');

                $user = $request->user();

                // If there is an existing profile picture, delete it from the storage
                if ($user->profile->prof_picture) {
                    $oldFilePath = $user->profile->prof_picture;

                    // Check if the file exists before deleting
                    if (Storage::exists($oldFilePath)) {
                        Storage::delete($oldFilePath);
                        Log::info('Old profile picture deleted: ' . $oldFilePath);
                    } else {
                        Log::warning('File not found for deletion: ' . $oldFilePath);
                    }
                }
                $path = $file->store('profile_pictures', 'public');

                // Save the new profile picture path
                $user->profile->prof_picture = $path;
                Log::info('Stored profile picture path: ' . $user->profile->prof_picture);
                $user->profile->save();

                // Log the update activity
                ActivityLog::create([
                    'log_action' => $user->profile->prof_fname . ' ' . $user->profile->prof_lname . ' updated their profile picture',
                    'log_table' => 'users',
                    'log_table_id' => $user->id,
                    'user_id' => $user->id,
                ]);

                return response()->json(['message' => 'Profile picture updated', 'path' => $path, 'prof_picture' => $user->profile->prof_picture]);
            }

            return response()->json(['error' => 'No file received'], 400);
        } catch (\Exception $e) {
            Log::error('Failed to upload profile picture: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to upload profile picture. Please try again.'], 500);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Retrieve all profiles.
     */
    public function getAllProfiles()
    {
        $profiles = Profile::with('user')->get(); // Ensure the user relationship is loaded
        return response()->json($profiles);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'prof_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'prof_fname' => 'required|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
                'prof_lname' => 'required|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
                'prof_mname' => 'nullable|string|max:255|regex:/^[a-zA-Z\s\-]+$/',
                'prof_religion' => 'nullable|string|max:100|regex:/^[a-zA-Z\s\-]+$/',
                'prof_educattain' => 'nullable|string|max:100|regex:/^[a-zA-Z\s\-]+$/',
                'prof_gender' => 'required|in:Male,Female,Other',
                'prof_birthdate' => 'required|date',
                'prof_suffix' => 'nullable|string|max:10',
                'prof_cstatus' => 'nullable|string|max:50',
                'prof_occupation' => 'nullable|string|max:100',
                'prof_age' => 'required|integer|min:1',
                'prof_restype' => 'nullable|string|max:50',
                'prof_start_date' => 'nullable|date',
                'prof_res_type' => 'nullable|string|max:50',
                'prof_demog_type' => 'nullable|string|max:50',
                'prof_is_verified' => 'boolean',
                'prof_is_demog_verified' => 'boolean',
                'applied_form' => 'nullable|string',
                'prof_is_house_head' => 'boolean',
                'house_id' => 'nullable|integer|exists:households,id',
            ]);

            // Handle profile picture upload if exists
            $prof_picture = null;
            if ($request->hasFile('prof_picture')) {
                $prof_picture = $request->file('prof_picture')->store('profile_pictures', 'public');
            }

            // Create a new profile
            $profile = Profile::create([
                'prof_picture' => $prof_picture,
                'prof_fname' => $request->prof_fname,
                'prof_lname' => $request->prof_lname,
                'prof_mname' => $request->prof_mname,
                'prof_gender' => $request->prof_gender,
                'prof_birthdate' => $request->prof_birthdate,
                'prof_suffix' => $request->prof_suffix,
                'prof_religion' => $request->prof_religion,
                'prof_cstatus' => $request->prof_cstatus,
                'prof_educattain' => $request->prof_educattain,
                'prof_occupation' => $request->prof_occupation,
                'prof_age' => $request->prof_age,
                'prof_restype' => $request->prof_restype,
                'prof_start_date' => $request->prof_start_date,
                'prof_res_type' => $request->prof_res_type,
                'prof_demog_type' => $request->prof_demog_type,
                'prof_is_verified' => $request->prof_is_verified ?? false,
                'prof_is_demog_verified' => $request->prof_is_demog_verified ?? false,
                'applied_form' => $request->applied_form,
                'prof_is_house_head' => $request->prof_is_house_head ?? false,
                'house_id' => $request->house_id,
            ]);

            return redirect()->back()->with('success', 'Profile created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create profile: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create profile.');
        }
    }
}
