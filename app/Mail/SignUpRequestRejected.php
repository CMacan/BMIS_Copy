<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SignUpRequestRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $rejectionMessage;
    /**
     * Create a new message instance.
     * 
     * @param string $rejectionMessage
     */
    public function __construct($rejectionMessage)
    {
        $this->rejectionMessage = $rejectionMessage;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Sign Up Request Rejected',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.sign_up_request_rejected', // Updated to use the correct view
            with: [
                'rejectionMessage' => $this->rejectionMessage, // Pass the rejection message to the view
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
