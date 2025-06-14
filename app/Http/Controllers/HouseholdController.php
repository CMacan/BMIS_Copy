<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Models\Address;
use App\Models\Profile;
use Illuminate\Http\Request;
use App\Models\ActivityLog;
use App\Models\HouseholdJoinRequest;
use Illuminate\Support\Facades\Log;

class HouseholdController extends Controller
{
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'addr_city' => 'nullable|string|max:255',
            'addr_barangay' => 'nullable|string|max:255',
            'addr_region' => 'nullable|string|max:255',
            'addr_block' => 'nullable|string|max:255',
            'addr_sitio' => 'nullable|string|max:255',
            'addr_street' => 'nullable|string|max:255',
            'addr_houseno' => 'nullable|string|max:255',
            'addr_province' => 'nullable|string|max:255',
            'addr_type' => 'nullable|string|max:255',
            'house_name' => 'nullable|string|max:255',
            'house_type' => 'nullable|string|max:255',
            'house_ownership' => 'nullable|string|max:255',
            'house_year' => 'nullable|integer',
        ]);

        // Find the household by ID
        $household = Household::findOrFail($user->profile->house_id);

        // Update household information
        $household->update([
            'house_name' => $request->house_name,
            'house_type' => $request->house_type,
            'house_ownership' => $request->house_ownership,
            //'house_year' => $request->house_year,
        ]);

        // Update address information
        $address = Address::where('house_id', $household->id)->first();
        if ($address) {
            $address->update($request->only([
                'addr_city', 
                'addr_barangay', 
                'addr_region', 
                'addr_block',
                'addr_sitio', 
                'addr_street', 
                'addr_houseno', 
                'addr_province',
                'addr_type'
            ]));
        } else {
            Address::create(array_merge($request->only([
                'addr_city', 
                'addr_barangay', 
                'addr_region', 
                'addr_block',
                'addr_sitio', 
                'addr_street', 
                'addr_houseno', 
                'addr_province',
                'addr_type'
            ]), ['house_id' => $household->id]));
        }

        return redirect()->route('profile.edit')->with('success', 'Household updated successfully.');
    }
    
    /**
     * Create a new household.
     */
    public function store(Request $request)
    {
        // try {
        //     $household = Household::where('house_name', $request->house_name)->first();
        //     if ($household) {
        //         return back()->withErrors(['error' => 'Household name already exists.']);
        //     }
        // } catch (\Exception $e) {
        //     // Fallback to ProfileVer if ProfileVerification doesn't exist
        //     $household = Household::where('house_name', $request->house_name)->first();
        //     if ($household) {
        //         return back()->withErrors(['error' => 'Household name already exists.']);
        //     }
        // }
        $request->validate([
            'house_name' => 'required|string|max:255',
            'house_type' => 'nullable|string|max:255',
            'house_year' => 'nullable|integer',
            'addr_city' => 'nullable|string|max:255',
            'addr_barangay' => 'nullable|string|max:255',
            'addr_region' => 'nullable|string|max:255',
            'addr_block' => 'nullable|string|max:255',
            'addr_sitio' => 'nullable|string|max:255',
            'addr_street' => 'nullable|string|max:255',
            'addr_houseno' => 'nullable|string|max:255',
            'addr_province' => 'nullable|string|max:255',
            'addr_type' => 'nullable|string|max:255',
        ]);

        try {
            $household = Household::create([
                'house_name' => $request->house_name,
                'house_type' => $request->house_type,
                // 'house_ownership' => 'owner', // Uncomment if needed
                // 'house_year' => $request->house_year, // Uncomment if needed
            ]);
    
            if (!$household->id) {
                return back()->withErrors(['error' => 'Failed to create household.']);
            }
    
            $user = $request->user();
    
            $user->profile->update([
                'prof_is_house_head' => true,
            ]);
    
            $user->profile->household()->associate($household);
            $user->profile->save();
    
            Address::create([
                'addr_city' => $request->addr_city,
                'addr_barangay' => $request->addr_barangay,
                'addr_region' => $request->addr_region,
                'addr_block' => $request->addr_block,
                'addr_sitio' => $request->addr_sitio,
                'addr_street' => $request->addr_street,
                'addr_houseno' => $request->addr_houseno,
                'addr_province' => $request->addr_province,
                'addr_type' => $request->addr_type,
                'house_id' => $household->id,
            ]);
    
            ActivityLog::create([
                'log_action' => $user->profile->prof_fname . ' ' . $user->profile->prof_lname . ' created household: ' . $household->house_name,
                'log_table' => 'households', // Log to households table
                'log_table_id' => $household->id, // Use household ID
                'user_id' => $user->id,
            ]);
    
            return redirect()->route('profile.edit')->with('success', 'Household created successfully.');
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Error creating household: ' . $e->getMessage());
    
            return back()->withErrors(['error' => 'Failed to create household. Please try again later.']);
        }
    }

    /**
     * Join an existing household.
     */
    public function join(Request $request)
    {
        $request->validate([
            'house_id' => 'required|integer|exists:households,id',
        ]);

        $household = Household::findOrFail($request->house_id);

        // Create a join request
        $joinRequest = HouseholdJoinRequest::create([
            'user_id' => $request->user()->id,
            'house_id' => $household->id,
            'status' => 'pending',
        ]);

        // Log the join request activity
        ActivityLog::create([
            'log_action' => $request->user()->profile->prof_fname . ' ' . $request->user()->profile->prof_lname . ' Requested To Join ' . $household->house_name . ' Household',
            'log_table' => 'household_join_requests',
            'log_table_id' => $joinRequest->id,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('profile.edit')->with('success', 'Join request sent successfully.');
    }

    public function approveJoinRequest($id)
    {
        $joinRequest = HouseholdJoinRequest::findOrFail($id);
        $joinRequest->update(['status' => 'approved']);

        $user = $joinRequest->user;
        $household = $joinRequest->household;

        $user->profile->household()->associate($household);
        $user->profile->save();

        // Log the approval activity
        ActivityLog::create([
            'log_action' => $user->profile->prof_fname . ' ' . $user->profile->prof_lname . ' Was Approved To Join A Household',
            'log_table' => 'household_join_requests',
            'log_table_id' => $joinRequest->id,
            'user_id' => $user->id,
        ]);

        return redirect()->route('profile.edit')->with('success', 'Join request approved successfully.');
    }

    public function rejectJoinRequest($id)
    {
        $joinRequest = HouseholdJoinRequest::findOrFail($id);
        $joinRequest->update(['status' => 'rejected']);

        // Log the rejection activity
        ActivityLog::create([
            'log_action' => $joinRequest->user->profile->prof_fname . ' ' . $joinRequest->user->profile->prof_lname . ' Was Rejected To Join A Household',
            'log_table' => 'household_join_requests',
            'log_table_id' => $joinRequest->id,
            'user_id' => $joinRequest->user->id,
        ]);

        return redirect()->route('profile.edit')->with('success', 'Join request rejected successfully.');
    }
}
