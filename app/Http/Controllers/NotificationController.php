<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            // Fetch notifications for the current user from your custom table
            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'data' => [
                            'notif_title' => $notification->notif_title,
                            'notif_message' => $notification->notif_message,
                            'type' => $notification->notif_category ?? 'info',
                            'link' => $notification->link ?? null,
                        ],
                        'read_at' => $notification->notif_date_read,
                        'created_at' => $notification->created_at,
                        'updated_at' => $notification->updated_at,
                    ];
                });

            return response()->json($notifications);

        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch notifications'], 500);
        }
    }

    public function markAsRead($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $notification = Notification::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if ($notification) {
                $notification->update(['notif_date_read' => now()]);
                return response()->json(['message' => 'Notification marked as read']);
            }

            return response()->json(['error' => 'Notification not found'], 404);

        } catch (\Exception $e) {
            Log::error('Error marking notification as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark notification as read'], 500);
        }
    }

    public function markAllAsRead()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            Notification::where('user_id', $user->id)
                ->whereNull('notif_date_read')
                ->update(['notif_date_read' => now()]);

            return response()->json(['message' => 'All notifications marked as read']);

        } catch (\Exception $e) {
            Log::error('Error marking all notifications as read: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to mark all notifications as read'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $notification = Notification::where('id', $id)
                ->where('user_id', $user->id)
                ->first();

            if ($notification) {
                $notification->delete();
                return response()->json(['message' => 'Notification deleted']);
            }

            return response()->json(['error' => 'Notification not found'], 404);

        } catch (\Exception $e) {
            Log::error('Error deleting notification: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete notification'], 500);
        }
    }
}
