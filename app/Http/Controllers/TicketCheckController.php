<?php

namespace App\Http\Controllers;

use App\Models\ProfileVer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class TicketCheckController extends Controller
{
    public function index()
    {
        return Inertia::render('Services/TicketCheck');
    }

    public function checkStatus(Request $request)
    {
        Log::info('Checking ticket status with data:', $request->all());

        // Validate the request
        $validated = $request->validate([
            'ticketID' => 'nullable|string',
            'last_name' => 'nullable|string|required_without:ticketID',
            'first_name' => 'nullable|string|required_without:ticketID',
            'birthdate' => 'nullable|date|required_without:ticketID',
        ]);

        $profile = null;

        // Search by ticket ID if provided
        if ($request->filled('ticketID')) {
            $profile = ProfileVer::where('ticket_id', $request->ticketID)->first();
        } 
        // Otherwise search by personal information
        else if ($request->filled('last_name') && $request->filled('first_name') && $request->filled('birthdate')) {
            $profile = ProfileVer::where('last_name', $request->last_name)
                ->where('first_name', $request->first_name)
                ->where('birthdate', $request->birthdate)
                ->first();
        }

        // Return JSON response with profile data
        return response()->json([
            'success' => true,
            'profile' => $profile,
        ]);
    }
}
