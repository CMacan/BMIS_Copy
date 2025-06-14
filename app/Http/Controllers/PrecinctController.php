<?php

namespace App\Http\Controllers;

use App\Models\PrecinctNumber;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrecinctController extends Controller
{
    public function index(): Response
    {
        $precincts = PrecinctNumber::all();
        return Inertia::render('Admin/Voters', [
            'precincts' => $precincts
        ]);
    }

    public function store(Request $request)
{
    \Log::info('Request data:', $request->all()); // Log the request data

    $request->validate([
        'precinct_number' => 'required|string|unique:precinct_numbers,precinct_number',
    ]);

    \Log::info('Validation passed'); // Log if validation passes

    $precinct = PrecinctNumber::create([
        'precinct_number' => $request->precinct_number,
    ]);

    \Log::info('Precinct created:', $precinct->toArray()); // Log the created precinct

    return redirect()->back()->with('success', 'Precinct number added successfully.');
}
}