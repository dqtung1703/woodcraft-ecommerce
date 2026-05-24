import { Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import StarRating from '@/components/ui/StarRating';
import { useToast } from '@/contexts/ToastContext';
import { adminReviewService } from '@/services/adminService';
import type { AdminReview } from '@/types/admin';

const ratingOptions = [0, 1, 2, 3, 4, 5];

export default function AdminReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [deleting, setDeleting] = useState<AdminReview | null>(null);

  const loadReviews = async (nextPage = page) => {
    setLoading(true);
    try {
      const result = await adminReviewService.getAll({
        rating: rating || undefined,
        search: search || undefined,
        page: nextPage,
        per_page: 12,
      });
      setReviews(result.data);
      setPage(result.meta.pagination?.current_page ?? nextPage);
      setLastPage(result.meta.pagination?.last_page ?? 1);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReviews(1);
  }, [rating]);

  const deleteReview = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminReviewService.delete(deleting.id);
      toast.success('Đã xóa đánh giá');
      setDeleting(null);
      await loadReviews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa đánh giá thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-950">Đánh giá</h2>
        <p className="mt-1 text-sm text-slate-500">Kiểm duyệt và xóa các đánh giá không phù hợp.</p>
      </div>

      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap gap-2">
          {ratingOptions.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                rating === value
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {value === 0 ? 'Tất cả' : `${value} sao`}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && void loadReviews(1)}
              placeholder="Tìm trong nội dung đánh giá"
              className="admin-input pl-9"
            />
          </div>
          <button
            onClick={() => void loadReviews(1)}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <AdminTable
        data={reviews}
        loading={loading}
        emptyText="Không có đánh giá"
        keyExtractor={(row) => row.id}
        columns={[
          {
            key: 'product',
            label: 'Sản phẩm',
            render: (row) => <span className="font-medium text-slate-900">{row.product?.name ?? '-'}</span>,
          },
          { key: 'user', label: 'Khách hàng', render: (row) => row.user?.name ?? '-' },
          {
            key: 'rating',
            label: 'Đánh giá',
            render: (row) => <StarRating rating={row.rating} size="sm" />,
          },
          {
            key: 'comment',
            label: 'Nội dung',
            render: (row) => (
              <p className="max-w-md truncate text-slate-600" title={row.comment ?? ''}>
                {row.comment || '-'}
              </p>
            ),
          },
          { key: 'date', label: 'Ngày', render: (row) => row.created_at },
          {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (row) => (
              <button
                onClick={() => setDeleting(row)}
                className="rounded-md p-2 text-red-500 hover:bg-red-50"
                title="Xóa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ),
          },
        ]}
      />

      <div className="flex justify-end gap-2">
        <button
          disabled={page <= 1 || loading}
          onClick={() => void loadReviews(page - 1)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Trước
        </button>
        <span className="px-3 py-2 text-sm text-slate-600">{page}/{lastPage}</span>
        <button
          disabled={page >= lastPage || loading}
          onClick={() => void loadReviews(page + 1)}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      <ConfirmDialog
        open={!!deleting}
        title="Xóa đánh giá"
        message="Xóa đánh giá này sẽ không thể khôi phục."
        danger
        loading={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={deleteReview}
      />
    </div>
  );
}
