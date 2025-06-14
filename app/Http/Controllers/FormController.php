<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attachment;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\SectoralForm;
use App\Models\TempSubmission;
use App\Models\Requirement;
use Illuminate\Support\Facades\Log;
class FormController extends Controller
{
   public function index(Request $request)
{
    $user = $request->user();
    $profileId = $user->profile->id;
    
    $forms = SectoralForm::with('requirements')->get()->map(function ($form) {
        $form->image = '/images/' . basename($form->image);
        return $form;
    });
    
    // Get submissions with status
    $submissions = TempSubmission::where('profile_id', $profileId)
        ->get(['form_id', 'status'])
        ->keyBy('form_id');

    return Inertia::render('User/Forms', [
        'auth' => [
            'user' => $user->load('profile'),
        ],
        'forms' => $forms,
        'submissions' => $submissions, // Changed from appliedForms to submissions
    ]);
}
public function submit(Request $request)
{
    Log::info('Form submission started.');

    try {
        Log::info('Request data:', $request->all());

        // Validate common fields
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
            'signature' => 'required|file|mimes:png,jpg,jpeg|max:2048',
            'formType' => 'required|string|max:255',
            'form_id' => 'required|integer|exists:sectoral_forms,id', // Ensure form_id exists in sectoral_forms
        ]);

        // Additional validation based on form type
        if ($request->formType === 'LGBT INTAKE FORM') {
            $validatedData = array_merge($validatedData, $request->validate([
                'lgbt_gender_identity' => 'required|string|max:255',
                'lgbt_sexual_orient' => 'required|string|max:255',
            ]));
        }

        if ($request->formType === 'PWD INTAKE FORM') {
            $validatedData = array_merge($validatedData, $request->validate([
                'pwd_nature_of_disability' => 'required|string|max:255',
                'pwd_facebook_account' => 'nullable|string|max:255',
                'pwdDocument' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
            ]));

            // Handle PWD document file upload
            if ($request->hasFile('pwdDocument')) {
                $pwdDocumentFile = $request->file('pwdDocument');
                $pwdDocumentName = time() . '_' . uniqid() . '.' . $pwdDocumentFile->getClientOriginalExtension();
                $pwdDocumentPath = 'identity_proofs/' . $pwdDocumentName;
                $pwdDocumentFile->storeAs('identity_proofs', $pwdDocumentName, 'public');

                Log::info('PWD Document saved at: ' . $pwdDocumentPath);

                // Store the file path in validated data
                $validatedData['pwdDocument'] = $pwdDocumentPath;
            }
        }
        if($request->formType === 'SOLO PARENT INTAKE FORM'){
            $validatedData = array_merge($validatedData, $request->validate([
                'monthlyIncome' => 'required|string|max:255',
                'familyMonthlyIncome' => 'required|string|max:255',
                'soloParentClassification' => 'required|string|max:255',
                'soloParentNeeds' => 'required|string|max:255',
                'familyResources' => 'required|string|max:255',
                'soloParentDocument' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
           
            ]));

            // Handle Solo Parent document file upload
            if ($request->hasFile('soloParentDocument')) {
                $soloParentDocumentFile = $request->file('soloParentDocument');
                $soloParentDocumentName = time() . '_' . uniqid() . '.' . $soloParentDocumentFile->getClientOriginalExtension();
                $soloParentDocumentPath = 'identity_proofs/' . $soloParentDocumentName;
                $soloParentDocumentFile->storeAs('identity_proofs', $soloParentDocumentName, 'public');

                Log::info('Solo Parent Document saved at: ' . $soloParentDocumentPath);

                // Store the file path in validated data
                $validatedData['soloParentDocument'] = $soloParentDocumentPath;
            }
        }
        if($request->formType === 'ERPAT INTAKE FORM'){
            $validatedData = array_merge($validatedData, $request->validate([
                'erpa_skillsTalent' => 'required|string|max:255',
                'erpa_hobbies' => 'required|string|max:255',
                'erpa_otherSkills' => 'required|string|max:255',
                'erpa_schoolInvolvement' => 'required|string|max:255',
                'erpa_civicInvolvement' => 'required|string|max:255',
                'erpa_communityInvolvement' => 'required|string|max:255',
                'erpa_workplaceInvolvement' => 'required|string|max:255',
                'erpa_seminarTitle' => 'required|string|max:255',
                'erpa_seminarDate' => 'required|string|max:255',
                'erpa_seminarOrganizers' => 'required|string|max:255',
           
            ]));
        }

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
            $signatureFile->storeAs('signatures', $signatureName, 'public');

            Log::info('Signature saved at: ' . $signaturePath);
        } else {
            Log::error('Signature file not found in request.');
            return response()->json(['message' => 'Signature is required.'], 400);
        }

        // Save form submission to database
        $submission = TempSubmission::create([
            'profile_id' => $profile->id,
            'form_id' => (int)$validatedData['form_id'], 
            'data' => json_encode($validatedData),
            'signature' => $signaturePath, 
            'status' => 'pending', 
        ]);

        Log::info('Form submitted successfully', ['submission_id' => $submission->id, 'form_id' => $submission->form_id]);

        return response()->json([
            'message' => 'Form submitted successfully',
            'redirect' => route('applications.index')
        ], 200);
    } catch (\Throwable $e) {
        Log::error('Form submission error: ' . $e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);

        // Return JSON response even for errors
        return response()->json([
            'message' => 'An error occurred: ' . $e->getMessage(),
            'error' => true
        ], 500);
    }
}


public function show($id)
{
    $user = Auth::user();
    
    if (!$user) {
        abort(403, "Unauthorized access.");
    }
    switch ($id) {
        case 2:
            return $this->renderForm('User/Forms/LGBTForm', $user, 2);
        case 3:
            return $this->renderForm('User/Forms/ChildrenIntakeForm', $user, 3);
        case 4:
            return $this->renderForm('User/Forms/PWD', $user, 4);
        case 5:
            return $this->renderForm('User/Forms/SoloParent', $user, 5);
        case 6:
            return $this->renderForm('User/Forms/Womens', $user, 6);
        case 7:
            return $this->renderForm('User/Forms/SeniorCitizenForm', $user, 7);
        case 8:
            return $this->renderForm('User/Forms/ERPA', $user, 8);        
        default:
            abort(404, "Form not found.");
    }
}
private function renderForm($component , $user = null , $id=null)
{
    $user =Auth::user();
    $profile = $user->profile;
    $address = $profile->household->address;
    $emerg_contact = $profile->emergencyContacts;
     // Log emergency contact details
     Log::info('Emergency Contact Data:', [
        'emerg_fname' => $emerg_contact[0]?->emerg_fname,
        'emerg_lname' => $emerg_contact[0]?->emerg_lname,
        'emerg_contact' => $emerg_contact[0]?->emerg_contact,
    ]);
    return Inertia::render($component, [
        'auth' => [
            'user' => User::with('profile')->find($user->id),

        ],
        'registrationType' => 'self',
        'form_id' => $id,
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
            'sex' => $profile->prof_gender,
            'status' => $profile->prof_cstatus,
            'education' => $profile->prof_educattain,
            'contact' => $user->user_contact,
            'emerg_fname'=>$emerg_contact[0]->emerg_fname,
            'emerg_lname'=>$emerg_contact[0]->emerg_lname,
            'emerg_contact'=>$emerg_contact[0]->emerg_contact,
            'prof_religion'=>$profile->prof_religion,
        ],
    ]);
}

}
