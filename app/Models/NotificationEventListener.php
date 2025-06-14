<?php

namespace App\Listeners;

use App\Services\NotificationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class NotificationEventListener implements ShouldQueue
{
    use InteractsWithQueue;

    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Handle various application events
     */
    public function handle($event)
    {
        try {
            switch (get_class($event)) {
                case 'App\Events\UserRegistered':
                    $this->handleUserRegistered($event);
                    break;

                case 'App\Events\DocumentRequestSubmitted':
                    $this->handleDocumentRequestSubmitted($event);
                    break;

                case 'App\Events\DocumentStatusChanged':
                    $this->handleDocumentStatusChanged($event);
                    break;

                case 'App\Events\ComplaintSubmitted':
                    $this->handleComplaintSubmitted($event);
                    break;

                default:
                    Log::info('Unhandled notification event: ' . get_class($event));
            }
        } catch (\Exception $e) {
            Log::error('Error handling notification event: ' . $e->getMessage(), [
                'event' => get_class($event),
                'event_data' => $event,
            ]);
        }
    }

    private function handleUserRegistered($event)
    {
        $this->notificationService->newUserRegistered($event->user);
    }

    private function handleDocumentRequestSubmitted($event)
    {
        $this->notificationService->documentRequestSubmitted($event->documentRequest);
    }

    private function handleDocumentStatusChanged($event)
    {
        $this->notificationService->documentStatusChanged(
            $event->documentRequest,
            $event->status,
            $event->staffId
        );
    }

    private function handleComplaintSubmitted($event)
    {
        $this->notificationService->sendToAdmins(
            'New Complaint Submitted 📢',
            "New complaint from {$event->complaint->complainant_name}: {$event->complaint->subject}",
            'complaint_submitted',
            $event->complaint,
            $event->complaint->user_id,
            "/admin/complaints/{$event->complaint->id}"
        );
    }
}
