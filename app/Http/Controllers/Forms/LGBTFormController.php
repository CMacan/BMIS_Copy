<?php

namespace App\Http\Controllers\Forms;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\TempSubmission;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Artisan;


class LGBTFormController extends Controller
{
    public function showSelfForm()
    {
        $user = Auth::user();
        $profile = $user->profile;
        $address = $profile->household->address;

        return Inertia::render('User/Forms/LGBTForm', [
            'registrationType' => 'self',
            'userData' => [
                'firstName' => $profile->prof_fname,
                'middleName' => $profile->prof_mname,
                'lastName' => $profile->prof_lname,
                'city' => $address->addr_city,
                'block' => $address->addr_block,
                'province' => $address->addr_province,
                'barangay' => $address->addr_barangay ?? "",
                'sitio' => $address->addr_sitio,
                'birthDate' => $profile->prof_birthdate,
                'age' => $profile->prof_age,
                'occupation' => $profile->prof_occupation,
                'sex' => $profile->prof_sex,
                'status' => $profile->prof_cstatus,
                'education' => $profile->prof_educattain,
                'contact' => $user->user_contact,
            ],
        ]);
    }

    public function showHouseholdForm()
    {
        return Inertia::render('LGBTForm', [
            'registrationType' => 'household',
        ]);
    }

    public function submit(Request $request)
    {
        Log::info('LGBT Form submission started.');

        try {
            Log::info('Request data:', $request->all());

            // Validate the form data
            $validatedData = $request->validate([
                'firstName' => 'required|string|max:255',
                'middleName' => 'nullable|string|max:255',
                'lastName' => 'required|string|max:255',
                'birthDate' => 'required|date',
                'age' => 'required|integer|min:0',
                'city' => 'required|string|max:255',
                'province' => 'required|string|max:255',
                'block' => 'required|string|max:255',
                'barangay' => 'required|string|max:255',
                'sitio' => 'required|string|max:255',
                'occupation' => 'required|string|max:255',
                'sex' => 'required|string|max:255',
                'civilStatus' => 'required|string|max:255',
                'education' => 'required|string|max:255',
                'contact' => 'required|string|max:255',
                'lgbt_gender_identity' => 'required|string|max:255',
                'lgbt_sexual_orient' => 'required|string|max:255',
                'signature' => 'required|file|mimes:png,jpg,jpeg|max:2048', // Updated: Ensures correct file validation
                'formType' => 'required|string|max:255',
            ]);

            Log::info('Validation successful', $validatedData);

            // Ensure profile exists
            $profile = Auth::user()->profile;
            if (!$profile) {
                Log::error('User profile not found');
                return back()->withErrors(['message' => 'User profile not found.']);
            }

            Log::info('User profile found: ' . $profile->id);

             // Handle signature file upload
             if ($request->hasFile('signature')) {
                $signatureFile = $request->file('signature');
                $signatureName = time() . '_' . uniqid() . '.' . $signatureFile->getClientOriginalExtension();
                $signaturePath = 'signatures/' . $signatureName;

                // Store the file in the storage/app/public/signatures directory
                $signatureFile->storeAs('signatures', $signatureName, 'public');
                
                // Create a symbolic link if it doesn't exist
                if (!file_exists(public_path('storage'))) {
                    Artisan::call('storage:link');
                }

                Log::info('Signature saved at: ' . $signaturePath);
            } else {
                Log::error('Signature file not found in request.');
                return response()->json(['message' => 'Signature is required.'], 400);
            }


            // Save to database
            $submission = TempSubmission::create([
                'profile_id' => $profile->id,
                'data' => json_encode($validatedData),
                'signature' => $signaturePath, // Stored as string (file path)
            ]);

            Log::info('Form submitted successfully', ['submission_id' => $submission->id]);

            // Update applied_form column
            $profile->update([
                'applied_form' => $validatedData['formType'],
            ]);

            Log::info('User profile updated with formType');

           // Return a JSON response with a success message and the redirect URL
           return response()->json([
            'message' => 'LGBT Intake Form submitted successfully',
            'redirect' => route('applications.index')
        ], 200);

        } catch (\Throwable $e) {
            Log::error('Form submission error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['message' => 'An error occurred. Please check the logs.']);
        }
    }
   
}
