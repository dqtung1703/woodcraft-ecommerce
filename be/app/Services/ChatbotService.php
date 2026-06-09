<?php

namespace App\Services;

use App\Exceptions\BusinessException;
use App\Models\Product;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class ChatbotService
{
    private string $apiKey;
    private string $apiUrl    = 'https://openrouter.ai/api/v1/chat/completions';
    private string $model     = 'openai/gpt-oss-120b:free';
    private int    $maxMessages = 10;   // số cặp user/assistant giữ trong history
    private int    $ttlMinutes  = 30;
    private int    $descMaxLen  = 200;  // cắt description để tránh prompt phình

    public function __construct()
    {
        // Ưu tiên đọc key openrouter từ config, nếu không có fallback về openai key
        $this->apiKey = config('services.openrouter.key') ?: config('services.openai.key') ?: '';
    }

    // =========================================================================
    // Public API
    // =========================================================================

    public function chat(string $message, string $sessionId, int|string $userId): array
    {
        if (empty($this->apiKey)) {
            throw new BusinessException('Hệ thống AI chưa được cấu hình API Key.', 500);
        }

        // Khoá cô lập bảo vệ rò rỉ session giữa các user
        $cacheKey = "chatbot_session_{$userId}_{$sessionId}";

        // 1. Load history từ cache (system prompt + các lượt user/assistant cũ)
        $history = Cache::get($cacheKey, []);

        if (empty($history)) {
            $history[] = ['role' => 'system', 'content' => $this->buildSystemPrompt()];
        }

        // 2. Detect intent & lấy context sản phẩm liên quan (nếu câu hỏi cần)
        $productContext = $this->getProductContext($message);

        // 3. Build $requestMessages cho lần gọi này — KHÔNG lưu context vào history
        //    Augment user message với product context nếu có
        $userContent = $productContext
            ? "[Dữ liệu sản phẩm tham khảo]\n{$productContext}\n\n[Câu hỏi khách]\n{$message}"
            : $message;

        $requestMessages = array_merge($history, [
            ['role' => 'user', 'content' => $userContent],
        ]);

        // 4. Gọi OpenRouter API
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'HTTP-Referer'  => url('/'),
                'X-Title'       => 'Woodcraft E-commerce',
            ])->timeout(30)->post($this->apiUrl, [
                'model'    => $this->model,
                'messages' => $requestMessages,
            ]);

            if ($response->failed()) {
                Log::error('OpenRouter API Failed', ['response' => $response->body()]);
                return [
                    'reply'      => 'Hệ thống AI đang bảo trì. Vui lòng thử lại sau một lát.',
                    'session_id' => $sessionId,
                ];
            }

            $replyContent = $response->json('choices.0.message.content');

            if (!$replyContent) {
                return [
                    'reply'      => 'AI đang bị lỗi phản hồi. Vui lòng hỏi lại nha.',
                    'session_id' => $sessionId,
                ];
            }
        } catch (\Exception $e) {
            Log::error('OpenRouter Connect Exception', ['error' => $e->getMessage()]);
            return [
                'reply'      => 'Kết nối tới AI thất bại. Vui lòng thử lại sau.',
                'session_id' => $sessionId,
            ];
        }

        // 5. Cache chỉ lưu câu hỏi GỐC + câu trả lời — không lưu product context
        $history[] = ['role' => 'user',      'content' => $message];
        $history[] = ['role' => 'assistant', 'content' => $replyContent];

        // Trim history nếu vượt giới hạn (giữ system + N cặp gần nhất)
        if (count($history) > $this->maxMessages * 2 + 1) {
            $system  = $history[0];
            $sliced  = array_slice($history, -($this->maxMessages * 2));
            $history = array_merge([$system], $sliced);
        }

        Cache::put($cacheKey, $history, now()->addMinutes($this->ttlMinutes));

        return [
            'reply'      => $replyContent,
            'session_id' => $sessionId,
        ];
    }

    public function clearHistory(string $sessionId, int|string $userId): void
    {
        Cache::forget("chatbot_session_{$userId}_{$sessionId}");
    }

    // =========================================================================
    // System Prompt
    // =========================================================================

    private function buildSystemPrompt(): string
    {
        return <<<PROMPT
Bạn là trợ lý tư vấn của Woodcraft — xưởng gỗ thủ công cao cấp Việt Nam.

QUY TẮC:
• Tư vấn DỰA TRÊN danh sách sản phẩm được cung cấp trong [Dữ liệu sản phẩm tham khảo] khi có.
• KHÔNG nói "không có sản phẩm" hay "chưa có mặt hàng" nếu chưa nhận được danh sách từ hệ thống.
• Trả lời ngắn gọn, dùng bullet (•), KHÔNG dùng bảng markdown (|---|).
• Tối đa 3–4 gợi ý mỗi lượt. Giá format: "1.200.000 VNĐ".
• Nếu chưa rõ ngân sách hoặc dịp tặng, đưa 2–3 gợi ý trước rồi hỏi thêm 1 câu.
• Câu hỏi về chính sách (đổi trả, vận chuyển, địa chỉ): trả lời lịch sự, không bịa thông tin cụ thể.
PROMPT;
    }

    // =========================================================================
    // Intent Detection
    // =========================================================================

    /**
     * Kiểm tra câu hỏi có liên quan đến sản phẩm không.
     * Dùng để gate retrieval — tránh query DB với câu như "shop ở đâu", "đổi trả thế nào".
     */
    private function hasProductIntent(string $message): bool
    {
        $keywords = [
            // Loại sản phẩm nội thất
            'gỗ', 'bàn', 'ghế', 'giường', 'tủ', 'kệ', 'cửa', 'nội thất',
            // Quà tặng / khảm trai
            'khảm', 'quà', 'tặng', 'tranh', 'đĩa', 'hộp', 'khay', 'bút',
            'tráp', 'lót', 'đựng', 'trà',
            // Intent mua / tư vấn
            'mua', 'giá', 'bao nhiêu', 'có không', 'loại', 'sản phẩm',
            'gợi ý', 'tư vấn', 'chọn', 'nên lấy', 'tìm',
            // Follow-up so sánh — để "cái nào rẻ hơn?" vẫn trigger retrieval
            'rẻ', 'đắt', 'hơn', 'cái nào', 'món nào', 'loại nào', 'so sánh',
            'rẻ hơn', 'đắt hơn', 'tốt hơn', 'ngon hơn',
        ];

        $lower = mb_strtolower($message);
        foreach ($keywords as $kw) {
            if (str_contains($lower, $kw)) {
                return true;
            }
        }

        return false;
    }

    // =========================================================================
    // Product Retrieval
    // =========================================================================

    /**
     * Normalize + tokenize câu hỏi thành mảng search terms.
     * Bỏ dấu câu, giữ dấu tiếng Việt (DB cũng có dấu), lọc stop-word.
     */
    private function extractSearchTerms(string $message): array
    {
        // Bỏ dấu câu cơ bản trước khi split
        $normalized = preg_replace('/[?!.,;:\"\'\'\"\(\)\[\]]/u', ' ', $message);
        $normalized = mb_strtolower($normalized);

        $stopWords = [
            'tôi', 'muốn', 'mua', 'có', 'không', 'là', 'và', 'cho',
            'của', 'một', 'cái', 'con', 'bộ', 'đang', 'được', 'thì',
            'mà', 'hay', 'hoặc', 'với', 'về', 'trong', 'nào', 'nên',
            'ạ', 'nhé', 'nha', 'ơi', 'à', 'ừ',
        ];

        $raw = explode(' ', $normalized);
        $terms = [];

        foreach ($raw as $t) {
            $t = trim($t);
            if ($t !== '' && mb_strlen($t) >= 2 && !in_array($t, $stopWords)) {
                $terms[] = $t;
            }
        }

        return array_values(array_unique($terms));
    }

    /**
     * 2-pass ranked retrieval:
     *   Pass 1 — match name / category / material (điểm cao)
     *   Pass 2 — bổ sung từ description nếu < 3 kết quả (điểm thấp)
     *   Fallback — latest products nếu vẫn trống
     */
    private function getRelevantProducts(string $message): Collection
    {
        $terms = $this->extractSearchTerms($message);

        // Pass 1: name, category, material
        $results = Product::with('category')
            ->where('stock', '>', 0)
            ->where(function ($q) use ($terms) {
                foreach ($terms as $term) {
                    $q->orWhere('name', 'LIKE', "%{$term}%")
                      ->orWhereHas('category', fn ($c) => $c->where('name', 'LIKE', "%{$term}%"))
                      ->orWhere('material', 'LIKE', "%{$term}%");
                }
            })
            ->limit(8)
            ->get(['id', 'name', 'price', 'description', 'material', 'category_id']);

        // Pass 2: description match nếu kết quả ít
        if ($results->count() < 3 && !empty($terms)) {
            $descMatches = Product::with('category')
                ->where('stock', '>', 0)
                ->whereNotIn('id', $results->pluck('id'))
                ->where(function ($q) use ($terms) {
                    foreach ($terms as $term) {
                        $q->orWhere('description', 'LIKE', "%{$term}%");
                    }
                })
                ->limit(8 - $results->count())
                ->get(['id', 'name', 'price', 'description', 'material', 'category_id']);

            $results = $results->merge($descMatches);
        }

        // Fallback: latest nếu vẫn trống (vd câu follow-up ngắn không match gì)
        if ($results->isEmpty()) {
            $results = Product::with('category')
                ->where('stock', '>', 0)
                ->latest()
                ->limit(4)
                ->get(['id', 'name', 'price', 'description', 'material', 'category_id']);
        }

        return $results;
    }

    /**
     * Kết hợp intent gate + retrieval → trả về chuỗi context hoặc null.
     * Null nghĩa là không inject sản phẩm (câu hỏi về chính sách, hội thoại thường).
     */
    private function getProductContext(string $message): ?string
    {
        if (!$this->hasProductIntent($message)) {
            return null;
        }

        $products = $this->getRelevantProducts($message);

        if ($products->isEmpty()) {
            return null;
        }

        return $products->map(function ($p) {
            $price    = number_format($p->price);
            $category = $p->category?->name ?? '';
            $material = $p->material ? " | Chất liệu: {$p->material}" : '';

            // Cắt description tối đa $descMaxLen ký tự để tránh prompt phình
            $desc = mb_strlen($p->description) > $this->descMaxLen
                ? mb_substr($p->description, 0, $this->descMaxLen) . '…'
                : $p->description;

            return "• {$p->name} ({$category}{$material}): {$price} VNĐ — {$desc}";
        })->implode("\n");
    }
}
