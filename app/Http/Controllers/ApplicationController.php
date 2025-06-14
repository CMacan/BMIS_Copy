<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TempSubmission;
use App\Models\Lgbt;
use App\Models\Pwd;
use App\Models\Women;
use App\Models\Children;    
use App\Models\SectoralForm;
use App\Models\ResidentSectorMembership;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Log;
class ApplicationController extends Controller
{

    public function index()
{
    $user = Auth::user();
    $profile = $user->profile;

    if (!$profile) {
        return response()->json(['error' => 'No profile found for this user.'], 404);
    }

    // Fetch submissions with related sectoral form
    $submissions = TempSubmission::where('profile_id', $profile->id)
        ->with(['sectoralForm' => function($query) {
            $query->select('id', 'name'); // Only select the columns you need
        }])
        ->get();

    // Map the submissions with form name
    $applications = $submissions->map(function ($submission) {
        return [
            'id' => $submission->id,
            'formType' => $submission->sectoralForm->name ?? 'Unknown Form',
            'status' => $submission->status,
            'submissionDate' => $submission->created_at->format('Y-m-d'),
        ];
    });

    return Inertia::render('User/Application/applications', [
        'applications' => $applications,
        'auth' => ['user' => $user],
    ]);
}

    public function adminIndex( Request $request)
    {
        $tab = $request->query('tabs', 'all');
        // Fetch all submissions
        $submissions = TempSubmission::with(['profile', 'sectoralForm', 'approvedBy', 'declinedBy'])->get();
        
        
    
        // Map the submissions
        $applications = $submissions->map(function ($submission) {
            $profile = $submission->profile;
            $form = $submission->sectoralForm;
            $profilePictureUrl = null;
            if ($submission->profile && $submission->profile->prof_picture) {
                $profilePictureUrl = Storage::url($submission->profile->prof_picture);
            }
            $formImage = null;
        if ($form && $form->image) {
            $formImage = str_replace('sectoral/', 'images/', $form->image);
        }
        
            return [
                'id' => $submission->id,
                'name' => $profile->prof_fname . ' ' . $profile->prof_lname,
                'profilePictureUrl' => $profilePictureUrl,
                'formType' => $form ? $form->name : 'N/A',
                 'formImage' => $formImage,
                'status' => $submission->status,
                'submissionDate' => $submission->created_at->format('Y-m-d'),
                'approved_by' => $submission->approved_by,
                'approved_at' => $submission->approved_at,
                'declined_by' => $submission->declined_by,
                'declined_at' => $submission->declined_at,
            ];
        });

        return Inertia::render('Admin/Sectoral/FormsToVerify', [
            'applications' => $applications,
            'activeTab' => $tab,
        ]);
    }
   // Ensure the show method properly formats the data for the frontend
   public function show($id)
{
    try {
        Log::debug('API Request for submission ID:', ['id' => $id]);
        // Include sectoralForm in the with() clause
        $submission = TempSubmission::with(['profile', 'declinedBy', 'sectoralForm'])->findOrFail($id);

        Log::debug('Raw submission data:', [
            'submission' => $submission->toArray(),
            'data_column' => $submission->data
        ]);

        $formData = [];
        if (!empty($submission->data)) {
            $formData = json_decode($submission->data, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Invalid JSON data: ' . json_last_error_msg());
            }
        }

        // Flatten the form data
        $flattened = self::flattenArray($formData);

        // Handle signature URL properly
        $signatureUrl = $submission->signature ? Storage::url($submission->signature) : null;
        Log::debug("Signature URL:", ['url' => $signatureUrl]);
        
        // Get profile picture URL if exists
        $profilePictureUrl = null;
        if ($submission->profile && $submission->profile->prof_picture) {
            $profilePictureUrl = Storage::url($submission->profile->prof_picture);
        }
        Log::debug('Profile picture URL:', ['url' => $profilePictureUrl]);

        // Get sectoral form image URL if exists (modified for public/images)
        $formImage = null;
        if ($submission->sectoralForm && $submission->sectoralForm->image) {
            $formImage = str_replace('sectoral/', 'images/', $submission->sectoralForm->image);
        }
        Log::debug('Form image URL:', ['url' => $formImage]);

        // Get approver name if exists
        $approvedByName = null;
        if ($submission->approved_by) {
            $approver = User::with('profile')->find($submission->approved_by);
            if ($approver && $approver->profile) {
                $approvedByName = trim($approver->profile->prof_fname . ' ' . $approver->profile->prof_lname);
            }
        }
        Log::debug('Approver verification:', [
            'approved_by' => $submission->approved_by,
            'approver_found' => isset($approver),
            'profile_found' => isset($approver) && isset($approver->profile),
            'result_name' => $approvedByName
        ]);

        $response = [
            'id' => $submission->id,
            'status' => $submission->status,
            'submissionDate' => $submission->created_at->format('Y-m-d H:i:s'),
            'formType' => $formData['formType'] ?? ($submission->sectoralForm->name ?? 'Unknown'), // Fallback to relationship
            'signatureUrl' => $signatureUrl,
            'profilePictureUrl' => $profilePictureUrl,
            'formImage' => $formImage, // Added this line
            'approvedByName' => $approvedByName,
            'approvedAt' => $submission->approved_at ? (is_string($submission->approved_at) ? \Carbon\Carbon::parse($submission->approved_at)->format('Y-m-d H:i:s'): $submission->approved_at->format('Y-m-d H:i:s')): null,
            ...$flattened
        ];

        Log::debug('Final API response:', $response);

        return response()->json($response);

    } catch (\Exception $e) {
        Log::error('Error in show method:', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}

   
   /**
    * Recursively flattens a nested array using underscores for keys.
    */
   private static function flattenArray(array $array, string $prefix = ''): array
   {
       $result = [];
       foreach ($array as $key => $value) {
           $newKey = $prefix === '' ? $key : "{$prefix}_{$key}";
           if (is_array($value)) {
               $result += self::flattenArray($value, $newKey);
           } else {
               $result[$newKey] = $value;
           }
       }
       return $result;
   }

    public function approve($id)
{
    try {
        $submission = null;

        DB::transaction(function () use ($id, &$submission) {
            $submission = TempSubmission::with('sectoralForm', 'profile')->findOrFail($id);

            // Parse form data
            $formData = json_decode($submission->data, true) ?? [];

            // Determine form type
            $formType = $submission->sectoralForm->name ??
                        $formData['formType'] ??
                        $submission->form_type ??
                        null;

            if (!$formType) {
                throw new \Exception("Could not determine form type");
            }

            // First create/update the ResidentSectorMembership record
            $membershipData = [
                'prof_id' => $submission->profile_id,
                'sec_app_id' => $submission->id,
                'verified_at' => now(),
                'verified_by' => Auth::id(),
            ];

            // Set the appropriate sector flag based on form type
            switch (strtolower($formType)) {
                case 'lgbt intake form':
                    $membershipData['mem_is_lgbt'] = true;
                    break;
                case 'senior citizen intake form':
                    $membershipData['mem_is_senior'] = true;
                    break;
                case 'solo parent form':
                    $membershipData['mem_is_solo_parent'] = true;
                    break;
                case 'pwd intake form':
                    $membershipData['mem_is_pwd'] = true;
                    break;
                case 'erpa form':
                    $membershipData['mem_is_erpa'] = true;
                    break;
                case 'children intake form':
                    $membershipData['mem_is_children'] = true;
                    break;
                case 'women intake form':
                    $membershipData['mem_is_women'] = true;
                    break;
            }

            // Create/update the membership record
            $membership = ResidentSectorMembership::updateOrCreate(
                ['prof_id' => $submission->profile_id, 'sec_app_id' => $submission->id],
                $membershipData
            );

            // Now handle form-specific processing with the membership ID
            switch (strtolower($formType)) {
                case 'lgbt intake form':
                    $this->processLgbtForm($membership->id, $formData);
                    break;
                case 'senior citizen form':
                    // $this->processSeniorForm($membership->id, $formData);
                    break;
                case 'solo parent form':
                    // $this->processSoloParentForm($membership->id, $formData);
                    break;
                case 'pwd intake form':
                    $this->processPwdForm($membership->id, $formData);
                    break;
                case 'erpa form':
                    // $this->processErpaForm($membership->id, $formData);
                    break;
            }

            // Update submission status
            $submission->update([
                'status' => 'approved',
                'approved_by' => Auth::id(),
                'approved_at' => now(),
                'declined_by' => null,
                'declined_at' => null
            ]);
        });

        return response()->json([
            'success' => true,
            'redirect' => url('/forms-to-verify?tabs=approved'),
            'message' => 'Application approved successfully',
            'submission' => $submission ? $submission->fresh() : null,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Approval failed: ' . $e->getMessage(),
        ], 500);
    }
}


public function decline($id)
{
    try {
        $submission = TempSubmission::findOrFail($id);
        
        $submission->update([
            'status' => 'declined',
            'declined_by' => Auth::id(),
            'declined_at' => now(),
            'approved_by' => null,
            'approved_at' => null
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application declined successfully'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Decline failed: ' . $e->getMessage()
        ], 500);
    }
}

    protected function processLgbtForm($membershipId, array $formData)
{
    Log::debug('Starting LGBT processing', ['membership_id' => $membershipId]);
    
    // Validate required fields
    $requiredFields = ['lgbt_gender_identity', 'lgbt_sexual_orient'];
    foreach ($requiredFields as $field) {
        if (!isset($formData[$field])) {
            throw new \Exception("Missing required LGBT field: {$field}");
        }
    }

    try {
        // Use updateOrCreate with sec_mem_id as foreign key
        $lgbtRecord = Lgbt::updateOrCreate(
            ['sec_mem_id' => $membershipId], // Changed from prof_id to sec_mem_id
            [
                'lgbt_gender_identity' => $formData['lgbt_gender_identity'],
                'lgbt_sexual_orient' => $formData['lgbt_sexual_orient']
            ]
        );
        
        Log::info('LGBT record processed successfully', [
            'sec_mem_id' => $lgbtRecord->sec_mem_id,
            'gender_identity' => $lgbtRecord->lgbt_gender_identity,
            'sexual_orientation' => $lgbtRecord->lgbt_sexual_orient
        ]);
        
    } catch (\Exception $e) {
        Log::error('Failed to process LGBT data', [
            'membership_id' => $membershipId,
            'error' => $e->getMessage()
        ]);
        throw new \Exception("LGBT data processing failed: " . $e->getMessage());
    }
}
protected function processPwdForm($membershipId, array $formData)
{
    Log::debug('Starting LGBT processing', ['membership_id' => $membershipId]);
    
    // Validate required fields
    $requiredFields = ['pwd_nature_of_disability'];
    foreach ($requiredFields as $field) {
        if (!isset($formData[$field])) {
            throw new \Exception("Missing required PWD field: {$field}");
        }
    }

    try {
        // Use updateOrCreate with sec_mem_id as foreign key
        $pwdRecord = Pwd::updateOrCreate(
            ['sec_mem_id' => $membershipId], // Changed from prof_id to sec_mem_id
            [
                'pwd_disability' => $formData['pwd_nature_of_disability'],
                'pwd_fb_acc' => $formData['pwd_facebook_account'] ?? null
            ]
        );
        
    } catch (\Exception $e) {
        Log::error('Failed to process PWD data', [
            'membership_id' => $membershipId,
            'error' => $e->getMessage()
        ]);
        throw new \Exception("PWD data processing failed: " . $e->getMessage());
    }
}
  

    // Add similar methods for other form types
    // protected function processSeniorForm(...) {...}

    public function allAccounts()
    {
        $users = User::all();
        return Inertia::render('Admin/AllAccounts', ['users' => $users]);
    }
}
