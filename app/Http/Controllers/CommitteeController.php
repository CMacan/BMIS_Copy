<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Committee;
use App\Models\User; // Add this line to import the User model
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CommitteeController extends Controller
{
    // Display all committees
    public function index()
    {
        try {
            $committees = Committee::with('members')->get();
            return Inertia::render('Admin/Committee', [
                'committees' => $committees,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to load committees: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to load committees.');
        }
    }

    // Store a new committee
    public function store(Request $request)
    {
        $request->validate([
            'com_name' => 'required|string|max:255',
            'com_description' => 'nullable|string',
        ]);

        try {
            Committee::create([
                'com_name' => $request->com_name,
                'com_description' => $request->com_description,
            ]);

            return redirect()->back()->with('success', 'Committee created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create committee: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to create committee.');
        }
    }
    public function update(Request $request, Committee $committee)
    {
        $request->validate([
            'com_name' => 'required|string|max:255',
            'com_description' => 'nullable|string',
        ]);

        try {
            $committee->update([
                'com_name' => $request->com_name,
                'com_description' => $request->com_description,
            ]);

            return redirect()->back()->with('success', 'Committee updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update committee: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update committee.');
        }
    }
    public function delete(Committee $committee)
    {
        try {
            $committee->delete();
            return redirect()->back()->with('success', 'Committee deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete committee: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete committee.');
        }
    }
}