<?php

namespace App\Http\Controllers;

use App\Models\Barangay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BarangayDetailsController extends Controller
{
     // Fetch barangay details and send to frontend
     public function show(): Response
     {
         $barangay = Barangay::first(); // Fetch first barangay record
 
         return Inertia::render('Admin/BarangayDetails', [
             'barangay' => $barangay, // Pass data to frontend
         ]);
     }

   
    public function update(Request $request)
    {

        $request->validate([
            'bar_name' => 'required|string',
            'municipal_or_city' => 'required|string',
            'bar_prov' => 'required|string',
            'bar_location' => 'required|string',
            'bar_gmaplink' => 'required|string',
            'bar_contact' => 'required|string',
            'bar_email' => 'required|email',
            'bar_fbname' => 'nullable|string',
            'bar_fb_link' => 'nullable|string',
            'bar_stday' => 'required|string',
            'bar_endday' => 'required|string',
            'bar_sthour' => 'required',
            'bar_endhour' => 'required',
            'bar_motto' => 'nullable|string',
            'bar_systname' => 'nullable|string',
            'bar_vision' => 'nullable|string',
            'bar_mission' => 'nullable|string',
            'bar_value' => 'nullable|string',
        ]);
        
            // Check if a record exists
            $barangay = Barangay::first();
               
            if (!$barangay) {
                // Create only if no record exists
                Barangay::create($request->all());
                return back()->with('success', 'Profile created successfully!');
            } else {
                // Update if a record exists
                $barangay->update($request->all());
                return back()->with('success', 'Profile updated successfully!');
            }
    }

     /**
     * Upload the barangay logo.
     */
    public function upload_logo(Request $request)
    {
        $request->validate([
            'bar_logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $barangay = Barangay::first(); // Adjust this to fetch the correct barangay

        if ($request->hasFile('bar_logo')) {
            $file = $request->file('bar_logo');
            $filename = 'barangay_logo_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $filename);

            // Delete old logo if it exists
            if ($barangay->bar_logo && file_exists(public_path($barangay->bar_logo))) {
                unlink(public_path($barangay->bar_logo));
            }

            // Save new logo path in database
            $barangay->bar_logo = 'images/' . $filename;
            $barangay->save();

            return back()->with('success', 'Barangay logo updated successfully.');
        }

        return back()->with('error', 'Failed to upload the logo.');
    }




    // Fetch from About Page
    public function fetch_about(): Response
    {
        $barangay = Barangay::first(); // Fetch first barangay record

        return Inertia::render('View/About', [
           'barangay' => [
                'bar_name'   => $barangay->bar_name ?? 'Leromitsom',
                'bar_vision'   => $barangay->bar_vision ?? 'A lorem and lorem community',
                'bar_mission'  => $barangay->bar_mission ?? 'To provide lorem service to residents',
                'bar_value'    => !empty($barangay->bar_value) ? array_map('trim', explode(',', $barangay->bar_value)) : ['Lorem','Ipsum', 'Dolor'], 
                'bar_systname' => $barangay->bar_systname ?? 'Leromitsom-GOV',
                'bar_motto'    => $barangay->bar_motto?? 'Lorem Ipsum Dolor Sit',
                'bar_logo'     => $barangay->bar_logo ?? 'images/defaultlogo.jpg',
                'bar_fbname'   => $barangay->bar_fbname ?? 'Leromitsom Hub',
                'bar_fb_link'  => $barangay->bar_fblink ?? 'https://facebook.com/leromitsom',
                'bar_email'    => $barangay->bar_email ?? 'leromitsom@gmail.com',
                'bar_contact'  => $barangay->bar_contact ?? '09123456789',
                'bar_location' => $barangay->bar_location ?? 'Leromitsom, Lorem City',
                'bar_gmaplink' => $barangay->bar_gmaplink ?? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16013028.102170127!2d111.90151866202028!3d11.520931175388483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x324053215f87de63%3A0x784790ef7a29da57!2sPhilippines!5e0!3m2!1sen!2sph!4v1742287350426!5m2!1sen!2sph',
            ],

        ]);
    }
}