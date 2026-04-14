<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Services\ChatbotService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

final class ChatbotController extends Controller
{
    public function __construct(private readonly ChatbotService $chatbotService) {}

    // POST /api/v1/chatbot
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message'    => ['required', 'string', 'max:1000'],
            'session_id' => ['nullable', 'string', 'max:100'],
        ]);

        $message   = $request->get('message');
        $sessionId = $request->get('session_id') ?: Str::uuid()->toString();

        // Guest logic? Chatbot usually accepts guest optionally, but this implies user isolation via Sanctum.
        // If route has No Auth, we would fallback to IP. 
        // Based on Route::middleware('throttle'), Chatbot is currently PUBLIC. 
        // We will mock user_id for public usage using an IP Hash or generic.
        
        $userId = $request->user()?->id ?? abs(crc32($request->ip()));

        $data = $this->chatbotService->chat($message, $sessionId, $userId);

        return ApiResponse::success($data);
    }

    // DELETE /api/v1/chatbot/history
    public function clearHistory(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => ['required', 'string', 'max:100'],
        ]);

        $sessionId = $request->get('session_id');
        $userId = $request->user()?->id ?? abs(crc32($request->ip()));

        $this->chatbotService->clearHistory($sessionId, $userId);

        return ApiResponse::message('Lịch sử trò chuyện đã được xóa.');
    }
}
