<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\DocumentRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;

class NotificationService
{
    /**
     * Notification categories and their configurations
     */
    private const NOTIFICATION_CONFIGS = [
        'document_request' => [
            'icon' => 'FileText',
            'color' => 'text-yellow-600',
            'priority' => 'medium',
        ],
        'document_approved' => [
            'icon' => 'CheckCircle',
            'color' => 'text-green-600',
            'priority' => 'high',
        ],
        'document_declined' => [
            'icon' => 'XCircle',
            'color' => 'text-red-600',
            'priority' => 'high',
        ],
        'document_completed' => [
            'icon' => 'CheckCircle',
            'color' => 'text-blue-600',
            'priority' => 'medium',
        ],
        'new_user_registration' => [
            'icon' => 'User',
            'color' => 'text-blue-600',
            'priority' => 'low',
        ],
        'profile_verification' => [
            'icon' => 'CheckCircle',
            'color' => 'text-green-600',
            'priority' => 'medium',
        ],
        'announcement' => [
            'icon' => 'Bell',
            'color' => 'text-blue-600',
            'priority' => 'medium',
        ],
        'household_registration' => [
            'icon' => 'Home',
            'color' => 'text-purple-600',
            'priority' => 'low',
        ],
        'complaint_submitted' => [
            'icon' => 'AlertTriangle',
            'color' => 'text-orange-600',
            'priority' => 'high',
        ],
        'system_maintenance' => [
            'icon' => 'Settings',
            'color' => 'text-gray-600',
            'priority' => 'low',
        ],
    ];

    /**
     * Send notification to a specific user
     */
    public function sendToUser(
        int $userId,
        string $title,
        string $message,
        string $category = 'info',
        ?Model $reference = null,
        ?int $staffId = null,
        ?string $actionUrl = null,
        array $metadata = []
    ): ?Notification {
        try {
            $config = self::NOTIFICATION_CONFIGS[$category] ?? [
                'icon' => 'Info',
                'color' => 'text-gray-600',
                'priority' => 'low',
            ];

            $notificationData = [
                'user_id' => $userId,
                'staff_id' => $staffId,
                'notif_title' => $title,
                'notif_message' => $message,
                'notif_status' => 'unread',
                'notif_category' => $category,
                'priority' => $config['priority'],
                'action_url' => $actionUrl,
                'metadata' => array_merge($metadata, [
                    'icon' => $config['icon'],
                    'color' => $config['color'],
                ]),
            ];

            if ($reference) {
                $notificationData['reference_id'] = $reference->id;
                $notificationData['reference_type'] = get_class($reference);
                
                // Special handling for DocumentRequest
                if ($reference instanceof DocumentRequest) {
                    $notificationData['document_request_id'] = $reference->id;
                }
            }

            $notification = Notification::create($notificationData);

            Log::info("Notification sent to user {$userId}", [
                'category' => $category,
                'title' => $title,
                'notification_id' => $notification->id,
            ]);

            return $notification;

        } catch (\Exception $e) {
            Log::error('Error sending notification to user: ' . $e->getMessage(), [
                'user_id' => $userId,
                'category' => $category,
                'title' => $title,
            ]);
            return null;
        }
    }

    /**
     * Send notification to all admins
     */
    public function sendToAdmins(
        string $title,
        string $message,
        string $category = 'info',
        ?Model $reference = null,
        ?int $staffId = null,
        ?string $actionUrl = null,
        array $metadata = []
    ): array {
        try {
            $adminUsers = $this->getAdminUsers();
            $notifications = [];

            foreach ($adminUsers as $admin) {
                $notification = $this->sendToUser(
                    $admin->id,
                    $title,
                    $message,
                    $category,
                    $reference,
                    $staffId,
                    $actionUrl,
                    $metadata
                );

                if ($notification) {
                    $notifications[] = $notification;
                }
            }

            Log::info("Notifications sent to " . count($notifications) . " admins", [
                'category' => $category,
                'title' => $title,
            ]);

            return $notifications;

        } catch (\Exception $e) {
            Log::error('Error sending notification to admins: ' . $e->getMessage(), [
                'category' => $category,
                'title' => $title,
            ]);
            return [];
        }
    }

    /**
     * Send notification to users with specific role
     */
    public function sendToRole(
        string $roleName,
        string $title,
        string $message,
        string $category = 'info',
        ?Model $reference = null,
        ?int $staffId = null,
        ?string $actionUrl = null,
        array $metadata = []
    ): array {
        try {
            $users = User::whereHas('roles', function($query) use ($roleName) {
                $query->where('name', $roleName);
            })->get();

            $notifications = [];

            foreach ($users as $user) {
                $notification = $this->sendToUser(
                    $user->id,
                    $title,
                    $message,
                    $category,
                    $reference,
                    $staffId,
                    $actionUrl,
                    $metadata
                );

                if ($notification) {
                    $notifications[] = $notification;
                }
            }

            return $notifications;

        } catch (\Exception $e) {
            Log::error('Error sending notification to role: ' . $e->getMessage(), [
                'role' => $roleName,
                'category' => $category,
            ]);
            return [];
        }
    }

    /**
     * Document-specific notification methods
     */
    public function documentRequestSubmitted(DocumentRequest $documentRequest): array
    {
        return $this->sendToAdmins(
            'New Document Request 📋',
            "New {$documentRequest->document_type} request from {$documentRequest->name}. Purpose: {$documentRequest->purpose}",
            'document_request',
            $documentRequest,
            $documentRequest->user_id,
            "/admin/document-requests?highlight={$documentRequest->id}",
            [
                'document_type' => $documentRequest->document_type,
                'user_name' => $documentRequest->name,
                'purpose' => $documentRequest->purpose,
            ]
        );
    }

    public function documentStatusChanged(DocumentRequest $documentRequest, string $status, ?int $staffId = null): ?Notification
    {
        $statusMessages = [
            'approved' => [
                'title' => 'Document Request Approved! ✅',
                'message' => "Your {$documentRequest->document_type} request has been approved and is ready for processing.",
                'category' => 'document_approved',
                'url' => '/user/document-requests/history',
            ],
            'declined' => [
                'title' => 'Document Request Declined ❌',
                'message' => "Your {$documentRequest->document_type} request has been declined." . 
                           ($documentRequest->decline_reason ? " Reason: {$documentRequest->decline_reason}" : ""),
                'category' => 'document_declined',
                'url' => '/user/document-requests/history',
            ],
            'completed' => [
                'title' => 'Document Ready for Pickup! 📄',
                'message' => "Your {$documentRequest->document_type} is now ready for pickup at the barangay office.",
                'category' => 'document_completed',
                'url' => '/user/document-requests/history',
            ],
        ];

        $notificationData = $statusMessages[$status] ?? null;

        if ($notificationData) {
            return $this->sendToUser(
                $documentRequest->user_id,
                $notificationData['title'],
                $notificationData['message'],
                $notificationData['category'],
                $documentRequest,
                $staffId,
                $notificationData['url'],
                [
                    'document_type' => $documentRequest->document_type,
                    'status' => $status,
                    'decline_reason' => $documentRequest->decline_reason ?? null,
                ]
            );
        }

        return null;
    }

    /**
     * User registration notification
     */
    public function newUserRegistered(User $user): array
    {
        return $this->sendToAdmins(
            'New User Registration 👤',
            "New user {$user->name} ({$user->email}) has registered and is pending verification.",
            'new_user_registration',
            $user,
            null,
            "/admin/sign-up-requests",
            [
                'user_name' => $user->name,
                'user_email' => $user->email,
                'registration_date' => $user->created_at->format('Y-m-d H:i:s'),
            ]
        );
    }

    /**
     * Profile verification notification
     */
    public function profileVerified(User $user, ?int $staffId = null): ?Notification
    {
        return $this->sendToUser(
            $user->id,
            'Profile Verified! ✅',
            'Your profile has been verified and you now have full access to all barangay services.',
            'profile_verification',
            $user,
            $staffId,
            '/dashboard',
            [
                'verification_date' => now()->format('Y-m-d H:i:s'),
            ]
        );
    }

    /**
     * Bulk notification for announcements
     */
    public function sendAnnouncement(
        string $title,
        string $message,
        ?string $targetRole = null,
        ?array $userIds = null
    ): array {
        try {
            $notifications = [];

            if ($userIds) {
                // Send to specific users
                foreach ($userIds as $userId) {
                    $notification = $this->sendToUser(
                        $userId,
                        $title,
                        $message,
                        'announcement',
                        null,
                        auth()->id(),
                        '/announcements'
                    );
                    if ($notification) {
                        $notifications[] = $notification;
                    }
                }
            } elseif ($targetRole) {
                // Send to users with specific role
                $notifications = $this->sendToRole(
                    $targetRole,
                    $title,
                    $message,
                    'announcement',
                    null,
                    auth()->id(),
                    '/announcements'
                );
            } else {
                // Send to all users
                $users = User::whereNotNull('email_verified_at')->get();
                foreach ($users as $user) {
                    $notification = $this->sendToUser(
                        $user->id,
                        $title,
                        $message,
                        'announcement',
                        null,
                        auth()->id(),
                        '/announcements'
                    );
                    if ($notification) {
                        $notifications[] = $notification;
                    }
                }
            }

            return $notifications;

        } catch (\Exception $e) {
            Log::error('Error sending announcement: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get admin users
     */
    private function getAdminUsers(): \Illuminate\Database\Eloquent\Collection
    {
        // Try to get users with admin role
        $adminUsers = User::whereHas('roles', function($query) {
            $query->where('name', 'admin');
        })->get();

        // Fallback: if no role-based admins, get specific users
        if ($adminUsers->isEmpty()) {
            $adminUsers = User::whereIn('id', [1])->get(); // Adjust IDs as needed
        }

        return $adminUsers;
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId, int $userId): bool
    {
        try {
            $notification = Notification::where('id', $notificationId)
                ->where('user_id', $userId)
                ->first();

            if ($notification) {
                $notification->update(['notif_date_read' => now()]);
                return true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Error marking notification as read: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get notification statistics
     */
    public function getStats(int $userId): array
    {
        try {
            $total = Notification::where('user_id', $userId)->count();
            $unread = Notification::where('user_id', $userId)->unread()->count();
            $recentUnread = Notification::where('user_id', $userId)
                ->unread()
                ->recent(7)
                ->count();

            return [
                'total' => $total,
                'unread' => $unread,
                'recent_unread' => $recentUnread,
                'read_percentage' => $total > 0 ? round((($total - $unread) / $total) * 100, 1) : 100,
            ];
        } catch (\Exception $e) {
            Log::error('Error getting notification stats: ' . $e->getMessage());
            return [
                'total' => 0,
                'unread' => 0,
                'recent_unread' => 0,
                'read_percentage' => 100,
            ];
        }
    }
}
