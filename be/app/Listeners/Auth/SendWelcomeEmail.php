<?php

namespace App\Listeners\Auth;

use App\Events\Auth\UserRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class SendWelcomeEmail implements ShouldQueue
{
    public string $queue = 'emails';

    public function handle(UserRegistered $event): void
    {
        // TODO: implement Mailable khi có mail service
        Log::info('Welcome email queued', ['user_id' => $event->user->id]);
        // Mail::to($event->user->email)->send(new WelcomeMail($event->user));
    }

    public function failed(UserRegistered $event, \Throwable $exception): void
    {
        Log::error('Failed to send welcome email', [
            'user_id' => $event->user->id,
            'error'   => $exception->getMessage(),
        ]);
    }
}
