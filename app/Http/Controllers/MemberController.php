<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use App\Models\CommitteeMember;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\User;

class MemberController extends Controller
{
    // Store a new member
    public function store(Request $request)
    {
        Log::info('Received request to add a member', ['data' => $request->all()]); // Log request data

        $request->validate([
            'member_role' => 'required|string|max:255',
            'user_id' => 'required|integer|exists:users,id', // Ensure the user exists
            'com_id' => 'required|integer|exists:committees,id', // Ensure the committee exists
        ]);

        try {
            // Check if the member already exists in the committee
            $existingMember = CommitteeMember::where('com_id', $request->com_id)
                ->whereHas('member', function ($query) use ($request) {
                    $query->where('user_id', $request->user_id);
                })->exists();

            if ($existingMember) {
                Log::warning('User is already assigned to this committee', [
                    'user_id' => $request->user_id,
                    'com_id' => $request->com_id
                ]);
                return redirect()->back()->with('error', 'User is already assigned to this committee.');
            }

            // Create the member
            $member = Member::create([
                'member_role' => $request->member_role,
                'user_id' => $request->user_id,
            ]);

            Log::info('Member created', ['member' => $member]); // Log the created member

            // Assign the member to the committee
            $committeeMember = CommitteeMember::create([
                'com_id' => $request->com_id,
                'member_id' => $member->id,
                'com_mem_assigned_date' => now(),
            ]);

            Log::info('CommitteeMember created', ['committeeMember' => $committeeMember]); // Log the created committee member

            return redirect()->back()->with('success', 'Member created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to add member', ['error' => $e->getMessage()]);

            return redirect()->back()->with('error', 'Failed to create member.');
        }
    }

    public function getUserByProfile($profileId)
    {
        Log::info('Fetching user by profile ID', ['profileId' => $profileId]); // Log the profile ID

        $user = User::where('prof_id', $profileId)->first();

        Log::info('Fetched user', ['user' => $user]); // Log the fetched user

        if ($user) {
            return response()->json($user);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
   
    public function getMembersByCommittee($committeeId)
    {
        Log::info('Fetching members by committee ID', ['committeeId' => $committeeId]); // Log the committee ID

        $members = CommitteeMember::where('com_id', $committeeId)
            ->with(['member.user', 'member'])
            ->get();

        Log::info('Fetched members', ['members' => $members]); // Log the fetched members

        return response()->json($members);
    }
}