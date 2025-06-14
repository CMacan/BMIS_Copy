<?php

namespace App\Http\Controllers;

use App\Models\ProfileVer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        return Inertia::render('Services/CheckTicket');
    }

    public function check(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|string',
        ]);

        $profile = ProfileVer::where('ticket_id', $validated['ticket_id'])->first();

        if (!$profile) {
            return back()->withErrors(['ticket_id' => 'Ticket ID not found']);
        }

        return Inertia::render('Services/TicketStatus', [
            'profile' => $profile,
        ]);
    }
}

