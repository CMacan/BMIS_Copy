<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DocumentRequest;
use PhpOffice\PhpWord\TemplateProcessor;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class DocumentGeneratorController extends Controller
{
    /**
     * Generate a document based on the document request and template
     * This is the method that's being called from your routes
     */
    public function generate($id)
    {
        try {
            // Find the document request
            $documentRequest = DocumentRequest::findOrFail($id);
            
            // Get the template path based on document type
            $templatePath = $this->getTemplatePath($documentRequest->document_type);
            
            if (!file_exists($templatePath)) {
                Log::error('Template not found: ' . $templatePath);
                return response()->json([
                    'success' => false,
                    'message' => 'Template not found: ' . $templatePath
                ], 404);
            }
            
            // Create a template processor
            $templateProcessor = new TemplateProcessor($templatePath);
            
            // Fill in user data
            $templateProcessor->setValue('name', strtoupper($documentRequest->name));
            $templateProcessor->setValue('birthdate', $documentRequest->birthdate ?? 'N/A');
            $templateProcessor->setValue('status', $documentRequest->civil_status ?? 'N/A');
            $templateProcessor->setValue('address', $documentRequest->address);
            
            // Add more fields as needed
            try {
                $templateProcessor->setValue('age', $documentRequest->age ?? 'N/A');
                $templateProcessor->setValue('civil_status', $documentRequest->civil_status ?? 'N/A');
                $templateProcessor->setValue('purpose', $documentRequest->purpose ?? 'N/A');
                
                // Get current date components for formatting
                $day = now()->format('jS');
                $month = now()->format('F');
                $year = now()->format('Y');
                $date = now()->format('F d, Y');

                $templateProcessor->setValue('day', $day);
                $templateProcessor->setValue('month', $month);
                $templateProcessor->setValue('year', $year);
                $templateProcessor->setValue('date', $date);
            } catch (\Exception $e) {
                // Log but continue if some fields aren't in the template
                Log::warning('Error setting some template values: ' . $e->getMessage());
            }
            
            // Handle Purpose Checkboxes
            $this->handlePurposeCheckboxes($templateProcessor, $documentRequest->purpose);
            
            // Generate a unique filename
            $filename = Str::slug($documentRequest->document_type) . '-' . $documentRequest->id . '.docx';
            
            // Make sure the storage directory exists
            $storagePath = storage_path('app/public/documents');
            if (!file_exists($storagePath)) {
                mkdir($storagePath, 0755, true);
            }
            
            $outputPath = $storagePath . '/' . $filename;
            
            // Save the document
            $templateProcessor->saveAs($outputPath);
            
            Log::info('Document generated successfully: ' . $outputPath);
            
            // Return the file for download
            return response()->download($outputPath, $filename, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Document generation error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
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
     * Handle purpose checkboxes in the template
     */
    private function handlePurposeCheckboxes($templateProcessor, $purpose)
    {
        // Define all possible purposes that match your template variables
        $purposes = [
            'school_requirement' => '',
            'local_employment' => '',
            'proper_identification' => '',
            'residency' => '',
            'good_moral_character' => '',
            'open_an_account' => '',
            'electrification_veco' => '',
            'mcwd' => '',
            'postal_id' => '',
            'police_clearance' => '',
            'nbi_clearance' => '',
            'license_renewal' => '',
            'others' => ''
        ];
        
        // Normalize the purpose text for comparison
        $normalizedPurpose = strtolower(trim($purpose));
        
        // Map common purpose phrases to their corresponding template variables
        $purposeMapping = [
            'school' => 'school_requirement',
            'employment' => 'local_employment',
            'identification' => 'proper_identification',
            'residen' => 'residency',
            'good moral' => 'good_moral_character',
            'account' => 'open_an_account',
            'veco' => 'electrification_veco',
            'electric' => 'electrification_veco',
            'mcwd' => 'mcwd',
            'postal' => 'postal_id',
            'police' => 'police_clearance',
            'nbi' => 'nbi_clearance',
            'license' => 'license_renewal',
            'driver' => 'license_renewal',
            'firearm' => 'license_renewal'
        ];
        
        // Check if the purpose matches any of our known purposes
        $matchFound = false;
        foreach ($purposeMapping as $keyword => $field) {
            if (strpos($normalizedPurpose, $keyword) !== false) {
                $purposes[$field] = 'XX';
                $matchFound = true;
                Log::info("Matched purpose '$normalizedPurpose' to field '$field' using keyword '$keyword'");
                break; // Stop after first match
            }
        }
        
        // If no match found, mark "Others" and specify the purpose
        if (!$matchFound) {
            $purposes['others'] = 'XX';
            try {
                $templateProcessor->setValue('others_specify', $purpose);
            } catch (\Exception $e) {
                Log::info("Could not set 'others_specify' field: " . $e->getMessage());
            }
        }
        
        // Set all purpose fields in the template
        foreach ($purposes as $field => $value) {
            try {
                $templateProcessor->setValue($field, $value);
            } catch (\Exception $e) {
                Log::info("Could not set field '$field': " . $e->getMessage());
            }
        }
        
        Log::info('Processed purpose checkboxes for: ' . $normalizedPurpose);
    }
}
