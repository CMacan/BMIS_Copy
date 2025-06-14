<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DocumentRequest;
use App\Models\Announcement;

use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    //
    public function index(Request $request)
    {
        $documentRequests = DocumentRequest::where('user_id', Auth::id())->get();
        $announcementRequests = Announcement::where('user_id', Auth::id())->get();
        $notifications = Announcement::where('user_id', Auth::id())->get();

        return Inertia::render('User/Dashboard', [
            'auth' => [
                'user' => $request->user()->load('profile'), // Load the profile relationship
            ],
            'documentRequests' => $documentRequests,
            'announcementRequests' => $announcementRequests,
            'notification' => $notifications,
        ]);
    }

    public function announcement_list(Request $request)
    {
        $totalEntries = Announcement::count();
        $announcements = Announcement::with('user')->latest()->get();

        return Inertia::render('User/AnnouncementList', [
            'auth' => [
                'user' => $request->user()->load('profile'), // Load the profile relationship
            ],
            'announcement' => $announcements,
            'totalEntries' => $totalEntries,
        ]);
    }
}
