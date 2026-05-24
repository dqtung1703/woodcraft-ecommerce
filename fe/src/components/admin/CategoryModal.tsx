import { useEffect, useState } from 'react';
import type { Category } from '@/types/category';

type CategoryModalProps = {
  open: boolean;
  category?: Category | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
};

export default function CategoryModal({
  open,
  category,
  loading = false,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '');
      setDescription(category?.description ?? '');
    }
  }, [category, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <form
        className="w-full max-w-lg rounded-lg bg-white shadow-xl"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ name: name.trim(), description: description.trim() || undefined });
        }}
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            {category ? 'Sửa danh mục' : 'Thêm danh mục'}
          </h2>
        </div>

        <div className="space-y-4 px-5 py-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tên danh mục</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}
