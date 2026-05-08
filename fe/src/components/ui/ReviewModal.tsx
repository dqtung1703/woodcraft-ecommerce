import { Star, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ApiError } from '@/services/apiClient';
import { useToast } from '@/contexts/ToastContext';
import { reviewService } from '@/services/reviewService';

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  productId: number;
  productName: string;
  onSuccess: () => void;
  onClose: () => void;
};

// ── Interactive star picker ───────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Đánh giá sao">
      {Array.from({ length: 5 }).map((_, i) => {
        const star = i + 1;
        return (
          <button
            key={star}
            type="button"
            aria-label={`${star} sao`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= active
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-outline-variant'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const STAR_LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];
const MAX_COMMENT = 500;

export default function ReviewModal({ productId, productName, onSuccess, onClose }: Props) {
  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  // Focus close button on mount
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await reviewService.createReview({
        product_id: productId,
        rating,
        comment: comment.trim() || undefined,
      });
      toast.success('Cảm ơn đánh giá của bạn!');
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        // Backend trả ALREADY_REVIEWED nếu đã review sản phẩm này
        if (err.errorCode === 'ALREADY_REVIEWED') {
          toast.info('Bạn đã đánh giá sản phẩm này rồi.');
          onSuccess(); // Cập nhật UI sang trạng thái "Đã đánh giá"
          return;
        }
        setError(err.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
      } else {
        setError('Không thể gửi đánh giá. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 id="review-modal-title" className="font-serif text-lg text-on-surface">
              Đánh giá sản phẩm
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">{productName}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Đóng"
            className="text-outline-variant hover:text-on-surface transition-colors ml-4 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Star picker */}
          <div className="mb-1">
            <StarPicker value={rating} onChange={setRating} />
            <p className="text-xs text-on-surface-variant mt-1.5 h-4">
              {rating > 0 ? STAR_LABELS[rating] : 'Chọn số sao'}
            </p>
          </div>

          {/* Comment */}
          <div className="mt-4 mb-5">
            <label htmlFor="review-comment" className="block text-sm font-medium text-on-surface mb-1.5">
              Nhận xét <span className="text-on-surface-variant font-normal">(không bắt buộc)</span>
            </label>
            <textarea
              id="review-comment"
              rows={4}
              maxLength={MAX_COMMENT}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này…"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 text-sm text-on-surface placeholder:text-outline-variant resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
            <p className="text-right text-[11px] text-outline-variant mt-1">
              {comment.length}/{MAX_COMMENT}
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 mb-4" role="alert">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-outline-variant/50 rounded-full text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || rating === 0}
              className="flex-1 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang gửi…' : 'Gửi đánh giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
