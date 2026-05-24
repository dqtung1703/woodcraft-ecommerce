import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import CategoryModal from '@/components/admin/CategoryModal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { adminCategoryService } from '@/services/adminService';
import { categoryService } from '@/services/categoryService';
import type { Category } from '@/types/category';

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      setCategories(await categoryService.getCategories());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const saveCategory = async (data: { name: string; description?: string }) => {
    setSaving(true);
    try {
      if (editing) {
        await adminCategoryService.update(editing.id, data);
        toast.success('Đã cập nhật danh mục');
      } else {
        await adminCategoryService.create(data);
        toast.success('Đã tạo danh mục');
      }
      setModalOpen(false);
      await loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lưu danh mục thất bại');
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminCategoryService.delete(deleting.id);
      toast.success('Đã xóa danh mục');
      setDeleting(null);
      await loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa danh mục thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Danh mục</h2>
          <p className="mt-1 text-sm text-slate-500">Quản lý nhóm sản phẩm trong cửa hàng.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          Thêm mới
        </button>
      </div>

      <AdminTable
        data={categories}
        loading={loading}
        keyExtractor={(row) => row.id}
        columns={[
          { key: 'name', label: 'Tên', render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
          { key: 'description', label: 'Mô tả', render: (row) => row.description || '-' },
          { key: 'count', label: 'Số sản phẩm', className: 'text-right', render: (row) => row.products_count },
          {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (row) => (
              <div className="flex justify-end gap-2">
                <button onClick={() => { setEditing(row); setModalOpen(true); }} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900" title="Sửa">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => setDeleting(row)} className="rounded-md p-2 text-red-500 hover:bg-red-50" title="Xóa">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <CategoryModal
        open={modalOpen}
        category={editing}
        loading={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={saveCategory}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleting?.name ?? ''}"?`}
        danger
        loading={saving}
        onCancel={() => setDeleting(null)}
        onConfirm={deleteCategory}
      />
    </div>
  );
}
