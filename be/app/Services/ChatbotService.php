<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

final class ChatbotService
{
    private string $apiKey;
    private string $apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private string $model  = 'google/gemma-2-9b-it:free';
    private int $maxMessages = 10;
    private int $ttlMinutes = 30;

    public function __construct()
    {
        // Ưu tiên đọc key openrouter từ config, nếu không có fallback về openai key
        $this->apiKey = config('services.openrouter.key') ?: config('services.openai.key') ?: '';
    }

    public function chat(string $message, string $sessionId, int|string $userId): array
    {
        if (empty($this->apiKey)) {
            throw new BusinessException('Hệ thống AI chưa được cấu hình API Key.', 500);
        }

        // Khóa cô lập bảo vệ rò rỉ session giữa các user
        $cacheKey = "chatbot_session_{$userId}_{$sessionId}";

        // Tải Context từ RAM cache (nếu có)
        $messages = Cache::get($cacheKey, []);
        
        if (empty($messages)) {
            // Lần đầu khởi tạo Session
            $messages[] = [
                'role' => 'system',
                'content' => $this->buildSystemPrompt($message)
            ];
        }

        // Nhồi thêm câu hỏi mới
        $messages[] = ['role' => 'user', 'content' => $message];

        // Call OpenRouter API
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'HTTP-Referer'  => url('/'),
                'X-Title'       => 'Woodcraft E-commerce'
            ])->timeout(30)->post($this->apiUrl, [
                'model'    => $this->model,
                'messages' => $messages,
            ]);

            if ($response->failed()) {
                Log::error('OpenRouter API Failed', ['response' => $response->body()]);
                return [
                    'reply' => 'Hệ thống AI đang bảo trì. Vui lòng thử lại sau một lát.',
                    'session_id' => $sessionId
                ];
            }
            
            $replyContent = $response->json('choices.0.message.content');
            
            if (!$replyContent) {
                 return [
                    'reply' => 'AI đang bị lỗi phản hồi. Vui lòng hỏi lại nha.',
                    'session_id' => $sessionId
                ];
            }

        } catch (\Exception $e) {
            Log::error('OpenRouter Connect Exception', ['error' => $e->getMessage()]);
            return [
                'reply' => 'Kết nối tới AI thất bại. Vui lòng thử lại sau.',
                'session_id' => $sessionId
            ];
        }

        // Lưu câu trả lời của AI
        $messages[] = ['role' => 'assistant', 'content' => $replyContent];

        // Lọc đi các node dư thừa
        if (count($messages) > $this->maxMessages * 2) {
            $system = $messages[0];
            $sliced = array_slice($messages, -($this->maxMessages * 2) + 1);
            array_unshift($sliced, $system);
            $messages = $sliced;
        }

        Cache::put($cacheKey, $messages, now()->addMinutes($this->ttlMinutes));

        return [
            'reply' => $replyContent,
            'session_id' => $sessionId
        ];
    }

    public function clearHistory(string $sessionId, int|string $userId): void
    {
        $cacheKey = "chatbot_session_{$userId}_{$sessionId}";
        Cache::forget($cacheKey);
    }

    private function buildSystemPrompt(string $userMessage): string
    {
        $basePrompt = "Bạn là trợ lý ảo thân thiện của xưởng mộc Woodcraft. Tư vấn ngắn gọn, lịch sự, tập trung vào đồ nội thất và gỗ.\n";

        $keywords = ['gỗ', 'bàn', 'ghế', 'giường', 'tủ', 'kệ', 'cửa', 'nội thất'];
        $found = false;
        
        $lowercaseMsg = mb_strtolower($userMessage);
        
        foreach ($keywords as $keyword) {
            if (Str::contains($lowercaseMsg, $keyword)) {
                $found = true;
                break;
            }
        }

        if ($found) {
            // Trích xuất Data (Đã cache lại để chống Overload DB do inRandomOrder)
            $products = Cache::remember('chatbot_products', 300, fn() =>
                Product::where('stock', '>', 0)
                    ->latest()
                    ->limit(5)
                    ->get(['name', 'price', 'description'])
            );

            if ($products->isNotEmpty()) {
                $basePrompt .= "\nDữ liệu sản phẩm tham khảo:\n";
                foreach ($products as $p) {
                    $priceFormat = number_format($p->price);
                    $basePrompt .= "- {$p->name}: {$priceFormat} VNĐ. {$p->description}\n";
                }
                $basePrompt .= "\nHãy dùng thông tin trên gợi ý sản phẩm phù hợp cho khách.";
            }
        }

        return $basePrompt;
    }
}
