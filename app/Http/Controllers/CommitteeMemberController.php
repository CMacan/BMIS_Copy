<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CommitteeMember;
use Inertia\Inertia;

class CommitteeMemberController extends Controller
{
    // Assign a member to a committee
    public function store(Request $request)
    {
        $request->validate([
            'com_id' => 'required|exists:committees,id',
            'member_id' => 'required|exists:members,id',
            'com_mem_assigned_date' => 'required|date',
        ]);

        CommitteeMember::create([
            'com_id' => $request->com_id,
            'member_id' => $request->member_id,
            'com_mem_assigned_date' => $request->com_mem_assigned_date,
        ]);

        return redirect()->back()->with('success', 'Member assigned to committee successfully.');
    }
}