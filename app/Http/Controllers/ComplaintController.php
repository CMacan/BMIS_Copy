<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    //a method that returns all complaints
    public function index()
    {
        $complaints = Complaint::with('profile')->latest()->get();
        return Inertia::render('Admin/Complaint/AdminComplaint', [
            'complaints' => $complaints
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'comp_title' => 'required|string|max:255',
            'comp_category' => 'required|string|max:255',
            'comp_description' => 'required|string',
            'comp_location' => 'nullable|string|max:255',
        ]);

        $complaint = Complaint::create([
            'comp_title' => $validated['comp_title'],
            'comp_category' => $validated['comp_category'],
            'comp_description' => $validated['comp_description'],
            'comp_location' => $validated['comp_location'],
            'user_id' => auth()->id(),
            'comp_status' => 'pending',
            'comp_priority_level' => 1,
        ]);

        return Inertia::render('Dashboard', [
            'message' => 'Complaint submitted successfully!'
        ]);
    }
    // public function show($id)
    // {
    //     $complaint = Complaint::with('user')->findOrFail($id);
    //     return Inertia::render('Admin/Complaint/ComplaintDetails', [
    //         'complaint' => $complaint
    //     ]);
    // }

    // public function show($id)
    // {
    //     $complaint = Complaint::with('profile')->findOrFail($id);
    //     return Inertia::render('Admin/Complaint/ComplaintDetails', [
    //         'complaint' => $complaint
    //     ]);
    // }
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,in progress,completed,rejected',
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->comp_status = $validated['status'];
        $complaint->save();

        return response()->json(['message' => 'Status updated successfully']);
    }
    
}