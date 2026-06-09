import { api, call, unwrap } from './apiClient';

export type ChatbotMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatbotPayload = {
  message: string;
  session_id?: string; // gửi lại để BE dùng cache key cũ, giữ context
};

export type ChatbotResponse = {
  reply: string;
  session_id?: string; // backend trả về để dùng khi clear history
};

export const chatbotService = {
  sendMessage: (payload: ChatbotPayload) =>
    unwrap<ChatbotResponse>(api.post('/chatbot', payload)),

  // Backend yêu cầu session_id khi clear (ChatbotController.php line 42)
  clearHistory: (sessionId?: string) =>
    call(api.delete('/chatbot/history', { params: sessionId ? { session_id: sessionId } : {} })),
};
