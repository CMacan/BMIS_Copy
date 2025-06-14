<?php

namespace App\Http\Controllers;

use App\Models\ProfileVer;
use Illuminate\Http\Request;    
use Inertia\Inertia;

class ProfileVerificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Services/ProfileVerification');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'last_name' => 'required|string',
            'first_name' => 'required|string',
            'middle_name' => 'nullable|string',
            'suffix' => 'nullable|string',
            'birthdate' => 'required|date',
            'gender' => 'required|string',
            'email' => 'required|email',
            'contact_number' => 'required|string',
            'religion' => 'nullable|string',
            'civil_status' => 'required|string',
            'education' => 'nullable|string',
            'occupation' => 'nullable|string',
            'emergency_contact_name' => 'required|string',
            'emergency_contact_relationship' => 'required|string',
            'emergency_contact_number' => 'required|string',
            'residency_type' => 'required|string',
            'block_lot' => 'required|string',
            'street' => 'required|string',
            'house_no' => 'required|string',
            'years_in_sawang' => 'required|numeric|min:0',
        ]);

        $profile = ProfileVer::create($validated);

        return redirect()->route('profile.identity', ['profile' => $profile->id]);
    }
}
