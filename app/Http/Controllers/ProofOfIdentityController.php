<?php

namespace App\Http\Controllers;

use App\Models\ProfileVer;
use App\Models\DocumentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProofOfIdentityController extends Controller
{
    public function index(Request $request)
    {
        $profile = null;
        if ($request->has('profile')) {
            $profile = ProfileVer::findOrFail($request->profile);
        }
        
        return Inertia::render('Services/ProofOfIdentity', [
            'profile' => $profile,
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Store method called with data:', $request->all());
        
        $validated = $request->validate([
            'signature' => 'required|string',
            'idImage' => 'required|image|max:5120', // 5MB max
            'ticketID' => 'nullable|string',
            'profile' => 'nullable|numeric', // Add this to capture profile ID
        ]);

        // Store the signature as base64 in database or as an image file
        $signatureImage = $this->saveBase64Image($validated['signature'], 'signatures');

        // Store the ID image
        $idImagePath = $request->file('idImage')->store('id-images', 'public');

        // Generate ticket ID if not provided
        $ticketID = $request->input('ticketID') ?: $this->generateTicketID();
        
        Log::info('Using ticket ID:', ['ticketID' => $ticketID]);

        // Find or create profile
        $profile = null;
        
        if ($request->has('profile') && $request->profile) {
            $profile = ProfileVer::find($request->profile);
            Log::info('Found profile by ID:', ['profile_id' => $request->profile, 'found' => (bool)$profile]);
        }
        
        if (!$profile && $ticketID) {
            $profile = ProfileVer::where('ticket_id', $ticketID)->first();
            Log::info('Found profile by ticket ID:', ['ticket_id' => $ticketID, 'found' => (bool)$profile]);
        }

        if (!$profile) {
            // Create a new profile if none exists
            $profile = new ProfileVer();
            Log::info('Creating new profile');
        }

        // Update the profile with the proof of identity data
        $profile->signature_path = $signatureImage;
        $profile->id_image_path = $idImagePath;
        $profile->ticket_id = $ticketID; // Ensure ticket_id is set
        $profile->status = 'pending';
        $profile->save();
        
        Log::info('Profile saved with ID:', ['profile_id' => $profile->id, 'ticket_id' => $profile->ticket_id]);

        // Return success response with ticket ID
        return response()->json([
            'success' => true,
            'ticketID' => $ticketID
        ]);
    }

    public function submit(Request $request)
    {
        Log::info('Submit method called with data:', $request->all());

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'birthdate' => 'required|date',
            'civil_status' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'contact_number' => 'required|string|max:20',
            'street' => 'required|string|max:255',
            'block_lot' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors: ' . json_encode($validator->errors()->all()));
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $ticketID = Str::uuid();

            $profile = new ProfileVer([
                'ticket_id' => $ticketID,
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'birthdate' => $request->input('birthdate'),
                'civil_status' => $request->input('civil_status'),
                'email' => $request->input('email'),
                'contact_number' => $request->input('contact_number'),
                'street' => $request->input('street'),
                'block_lot' => $request->input('block_lot'),
                'barangay' => $request->input('barangay'),
                'city' => $request->input('city'),
                'province' => $request->input('province'),
                'zip_code' => $request->input('zip_code'),
                'status' => 'pending',
            ]);

            $profile->save();

            Log::info('Profile created successfully with ticket ID: ' . $ticketID);

            return response()->json([
                'success' => true,
                'ticketID' => $ticketID,
                'message' => 'Profile created successfully. Your ticket ID is ' . $ticketID
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating profile: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create profile: ' . $e->getMessage()
            ], 500);
        }
    }

    public function complete(Request $request)
    {
        Log::info('Complete method called with data:', $request->all());
        
        try {
            $ticketID = $request->input('ticketID');
            
            if (!$ticketID) {
                Log::error('No ticket ID provided');
                return response()->json([
                    'success' => false,
                    'message' => 'No ticket ID provided'
                ], 400);
            }

            // Find the profile by ticket ID
            $profile = ProfileVer::where('ticket_id', $ticketID)->first();
            
            if (!$profile) {
                Log::error('Profile not found for ticket ID: ' . $ticketID);
                return response()->json([
                    'success' => false,
                    'message' => 'Profile not found'
                ], 404);
            }
            
            // Update the profile status
            $profile->status = 'submitted';
            $profile->submitted_at = now();
            $profile->save();
            
            // Create a document request entry for admin approval
            // This will automatically add the request to the document requests list
            $documentRequest = new DocumentRequest();
            $documentRequest->user_id = auth()->id() ?? null;
            $documentRequest->document_type = 'Barangay Clearance'; // Set as Barangay Clearance
            $documentRequest->purpose = 'Identity verification and profile registration';
            $documentRequest->copies = 1;
            $documentRequest->status = 'pending';
            $documentRequest->name = $profile->first_name . ' ' . $profile->last_name;
            
            // Combine address components if available
            $address = '';
            if (!empty($profile->street)) {
                $address .= $profile->street;
            }
            if (!empty($profile->block_lot)) {
                $address .= ', Block ' . $profile->block_lot;
            }
            if (empty($address)) {
                $address = 'N/A';
            }
            
            $documentRequest->address = $address;
            $documentRequest->block = $profile->block_lot ?? 'N/A';
            
            // Calculate age from birthdate if available
            $age = null;
            if (!empty($profile->birthdate)) {
                $age = \Carbon\Carbon::parse($profile->birthdate)->age;
            }
            $documentRequest->age = $age ?? 0;
            
            $documentRequest->civil_status = $profile->civil_status ?? 'Single';
            $documentRequest->requester_name = $profile->first_name . ' ' . $profile->last_name;
            $documentRequest->requester_email = $profile->email;
            $documentRequest->requester_contact = $profile->contact_number;
            $documentRequest->reference_id = $profile->ticket_id; // Store the ticket ID as reference
            
            $documentRequest->save();
            
            Log::info('Profile updated and document request created successfully', [
                'ticket_id' => $ticketID, 
                'document_request_id' => $documentRequest->id
            ]);

            // Check if this is an AJAX request
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Your application has been submitted successfully.',
                    'redirect' => route('services')
                ]);
            }

            // For regular requests, redirect
            return redirect()->route('services')->with('success', 'Your application has been submitted successfully. Your ticket ID is ' . $profile->ticket_id);
        } catch (\Exception $e) {
            Log::error('Error in complete method: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkStatus(Request $request)
    {
        $ticketID = $request->input('ticketID');
        $profile = null;
        
        if ($ticketID) {
            $profile = ProfileVer::where('ticket_id', $ticketID)->first();
        }
        
        return Inertia::render('Services/RequestStatus', [
            'profile' => $profile,
            'ticketID' => $ticketID
        ]);
    }

    private function saveBase64Image($base64Image, $folder)
    {
        // Remove data:image/png;base64, from the base64 string
        $image_parts = explode(";base64,", $base64Image);
        $image_base64 = base64_decode($image_parts[1]);
        $imageName = uniqid() . '.png';
        
        Storage::disk('public')->put($folder . '/' . $imageName, $image_base64);
        
        return $folder . '/' . $imageName;
    }

    private function generateTicketID()
    {
        // Generate a unique ticket ID
        $ticketID = strtoupper(substr(md5(uniqid()), 0, 10));
        
        // Check if the ticket ID already exists
        while (ProfileVer::where('ticket_id', $ticketID)->exists()) {
            $ticketID = strtoupper(substr(md5(uniqid()), 0, 10));
        }
        
        return $ticketID;
    }
}
