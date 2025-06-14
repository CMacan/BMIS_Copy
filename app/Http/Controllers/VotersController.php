<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Voter;
use App\Models\PrecinctNumber;
use App\Exports\VotersExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\VotersPdfExport;
use Illuminate\Support\Facades\Validator;
use App\Imports\VotersImport;
use Illuminate\Support\Facades\DB;


class VotersController extends Controller
{
    public function index()
    {
        // Log the request to fetch voters
        Log::info('Fetching list of voters...');

        try {
          
            $voters = Voter::with('precinct')->get(); // Eager load the precinct relationship
            $precincts = PrecinctNumber::all();

            Log::info('Fetched ' . count($voters) . ' voters.');

            return Inertia::render('Admin/Voters', [
                'voters' => $voters,
                'precincts' => $precincts,
            ]);
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to fetch voters: ' . $e->getMessage());

            // Return an error response
            return redirect()->back()->with('error', 'Failed to fetch voters.');
        }
    }

    public function store(Request $request)
    {
        // Log the incoming request data
        Log::info('Received request to create a voter:', $request->all());

        // Validate the request data
        $request->validate([
            'vote_fname' => 'required|string|max:255',
            'vote_lname' => 'required|string|max:255',
            'bar_id' => 'required|string',
            'precinct_id' => 'required|exists:precinct_numbers,id', // Ensure precinct_id exists
        ]);

        try {
            // Log before creating the voter
            Log::info('Attempting to create a voter...');

            // Create the voter
            $voter = Voter::create([
                'vote_fname' => $request->vote_fname,
                'vote_lname' => $request->vote_lname,
                'bar_id' => $request->bar_id,
                'precinct_id' => $request->precinct_id,
            ]);

            // Log the created voter
            Log::info('Voter created successfully:', $voter->toArray());

            // Redirect back with success message to ensure Inertia response
            return redirect()->back()->with('success', 'Voter added successfully.');
        } catch (\Exception $e) {
            // Log the error
            Log::error('Failed to create voter: ' . $e->getMessage());

            // Redirect back with error message to ensure Inertia response
            return redirect()->back()->with('error', 'Failed to create voter.');
        }
    }
    public function update(Request $request, $id)
    {
        Log::info('Received request to update voter:', $request->all());

        $request->validate([
            'vote_fname' => 'required|string|max:255',
            'vote_lname' => 'required|string|max:255',
            'precinct_id' => 'required|exists:precinct_numbers,id',
        ]);

        try {
            Log::info('Attempting to update voter...');

            $voter = Voter::findOrFail($id);
            $voter->update($request->only(['vote_fname', 'vote_lname', 'precinct_id']));

            Log::info('Voter updated successfully:', $voter->toArray());

            return redirect()->route('admin.voters.index')->with('success', 'Voter updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update voter: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to update voter.');
        }
    }

    public function destroy($id)
    {
        Log::info('Received request to delete voter with ID: ' . $id);

        try {
            // Find the voter by ID
            $voter = Voter::findOrFail($id);

            // Delete the voter
            $voter->delete();

            Log::info('Voter deleted successfully:', ['id' => $id]);

            return redirect()->route('admin.voters.index')->with('success', 'Voter deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete voter: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to delete voter.');
        }
    }

    public function export(Request $request)
    {
        $precinctId = $request->query('precinct');
        return Excel::download(new VotersExport($precinctId), 'voters.xlsx');
    }
    public function exportPdf(Request $request)
    {
        try {
            $precinctId = $request->query('precinct'); // Get the precinct filter from the request

            $config = [
                'title' => $request->query('title', 'Voter Report'),
                'orientation' => $request->query('orientation', 'P'), // Default to Portrait
                'format' => $request->query('format', 'A4'),
                'headerText' => $request->query('headerText', 'Voter Management Report'),
                'footerText' => $request->query('footerText', 'Generated on ' . date('Y-m-d H:i:s')),
            ];

            // Create an instance of the VotersPdfExport class
            $pdfExport = new \App\Exports\VotersPdfExport($precinctId, $config);

            // Generate and return the PDF
            return $pdfExport->export();
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('PDF Export Error: ' . $e->getMessage());

            // Return a JSON response with the error
            return response()->json(['error' => 'Failed to generate PDF.'], 500);
        }
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        try {
            Excel::import(new VotersImport, $request->file('file'));
            
            return response()->json([
                'success' => true,
                'message' => 'Voters imported successfully'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }
    public function downloadTemplate()
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="voter_import_template.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function() {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['last_name', 'first_name', 'precinct_number']);
            
            // Add a sample row
            fputcsv($file, ['Fernandez', 'Joan', '1234A']);
            
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
