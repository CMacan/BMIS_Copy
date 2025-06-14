<?php

namespace App\Http\Controllers;

use App\Models\SectoralForm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SectoralFormController extends Controller {
    public function index() {
    $forms = SectoralForm::with('requirements')->get()->map(function($form) {
        // Ensure the image path is correct
        if ($form->image && !str_starts_with($form->image, 'images/')) {
            $form->image = 'images/' . basename($form->image);
        }
        return $form;
    });
    
    return Inertia::render('Admin/Sectoral/SectoralForms', [
        'sectoralForms' => $forms
    ]);
}

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:255',
            'addtl_detail' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);
        
        $data = $request->all();
        
        // Handle image upload
         if ($request->hasFile('image')) {
        $image = $request->file('image');
        $filename = time() . '_' . $image->getClientOriginalName();
        $image->move(public_path('images'), $filename);
        $data['image'] = 'images/' . $filename;
    }
        
        // Handle requirements if provided
        if ($request->has('requirements')) {
            $requirements = json_decode($request->requirements, true);
            $form = SectoralForm::create($data);
            
            if (!empty($requirements)) {
                $form->requirements()->createMany($requirements);
            }
            
            return redirect()->back()->with('success', 'Sectoral form added successfully');
        }
        
        SectoralForm::create($data);
        return redirect()->back()->with('success', 'Sectoral form added successfully');
    }

    public function update(Request $request, $id)
{
    Log::info('Starting update process for SectoralForm ID: ' . $id);

    // Validate the request data
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'category' => 'required|string|max:255',
        'addtl_detail' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
    ]);

    // Find the form by ID or fail
    $form = SectoralForm::findOrFail($id);
    Log::info('Found SectoralForm:', ['form' => $form]);

    // Prepare the data for update (exclude image and requirements)
    $data = $request->except(['requirements', 'image', '_method']);
    Log::info('Data to update (excluding image and requirements):', ['data' => $data]);

    // Handle image upload - UPDATED FOR PUBLIC/IMAGES
    if ($request->hasFile('image')) {
        Log::info('New image uploaded.');

        // Delete old image if it exists
        if ($form->image && file_exists(public_path($form->image))) {
            Log::info('Deleting old image:', ['old_image' => $form->image]);
            unlink(public_path($form->image));
        }

        // Store new image in public/images
        $image = $request->file('image');
        $filename = time() . '_' . $image->getClientOriginalName(); // Unique filename
        $image->move(public_path('images'), $filename);
        $data['image'] = 'images/' . $filename; // Store relative path
        
        Log::info('New image stored:', [
            'filename' => $filename,
            'path' => $data['image']
        ]);
    }

    // Handle requirements if provided
    if ($request->has('requirements')) {
        Log::info('Requirements provided:', ['requirements' => $request->requirements]);

        $requirements = json_decode($request->requirements, true);
        Log::info('Decoded requirements:', ['requirements' => $requirements]);

        // Delete existing requirements
        $form->requirements()->delete();
        Log::info('Deleted existing requirements.');

        // Add new requirements
        if (!empty($requirements)) {
            $form->requirements()->createMany($requirements);
            Log::info('Added new requirements:', ['requirements' => $requirements]);
        }
    }

    // Update the form with the new data
    $form->update($data);
    Log::info('SectoralForm updated successfully:', ['updated_form' => $form]);

    // Redirect back with a success message
    return redirect()->back()->with('success', 'Sectoral form updated successfully');
}

    public function destroy($id) {
        $form = SectoralForm::findOrFail($id);
        
        // Delete image if exists
        if ($form->image && file_exists(public_path($form->image))) {
        unlink(public_path($form->image));
    }
        // Delete related requirements
        $form->requirements()->delete();
        
        // Delete the form
        $form->delete();
        
        return redirect()->back()->with('success', 'Sectoral form deleted successfully');
    }
}

