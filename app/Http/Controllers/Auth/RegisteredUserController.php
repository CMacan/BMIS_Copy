<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use App\Models\ActivityLog;
use App\Models\Attachment;
use App\Models\Voter;
use App\Models\SignUpRequest;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Validator;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request) 
    {
        try {
            Log::info('Registration attempt', $request->all());

            $validatedData = $request->validate([
                'fname' => 'required|string|max:255',
                'lname' => 'required|string|max:255',
                'birthdate' => [
                    'required',
                    'date',
                    'before:' . now()->subYears(18)->format('Y-m-d'),
                ],
                'gender' => ['required', Rule::in(['male', 'female', 'other'])],
                'cstatus' => ['required', Rule::in(['single', 'married', 'widowed', 'divorced', 'separated'])],
                // Address fields
                'sign_up_city' => 'required|string|max:255',
                'sign_up_barangay' => 'required|string|max:255',
                'sign_up_region' => 'required|string|max:255',
                'sign_up_block' => 'nullable|string|max:255',
                'sign_up_sitio' => 'nullable|string|max:255',
                'sign_up_street' => 'nullable|string|max:255',
                'sign_up_houseno' => 'nullable|string|max:255',
                'sign_up_province' => 'required|string|max:255',
                // 'contact_number' => 'required|string|max:15',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'identity_proofs.*' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            ]);

            Log::info('Validation passed');

            // Check if voter exists
            $voter = Voter::whereRaw('LOWER(vote_fname) = LOWER(?)', [$request->fname])
                        ->whereRaw('LOWER(vote_lname) = LOWER(?)', [$request->lname])
                        // ->where('vote_birthdate', $request->birthdate)
                        ->first();

            $existingRequest = SignUpRequest::whereRaw('LOWER(sign_up_fname) = LOWER(?)', [$request->fname])
                ->whereRaw('LOWER(sign_up_lname) = LOWER(?)', [$request->lname])
                ->where('sign_up_birthdate', $request->birthdate)
                ->exists();
        
            if ($existingRequest) {
                return response()->json([
                    'message' => 'A registration request with these details already exists.',
                ], 409);
            }

            if ($voter) {
                Log::info('Voter found, proceeding to store request in sign_up_requests');
                
                $signUpRequest = SignUpRequest::create([
                    'sign_up_fname' => $request->fname,
                    'sign_up_lname' => $request->lname,
                    'sign_up_birthdate' => $request->birthdate,
                    'sign_up_gender' => $request->gender,
                    'sign_up_cstatus' => $request->cstatus,
                    'sign_up_is_voter' => true,
                    // Address fields
                    'sign_up_city' => $request->sign_up_city,
                    'sign_up_barangay' => $request->sign_up_barangay,
                    'sign_up_region' => $request->sign_up_region,
                    'sign_up_block' => $request->sign_up_block,
                    'sign_up_sitio' => $request->sign_up_sitio,
                    'sign_up_street' => $request->sign_up_street,
                    'sign_up_houseno' => $request->sign_up_houseno,
                    'sign_up_province' => $request->sign_up_province,
                    // 'sign_up_contact' => $request->contact_number,
                    'sign_up_email' => $request->email,
                    'sign_up_password' => Hash::make($request->password),
                ]);

                Log::info('Sign-up request stored', ['sign_up_request_id' => $signUpRequest->id]);

                // Store attachments
                if ($request->hasFile('identity_proofs')) {
                    foreach ($request->file('identity_proofs') as $file) {
                        $path = $file->store('identity_proofs', 'public');
                        Attachment::create([
                            'sign_up_id' => $signUpRequest->id,
                            'attach_path' => $path,
                            'attach_name' => $file->getClientOriginalName(),
                            'attach_type' => $file->getClientMimeType(),
                            'attach_src' => "sign_up_request",
                        ]);
                    }
                }

                return response()->json([
                    'message' => 'Your registration request has been submitted for review.',
                ], 201);
            }

            Log::info('Voter not found, proceeding with sign up request store');

            // Proceed with account creation
            // $profile = Profile::create([
            //     'prof_fname' => $request->fname,
            //     'prof_lname' => $request->lname,
            //     'prof_birthdate' => $request->birthdate,
            // ]);

            // $user = User::create([
            //     'prof_id' => $profile->id,
            //     'user_contact' => $request->contact_number,
            //     'email' => $request->email,
            //     'password' => Hash::make($request->password),
            // ]);

            // Log::info('User account created', ['user_id' => $user->id]);

            $signUpRequest = SignUpRequest::create([
                'sign_up_fname' => $request->fname,
                'sign_up_lname' => $request->lname,
                'sign_up_birthdate' => $request->birthdate,
                'sign_up_gender' => $request->gender,
                'sign_up_cstatus' => $request->cstatus,
                // Address fields
                'sign_up_city' => $request->sign_up_city,
                'sign_up_barangay' => $request->sign_up_barangay,
                'sign_up_region' => $request->sign_up_region,
                'sign_up_block' => $request->sign_up_block,
                'sign_up_sitio' => $request->sign_up_sitio,
                'sign_up_street' => $request->sign_up_street,
                'sign_up_houseno' => $request->sign_up_houseno,
                'sign_up_province' => $request->sign_up_province,
                // 'sign_up_contact' => $request->contact_number,
                'sign_up_email' => $request->email,
                'sign_up_password' => Hash::make($request->password),
            ]);

            Log::info('Sign-up request stored', ['sign_up_request_id' => $signUpRequest->id]);

            // Store attachments
            if ($request->hasFile('identity_proofs')) {
                foreach ($request->file('identity_proofs') as $file) {
                    $path = $file->store('identity_proofs', 'public');
                    Attachment::create([
                        'sign_up_id' => $signUpRequest->id,
                        'attach_path' => $path,
                        'attach_name' => $file->getClientOriginalName(),
                        'attach_type' => $file->getClientMimeType(),
                        'attach_src' => "registration",
                    ]);
                }
            }

            Log::info('Attachments stored');

            // event(new Registered($user));
            
            return response()->json([
                'message' => 'Your registration request has been submitted for review.',
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Validation failed', ['errors' => $e->errors()]);
    
            // Return validation errors as JSON for the frontend
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Registration failed: ' . $e->getMessage(), [
                'exception' => $e,
                'request' => $request->all(),
            ]);
    
            return response()->json([
                'message' => 'An unexpected error occurred. Please try again.',
            ], 500);
        }
    }
}
