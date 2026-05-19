import { Bot, Send, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { type ChatbotMessage, chatbotService } from '@/services/chatbotService';

// ── Typing indicator ──────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-surface-container-low rounded-2xl rounded-bl-sm w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ── Chatbot Widget ────────────────────────────────────────────────────────────

export default function ChatbotWidget() {
  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState<ChatbotMessage[]>([]);
  const [input, setInput]           = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [sessionId, setSessionId]   = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Auto-scroll khi có tin nhắn mới
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input khi mở panel
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatbotMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await chatbotService.sendMessage({ message: text });
      if (res.session_id) setSessionId(res.session_id);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = async () => {
    try {
      await chatbotService.clearHistory(sessionId);
    } catch {
      // ignore
    }
    setMessages([]);
    setSessionId(undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Đóng chatbot' : 'Mở chatbot tư vấn'}
        aria-expanded={isOpen}
        className={`fixed bottom-6 right-4 sm:right-6 z-40 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-on-surface text-white scale-95'
            : 'bg-primary text-white hover:scale-110'
        }`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-outline-variant/20 flex flex-col overflow-hidden"
          style={{ maxHeight: 'min(560px, calc(100vh - 8rem))' }}
          role="region"
          aria-label="Chat tư vấn"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-white">
            <div className="flex items-center gap-2.5">
              <Bot className="w-5 h-5" />
              <div>
                <p className="text-sm font-semibold leading-tight">Trợ lý Woodcraft</p>
                <p className="text-[11px] opacity-80">Tư vấn sản phẩm & đơn hàng</p>
              </div>
            </div>
            <button
              onClick={handleClear}
              aria-label="Xóa lịch sử chat"
              title="Xóa lịch sử"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-10 h-10 mx-auto mb-3 text-outline-variant" />
                <p className="text-sm text-on-surface-variant">
                  Xin chào! Tôi có thể giúp bạn tư vấn sản phẩm gỗ thủ công.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {['Sản phẩm bán chạy?', 'Chất liệu gỗ nào tốt?'].map((hint) => (
                    <button
                      key={hint}
                      onClick={() => { setInput(hint); inputRef.current?.focus(); }}
                      className="text-[11px] text-primary border border-primary/30 px-2.5 py-1 rounded-full hover:bg-primary/5 transition-colors"
                    >
                      {hint}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-surface-container-low text-on-surface rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <TypingDots />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-outline-variant/20">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi…"
              disabled={isTyping}
              aria-label="Nhập tin nhắn"
              className="flex-1 px-3 py-2 text-sm rounded-full bg-surface-container-low text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 transition"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              aria-label="Gửi"
              className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
