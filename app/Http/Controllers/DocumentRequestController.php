<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\HouseholdMember;
use App\Models\DocumentRequest;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\DocumentRequestsExport;
use App\Models\Official;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
// use App\Services\NotificationService;

class DocumentRequestController extends Controller
{
    // private NotificationService $notificationService;

    // public function __construct(NotificationService $notificationService)
    // {
    //     $this->notificationService = $notificationService;
    // }

    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');
        $search = strtolower($request->query('search', ''));
        $startDate = $request->query('start_date', '');
        $endDate = $request->query('end_date', '');

        $documents = DocumentRequest::where('status', $status)
            ->where(function ($query) use ($search) {
                $query->whereRaw('LOWER(name) LIKE ?', ["%$search%"])
                    ->orWhereRaw('LOWER(document_type) LIKE ?', ["%$search%"])
                    ->orWhereRaw('LOWER(purpose) LIKE ?', ["%$search%"]);
            })
            ->when($startDate, fn ($query) => $query->whereDate('created_at', '>=', $startDate))
            ->when($endDate, fn ($query) => $query->whereDate('created_at', '<=', $endDate))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($doc) {
                // Capitalize certain fields for clean UI
                $doc->name = Str::title(strtolower($doc->name));
                $doc->document_type = Str::title(strtolower($doc->document_type));
                $doc->purpose = Str::title(strtolower($doc->purpose));
                $doc->address = Str::title(strtolower($doc->address));
                return $doc;
            });

        return Inertia::render('Admin/Document_Request/ListDocuments', [
            'documents' => $documents,
            'activeTab' => $status,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|string|in:pending,approved,declined',
                'decline_reason' => 'nullable|string|max:255',
            ]);

            $documentRequest = DocumentRequest::findOrFail($id);
            $oldStatus = $documentRequest->status;
            $newStatus = $request->status;

            $documentRequest->status = $newStatus;

            if ($newStatus === 'declined') {
                $documentRequest->decline_reason = $request->decline_reason;
            }

            $documentRequest->save();

            // // Send notification to user when status changes
            // if ($oldStatus !== $newStatus && in_array($newStatus, ['approved', 'declined', 'completed'])) {
            //     $this->notificationService->documentStatusChanged(
            //         $documentRequest,
            //         $newStatus,
            //         Auth::id()
            //     );
            // }

            return response()->json([
                'success' => true,
                'message' => 'Document request status updated successfully.',
                'document' => $documentRequest
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating document request status: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the document request status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send notification to user when document status changes
     */
    private function sendStatusChangeNotification($documentRequest, $status)
    {
        try {
            $statusMessages = [
                'approved' => [
                    'title' => 'Document Request Approved! ✅',
                    'message' => "Your {$documentRequest->document_type} request has been approved and is ready for processing.",
                    'category' => 'document_approved'
                ],
                'declined' => [
                    'title' => 'Document Request Declined ❌',
                    'message' => "Your {$documentRequest->document_type} request has been declined. Reason: {$documentRequest->decline_reason}",
                    'category' => 'document_declined'
                ]
            ];

            $notificationData = $statusMessages[$status] ?? null;

            if ($notificationData) {
                Notification::create([
                    'user_id' => $documentRequest->user_id,
                    'staff_id' => Auth::id(), // Admin who updated the status
                    'document_request_id' => $documentRequest->id,
                    'notif_title' => $notificationData['title'],
                    'notif_message' => $notificationData['message'],
                    'notif_status' => 'unread',
                    'notif_category' => $notificationData['category'],
                ]);

                Log::info("Notification sent to user {$documentRequest->user_id} for document request {$documentRequest->id} status change to {$status}");
            }
        } catch (\Exception $e) {
            Log::error('Error sending status change notification: ' . $e->getMessage());
        }
    }

    /**
     * Send notification to admin when new document request is submitted
     */
    private function sendNewRequestNotification($documentRequest)
    {
        try {
            // Get all admin users (you can adjust this query based on your admin role setup)
            $adminUsers = User::whereHas('roles', function($query) {
                $query->where('name', 'admin');
            })->get();

            // If no role-based admins, you can fallback to a specific user or email
            if ($adminUsers->isEmpty()) {
                // Fallback: notify user with ID 1 (assuming it's admin) or specific admin emails
                $adminUsers = User::where('id', 1)->get(); // Adjust this as needed
            }

            foreach ($adminUsers as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'staff_id' => $documentRequest->user_id, // User who submitted the request
                    'document_request_id' => $documentRequest->id,
                    'notif_title' => 'New Document Request 📋',
                    'notif_message' => "New {$documentRequest->document_type} request from {$documentRequest->name}. Purpose: {$documentRequest->purpose}",
                    'notif_status' => 'unread',
                    'notif_category' => 'document_request',
                ]);
            }

            Log::info("New document request notification sent to admins for request {$documentRequest->id}");
        } catch (\Exception $e) {
            Log::error('Error sending new request notification: ' . $e->getMessage());
        }
    }

    public function export()
    {
        return Excel::download(new DocumentRequestsExport, 'document_requests.xlsx');
    }

    public function show($id)
    {
        $officials = Official::all();
        return Inertia::render('/Components/PrintDocument', [
            'officials' => $officials,
        ]);
    }

    public function print($id)
    {
        $documentRequest = DocumentRequest::findOrFail($id);

        if ($documentRequest->document_type === 'Certificate of Indigency') {
            $template = 'pdf.barangay_indigency';
        } elseif ($documentRequest->document_type === 'Barangay Business Permit') {
            $template = 'pdf.barangay_business_permit';
        } elseif ($documentRequest->document_type === 'Barangay Clearance') {
            $template = 'pdf.barangay_certification';
        } else {
            $template = 'pdf.print_document';
        }

        $pdf = Pdf::loadView($template, ['document' => $documentRequest]);
        return $pdf->download($documentRequest->document_type . '.pdf');
    }

    /**
     * Generate a DOCX document based on the document request and template
     */
    public function generateDocx($id)
    {
        try {
            // Find the document request
            $documentRequest = DocumentRequest::findOrFail($id);

            // Get the template path based on document type
            $templatePath = $this->getTemplatePath($documentRequest->document_type);

            if (!file_exists($templatePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Template not found: ' . $templatePath
                ], 404);
            }

            // Create a template processor
            $templateProcessor = new TemplateProcessor($templatePath);

            // Fill the template with data
            $this->fillTemplate($templateProcessor, $documentRequest);

            // Generate a unique filename
            $filename = Str::slug($documentRequest->document_type) . '-' . $documentRequest->id . '.docx';
            $outputPath = storage_path('app/public/completed/' . $filename);

            // Ensure the directory exists
            if (!file_exists(dirname($outputPath))) {
                mkdir(dirname($outputPath), 0755, true);
            }

            // Save the document
            $templateProcessor->saveAs($outputPath);

            // Update document request status to completed
            $documentRequest->status = 'completed';
            $documentRequest->save();

            // Create a notification for document completion
            try {
                $message = "Your {$documentRequest->document_type} has been generated and is ready for download.";
                $notification = new Notification([
                    'user_id' => $documentRequest->user_id,
                    'staff_id' => Auth::id(),
                    'document_request_id' => $documentRequest->id,
                    'notif_title' => 'Document Generated',
                    'notif_message' => $message,
                    'notif_category' => 'document_approved',
                    'notif_status' => 'unread'
                ]);
                $notification->save();

                Log::info('Document generation notification created successfully');
            } catch (\Exception $e) {
                Log::error('Error creating document generation notification: ' . $e->getMessage());
            }

            // Return the file for download
            return response()->download($outputPath, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"'
            ])->deleteFileAfterSend(false);

        } catch (\Exception $e) {
            Log::error('Document generation error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error generating document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the template path based on document type
     */
    private function getTemplatePath($documentType)
    {
        $basePath = public_path('templates/');

        // Normalize the document type for case-insensitive comparison
        $normalizedType = strtolower(trim($documentType));

        // Log the document type for debugging
        Log::info('Document type received: ' . $documentType);
        Log::info('Normalized document type: ' . $normalizedType);

        switch ($normalizedType) {
            case 'barangay clearance':
                Log::info('Using Barangay Clearance template');
                return $basePath . 'Certification_Brgy-new.docx';

            case 'certificate of indigency':
            case 'indigency certificate':
            case 'indigency':
                Log::info('Using Certificate of Indigency template');
                return $basePath . 'Certification-Indigency.docx';

            case 'barangay business permit':
            case 'business clearance':
            case 'business permit':
                Log::info('Using Business Permit template');
                return $basePath . 'Permit-Business.docx';

            default:
                Log::warning('Unknown document type: ' . $documentType . '. Using Barangay Clearance as default.');
                return $basePath . 'Certification_Brgy-new.docx';
        }
    }

    /**
     * Fill the template with data from the document request
     */
    private function fillTemplate($templateProcessor, $documentRequest)
    {
        try {
            // Common fields for all document types
            $templateProcessor->setValue('name', strtoupper($documentRequest->name));
            $templateProcessor->setValue('address', $documentRequest->address);
            $templateProcessor->setValue('purpose', $documentRequest->purpose);
            $templateProcessor->setValue('date', now()->format('F d, Y'));

            // Get current date components for formatting
            $day = now()->format('jS');
            $month = now()->format('F');
            $year = now()->format('Y');

            $templateProcessor->setValue('day', $day);
            $templateProcessor->setValue('month', $month);
            $templateProcessor->setValue('year', $year);

            // Handle purpose checkboxes
            $this->handlePurposeCheckboxes($templateProcessor, $documentRequest->purpose);

            // Document-specific fields
            switch (strtolower(trim($documentRequest->document_type))) {
                case 'certificate of indigency':
                case 'indigency certificate':
                case 'indigency':
                    $templateProcessor->setValue('age', $documentRequest->age);
                    $templateProcessor->setValue('civil_status', $documentRequest->civil_status);
                    break;

                case 'barangay business permit':
                case 'business clearance':
                case 'business permit':
                    // Business-specific fields if available
                    $templateProcessor->setValue('business_name', $documentRequest->business_name ?? 'N/A');
                    $templateProcessor->setValue('business_address', $documentRequest->business_address ?? $documentRequest->address);
                    $templateProcessor->setValue('business_type', $documentRequest->business_type ?? 'N/A');
                    break;
            }
        } catch (\Exception $e) {
            Log::error('Error filling template: ' . $e->getMessage());
            throw $e; // Re-throw to be caught by the calling method
        }
    }

    /**
     * Handle purpose checkboxes in the template
     */
    private function handlePurposeCheckboxes($templateProcessor, $purpose)
    {
        try {
            // Define all possible purposes that match your template variables
            $allPurposes = [
                'school requirement' => 'school_requirement',
                'local employment' => 'local_employment',
                'proper identification' => 'proper_identification',
                'residency' => 'residency',
                'mcwd' => 'mcwd',
                'postal id' => 'postal_id',
                'police clearance' => 'police_clearance',
                'nbi clearance' => 'nbi_clearance',
                'good moral' => 'good_moral',
                'license renewal' => 'license_renewal',
                'open an account' => 'open_account',
                'electrification' => 'electrification'
            ];

            // Normalize the purpose text for comparison
            $normalizedPurpose = strtolower(trim($purpose));

            // Set all checkboxes to empty by default
            foreach ($allPurposes as $purposeKey => $templateVar) {
                try {
                    $templateProcessor->setValue($templateVar, '');
                } catch (\Exception $e) {
                    Log::warning("Variable not found in template: $templateVar - " . $e->getMessage());
                    // Continue processing other variables
                }
            }

            // Find matching purpose and set the corresponding checkbox to "XX"
            $matchFound = false;
            foreach ($allPurposes as $purposeKey => $templateVar) {
                if (strpos($normalizedPurpose, $purposeKey) !== false) {
                    try {
                        $templateProcessor->setValue($templateVar, 'XX');
                        $matchFound = true;
                        Log::info("Set checkbox for purpose: $purposeKey to XX");
                    } catch (\Exception $e) {
                        Log::warning("Error setting checkbox for purpose: $purposeKey - " . $e->getMessage());
                        // Continue processing other purposes
                    }
                }
            }

            // If no match found, check if we should use "Others"
            if (!$matchFound && !empty($normalizedPurpose)) {
                try {
                    $templateProcessor->setValue('others', 'XX');
                    $templateProcessor->setValue('others_specify', $purpose);
                    Log::info("Set 'Others' checkbox and specified: $purpose");
                } catch (\Exception $e) {
                    Log::warning("Others field not found in template: " . $e->getMessage());
                    // Continue processing
                }
            }

            // Log what we're doing for debugging
            Log::info('Processed purpose checkbox for: ' . $normalizedPurpose);
        } catch (\Exception $e) {
            Log::error('Error in handlePurposeCheckboxes: ' . $e->getMessage());
            // Don't throw the exception, just log it and continue
        }
    }

    // User-side methods
    public function userIndex()
    {
        $user = Auth::user();
        $householdMembers = HouseholdMember::where('house_id', $user->household_id)->get();

        return Inertia::render('User/Document_Request', [
            'householdMembers' => $householdMembers,
        ]);
    }

    public function userHistory()
    {
        $user = Auth::user();
        $history = DocumentRequest::where('user_id', $user->id)
            ->with(['documentType', 'staff'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('User/DocumentHistory', [
            'history' => $history,
        ]);
    }

    public function request_list()
    {
        $documentRequests = DocumentRequest::where('user_id', Auth::id())->get();
        return Inertia::render('Dashboard', [
            'auth' => Auth::user(),
            'documentRequests' => $documentRequests,
        ]);
    }

    public function store(Request $request)
    {
        // Validate common fields
        $rules = [
            'document_type' => 'required|string',
            'purpose' => 'required|string',
            'copies' => 'required|integer',
            'name' => 'required|string',
        ];

        // Add conditional validation based on document type
        if (in_array($request->document_type, ['CERTIFICATE OF INDIGENCY', 'BARANGAY CLEARANCE'])) {
            $rules['age'] = 'required|integer';
            $rules['block'] = 'required|string';
            $rules['address'] = 'required|string';
        }

        if ($request->document_type === 'CERTIFICATE OF INDIGENCY') {
            $rules['civil_status'] = 'required|string';
        }

        if ($request->document_type === 'BUSINESS CLEARANCE') {
            $rules['address'] = 'required|string';
            $rules['business_name'] = 'required|string';
            $rules['business_type'] = 'required|string';
            $rules['business_nature'] = 'required|string';
            $rules['business_address'] = 'required|string';
            $rules['capital_amount'] = 'required|numeric';
        }

        $request->validate($rules);

        $documentRequest = new DocumentRequest([
            'user_id' => Auth::id(),
            'document_type' => $request->document_type,
            'purpose' => $request->purpose,
            'copies' => $request->copies,
            'status' => 'pending',
            'name' => Str::title(strtolower($request->name)),
            'address' => $request->address,
            'block' => $request->block,
            'age' => $request->age,
            'civil_status' => $request->civil_status,
            'requester_name' => Str::title(strtolower($request->requester_name)),
            'requester_email' => $request->requester_email,
            'requester_contact' => $request->requester_contact,
            // Business-specific fields
            'business_name' => $request->business_name,
            'business_type' => $request->business_type,
            'business_nature' => $request->business_nature,
            'business_address' => $request->business_address,
            'capital_amount' => $request->capital_amount,
        ]);

        $documentRequest->save();

        // Send notification to admins about new document request
        // $this->notificationService->documentRequestSubmitted($documentRequest);

        // Return proper Inertia redirect instead of JSON
        return redirect()->route('user.document-requests.index')
            ->with('success', 'Document request submitted successfully.');
    }
}
