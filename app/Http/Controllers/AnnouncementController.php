<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AnnouncementController extends Controller
{
    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of announcements
     */
    public function index()
    {
        $announcements = Announcement::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Admin/Announcements/Index', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Show the form for creating a new announcement
     */
    public function create()
    {
        return Inertia::render('Admin/Announcements/Create');
    }

    /**
     * Store a newly created announcement
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'priority' => 'nullable|string|in:low,medium,high',
                'target_audience' => 'nullable|string|in:all,residents,admin',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'publish_immediately' => 'boolean',
                'scheduled_at' => 'nullable|date|after:now',
            ]);

            // Handle image upload if present
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('announcements', 'public');
            }

            $announcement = Announcement::create([
                'title' => $request->title,
                'content' => $request->content,
                'priority' => $request->priority ?? 'medium',
                'target_audience' => $request->target_audience ?? 'all',
                'image_path' => $imagePath,
                'user_id' => Auth::id(),
                'published_at' => $request->publish_immediately ? now() : $request->scheduled_at,
                'status' => $request->publish_immediately ? 'published' : 'scheduled',
            ]);

            // Send notifications only if publishing immediately
            if ($request->publish_immediately) {
                $this->sendAnnouncementNotifications($announcement);
            }

            return redirect()->route('announcements.index')
                ->with('success', 'Announcement created successfully!' . 
                    ($request->publish_immediately ? ' Notifications have been sent.' : ' It will be published as scheduled.'));

        } catch (\Exception $e) {
            Log::error('Error creating announcement: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to create announcement. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Display the specified announcement
     */
    public function show(Announcement $announcement)
    {
        $announcement->load('user');
        
        return Inertia::render('Admin/Announcements/Show', [
            'announcement' => $announcement,
        ]);
    }

    /**
     * Show the form for editing the specified announcement
     */
    public function edit(Announcement $announcement)
    {
        return Inertia::render('Admin/Announcements/Edit', [
            'announcement' => $announcement,
        ]);
    }

    /**
     * Update the specified announcement
     */
    public function update(Request $request, Announcement $announcement)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'priority' => 'nullable|string|in:low,medium,high',
                'target_audience' => 'nullable|string|in:all,residents,admin',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'nullable|string|in:draft,published,archived',
            ]);

            // Handle image upload if present
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($announcement->image_path) {
                    Storage::disk('public')->delete($announcement->image_path);
                }
                $imagePath = $request->file('image')->store('announcements', 'public');
                $announcement->image_path = $imagePath;
            }

            $wasUnpublished = $announcement->status !== 'published';

            $announcement->update([
                'title' => $request->title,
                'content' => $request->content,
                'priority' => $request->priority ?? 'medium',
                'target_audience' => $request->target_audience ?? 'all',
                'status' => $request->status ?? $announcement->status,
            ]);

            // Send notifications if announcement is being published for the first time
            if ($wasUnpublished && $request->status === 'published') {
                $announcement->published_at = now();
                $announcement->save();
                $this->sendAnnouncementNotifications($announcement);
            }

            return redirect()->route('announcements.index')
                ->with('success', 'Announcement updated successfully!' . 
                    ($wasUnpublished && $request->status === 'published' ? ' Notifications have been sent.' : ''));

        } catch (\Exception $e) {
            Log::error('Error updating announcement: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to update announcement. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Remove the specified announcement
     */
    public function destroy(Announcement $announcement)
    {
        try {
            // Delete associated image if exists
            if ($announcement->image_path) {
                Storage::disk('public')->delete($announcement->image_path);
            }

            $announcement->delete();

            return redirect()->route('announcements.index')
                ->with('success', 'Announcement deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Error deleting announcement: ' . $e->getMessage());
            return redirect()->back()
                ->withErrors(['error' => 'Failed to delete announcement. Please try again.']);
        }
    }

    /**
     * Show announcements for landing page (public view)
     */
    public function showLandingPage()
    {
        $announcements = Announcement::where('status', 'published')
            ->where('target_audience', '!=', 'admin') // Exclude admin-only announcements
            ->orderBy('priority', 'desc')
            ->orderBy('published_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('View/Announcement', [
            'announcements' => $announcements,
        ]);
    }

    /**
     * Publish a scheduled announcement
     */
    public function publish(Announcement $announcement)
    {
        try {
            if ($announcement->status !== 'scheduled') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only scheduled announcements can be published.'
                ], 400);
            }

            $announcement->update([
                'status' => 'published',
                'published_at' => now(),
            ]);

            // Send notifications
            $this->sendAnnouncementNotifications($announcement);

            return response()->json([
                'success' => true,
                'message' => 'Announcement published and notifications sent successfully.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error publishing announcement: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to publish announcement.'
            ], 500);
        }
    }

    /**
     * Archive an announcement
     */
    public function archive(Announcement $announcement)
    {
        try {
            $announcement->update(['status' => 'archived']);

            return response()->json([
                'success' => true,
                'message' => 'Announcement archived successfully.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error archiving announcement: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to archive announcement.'
            ], 500);
        }
    }

    /**
     * Send notifications for announcement based on target audience
     */
    private function sendAnnouncementNotifications(Announcement $announcement)
    {
        try {
            // Determine target role based on target audience
            $targetRole = null;
            switch ($announcement->target_audience) {
                case 'residents':
                    $targetRole = 'resident';
                    break;
                case 'admin':
                    $targetRole = 'admin';
                    break;
                default:
                    $targetRole = null; // Send to all
            }

            // Create notification title with priority indicator
            $priorityEmoji = match($announcement->priority) {
                'high' => '🚨',
                'medium' => '📢',
                'low' => '📝',
                default => '📢'
            };

            $notificationTitle = "{$priorityEmoji} New Announcement: {$announcement->title}";
            
            // Truncate content for notification message
            $notificationMessage = strlen($announcement->content) > 150 
                ? substr($announcement->content, 0, 150) . '...' 
                : $announcement->content;

            // Send notifications using the NotificationService
            $notifications = $this->notificationService->sendAnnouncement(
                $notificationTitle,
                $notificationMessage,
                $targetRole
            );

            // Log notification sending
            Log::info("Announcement notifications sent", [
                'announcement_id' => $announcement->id,
                'title' => $announcement->title,
                'target_audience' => $announcement->target_audience,
                'notifications_sent' => count($notifications),
            ]);

            return $notifications;

        } catch (\Exception $e) {
            Log::error('Error sending announcement notifications: ' . $e->getMessage(), [
                'announcement_id' => $announcement->id,
                'title' => $announcement->title,
            ]);
            return [];
        }
    }

    /**
     * Get announcement statistics
     */
    public function getStats()
    {
        try {
            $stats = [
                'total' => Announcement::count(),
                'published' => Announcement::where('status', 'published')->count(),
                'scheduled' => Announcement::where('status', 'scheduled')->count(),
                'archived' => Announcement::where('status', 'archived')->count(),
                'recent' => Announcement::where('created_at', '>=', now()->subDays(7))->count(),
                'high_priority' => Announcement::where('priority', 'high')
                    ->where('status', 'published')
                    ->count(),
            ];

            return response()->json($stats);

        } catch (\Exception $e) {
            Log::error('Error getting announcement stats: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to get announcement statistics'
            ], 500);
        }
    }

    /**
     * Bulk operations for announcements
     */
    public function bulkAction(Request $request)
    {
        try {
            $request->validate([
                'action' => 'required|string|in:publish,archive,delete',
                'announcement_ids' => 'required|array',
                'announcement_ids.*' => 'exists:announcements,id',
            ]);

            $announcements = Announcement::whereIn('id', $request->announcement_ids)->get();
            $successCount = 0;

            foreach ($announcements as $announcement) {
                switch ($request->action) {
                    case 'publish':
                        if ($announcement->status === 'scheduled') {
                            $announcement->update([
                                'status' => 'published',
                                'published_at' => now(),
                            ]);
                            $this->sendAnnouncementNotifications($announcement);
                            $successCount++;
                        }
                        break;

                    case 'archive':
                        if ($announcement->status !== 'archived') {
                            $announcement->update(['status' => 'archived']);
                            $successCount++;
                        }
                        break;

                    case 'delete':
                        if ($announcement->image_path) {
                            Storage::disk('public')->delete($announcement->image_path);
                        }
                        $announcement->delete();
                        $successCount++;
                        break;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully {$request->action}ed {$successCount} announcement(s)."
            ]);

        } catch (\Exception $e) {
            Log::error('Error in bulk announcement action: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to perform bulk action.'
            ], 500);
        }
    }
}
