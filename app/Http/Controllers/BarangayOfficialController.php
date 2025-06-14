<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BarangayOfficial;
use App\Models\Barangay;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon; 

class BarangayOfficialController extends Controller
{
    /**
     * Display a listing of the barangay officials.
     */
    public function index()
    {
        $this->autoUpdateExpiredOfficials();

        $officials = BarangayOfficial::with(['barangay', 'profile'])->get();
        return Inertia::render('Admin/Officials/BarangayOfficials', [
            'barangay_official' => $officials
        ]);
    }

    
    // Auto-update status if term is over 3 years or term_end has passed
    private function autoUpdateExpiredOfficials()
    {
        $today = Carbon::today();

        BarangayOfficial::where('bar_off_status', 'Active')
            ->where(function ($query) use ($today) {
                $query->whereDate('bar_off_term_end', '<', $today)
                    ->orWhereDate('bar_off_term_st', '<=', $today->copy()->subYears(3));
            })
            ->update(['bar_off_status' => 'Inactive']);
    }
    


    public function store(Request $request)
        {
            // Get the single barangay (or fail if not found)
            $barangay = Barangay::firstOrFail();

            $validated = $request->validate([
                'bar_off_position' => 'required|string|max:255',
                'bar_off_term_st' => 'required|date',
                'bar_off_term_end' => 'required|date|after:bar_off_term_st',
                'bar_off_status' => 'required|string',
                'prof_id' => 'required|numeric|exists:profiles,id'
            ]);

       
            BarangayOfficial::create([
                'bar_id' => $barangay->id,
                'prof_id' => $validated['prof_id'],
                'bar_off_position' => $validated['bar_off_position'],
                'bar_off_term_st' => $validated['bar_off_term_st'],
                'bar_off_term_end' => $validated['bar_off_term_end'],
                'bar_off_status' => $validated['bar_off_status'],
            ]);

            return redirect()->route('barangay-officials.index')->with('success', 'Barangay official added successfully!');
        }


     /**
     * Display the specified barangay official.
     */
        public function show($id)
        {
            $official = BarangayOfficial::with('profile')->find($id);

            if (!$official) { return redirect()->route('barangay-officials.index')->withErrors(['error' => 'Barangay official not found.']); }
            $fullName = trim("{$official->profile->prof_fname} {$official->profile->prof_mname} {$official->profile->prof_lname}");
            $profPicture = $official->profile->prof_picture ? asset('storage/' . $official->profile->prof_picture) : asset('images/default-profile.jpg');

            return Inertia::render('Admin/Officials/BarangayOfficials', [
                'barangay_official' => [
                    'id' => $official->id,
                    'full_name' => $fullName,
                    'position' => $official->bar_off_position,
                    'term_start' => $official->bar_off_term_st,
                    'term_end' => $official->bar_off_term_end,
                    'status' => $official->bar_off_status,
                    'prof_picture' => $profPicture
                ]
            ]);
        }


    /**
     * Update the specified barangay official.
     */
    public function update(Request $request, $id)
    {
        $official = BarangayOfficial::findOrFail($id);

        $validated = $request->validate([
            'bar_off_position' => 'required|string|max:255',
            'bar_off_term_st' => 'required|date',
            'bar_off_term_end' => 'required|date|after:bar_off_term_st',
            'bar_off_status' => 'required|string|in:Active,Inactive',
            'prof_id' => 'required|exists:profiles,id',
            'bar_id' => 'sometimes|exists:barangays,id',
        ]);

        if (
        $validated['bar_off_status'] === 'Active' &&
        Carbon::parse($validated['bar_off_term_end'])->isPast()
            ) {
                return back()->withErrors([
                    'bar_off_status' => 'Cannot activate this official. Their term has already ended.'
                ]);
            }

        $official->update($validated);

        return redirect()->route('barangay-officials.index')->with('success', 'Barangay official updated successfully!');
    }


    public function forOfficialscard()
        {
            // Fetch only active barangay officials
            $officials = BarangayOfficial::where('bar_off_status', 'Active')
              ->with(['profile' => function ($query) {
                    $query->select('id', 'prof_fname', 'prof_mname', 'prof_lname', 'prof_picture');
                }])
                ->get(['id', 'prof_id', 'bar_off_position']);

                
             dd($officials); 
            // Ensure proper formatting
            $formattedOfficials = $officials->map(function ($official) {
                return [
                    'id' => $official->id,
                    'prof_fname' => $official->profile->prof_fname ?? '',  
                    'prof_mname' => $official->profile->prof_mname ?? '', 
                    'prof_lname' => $official->profile->prof_lname ?? '', 
                    'prof_picture' => $official->profile->prof_picture ?? '/images/default-profile.jpg',  
                    'bar_off_position' => $official->bar_off_position      
                ];
            });

            return Inertia::render('Components/Officialscard', [
                'barangay_official' => $formattedOfficials
            ]);
        }

}
