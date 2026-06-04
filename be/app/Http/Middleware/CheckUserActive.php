<?php

namespace App\Http\Middleware;

use App\Exceptions\AuthException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserActive
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->isCustomer() && !$user->is_active) {
            // Revoke all personal access tokens for this customer
            $user->tokens()->delete();

            throw AuthException::accountLocked();
        }

        return $next($request);
    }
}
