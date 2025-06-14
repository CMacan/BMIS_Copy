<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use App\Models\SignUpRequest;
use App\Models\Attachment;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Mail\SignUpRequestRejected;
use App\Mail\SignUpRequestApproved;

class SignUpController extends Controller
{
    /**
     * View a specific sign-up request along with its attachments.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function showSignUpRequest($id)
    {
        try {
            // Find the sign-up request
            $signUpRequest = SignUpRequest::findOrFail($id);

            // Retrieve associated attachments
            $attachments = Attachment::where('sign_up_id', $id)->get();

            return response()->json([
                'message' => 'Sign-up request retrieved successfully.',
                'data' => $signUpRequest,
                'attachments' => $attachments,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to retrieve sign-up request: ' . $e->getMessage(), [
                'exception' => $e,
                'sign_up_request_id' => $id,
            ]);

            return response()->json([
                'message' => 'Failed to retrieve sign-up request. Please try again.',
            ], 500);
        }
    }

    /**
     * Approve a sign-up request and update attachments.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approveSignUpRequest($id)
    {
        try {
            // Find the sign-up request
            $signUpRequest = SignUpRequest::findOrFail($id);

            // Create a profile
            $profile = Profile::create([
                'prof_fname' => $signUpRequest->sign_up_fname,
                'prof_lname' => $signUpRequest->sign_up_lname,
                'prof_birthdate' => $signUpRequest->sign_up_birthdate,
                'prof_gender' => $signUpRequest->sign_up_gender,
                'prof_cstatus' => $signUpRequest->sign_up_cstatus,
                'prof_is_verified' => true,
            ]);

            // If you have an Address model and relation:
            $profile->addresses()->create([
                'addr_city' => $signUpRequest->sign_up_city,
                'addr_barangay' => $signUpRequest->sign_up_barangay,
                'addr_region' => $signUpRequest->sign_up_region,
                'addr_block' => $signUpRequest->sign_up_block,
                // 'addr_sitio' => $signUpRequest->sign_up_sitio,
                'addr_street' => $signUpRequest->sign_up_street,
                'addr_houseno' => $signUpRequest->sign_up_houseno,
                'addr_province' => $signUpRequest->sign_up_province,
                'addr_type' => 'permanent', // or any logic you want
            ]);

            // Create a user account
            $user = User::create([
                'prof_id' => $profile->id,
                'email' => $signUpRequest->sign_up_email,
                'password' => $signUpRequest->sign_up_password, // Already hashed during sign-up request
            ]);

            Log::info('User account and profile created', ['user_id' => $user->id]);

            // Update attachments to associate with the profile
            Attachment::where('sign_up_id', $id)->update(['prof_id' => $profile->id]);

            // Send approval email
            Mail::to($signUpRequest->sign_up_email)->send(new SignUpRequestApproved($signUpRequest->sign_up_fname));

            // Delete the sign-up request
            $signUpRequest->delete();

            Log::info('Sign-up request approved and deleted', ['sign_up_request_id' => $id]);

            return response()->json([
                'message' => 'Sign-up request approved and user account created successfully.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to approve sign-up request: ' . $e->getMessage(), [
                'exception' => $e,
                'sign_up_request_id' => $id,
            ]);

            return response()->json([
                'message' => 'Failed to approve sign-up request. Please try again.',
            ], 500);
        }
    }

    /**
     * Reject a sign-up request and delete attachments.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function rejectSignUpRequest(Request $request, $id)
    {
        try {
            
            $request->validate([
                'rejection_message' => 'required|string|max:255',
            ]);
            
            // Find the sign-up request
            $signUpRequest = SignUpRequest::findOrFail($id);

            // Retrieve and delete associated attachments
            $attachments = Attachment::where('sign_up_id', $id)->get();
            foreach ($attachments as $attachment) {
                // Delete the file from storage
                Storage::disk('public')->delete($attachment->attach_path);

                // Delete the attachment record from the database
                $attachment->delete();
            }

            Log::info('Attachments deleted for rejected sign-up request', ['sign_up_request_id' => $id]);
            
            // Send rejection email
            $rejectionMessage = $request->input('rejection_message');
            Log::info('Rejection message:', ['message' => $rejectionMessage]);
            Mail::to($signUpRequest->sign_up_email)->send(new SignUpRequestRejected($rejectionMessage));

            // Delete the sign-up request
            $signUpRequest->delete();

            Log::info('Sign-up request rejected and deleted', ['sign_up_request_id' => $id]);

            return response()->json([
                'message' => 'Sign-up request rejected successfully and email sent.',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to reject sign-up request: ' . $e->getMessage(), [
                'exception' => $e,
                'sign_up_request_id' => $id,
            ]);

            return response()->json([
                'message' => 'Failed to reject sign-up request. Please try again.',
            ], 500);
        }
    }
}
