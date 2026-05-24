import { Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminTable from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/contexts/ToastContext';
import { adminProductService } from '@/services/adminService';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/formatCurrency';

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = async (nextPage = page) => {
    setLoading(true);
    try {
      const result = await productService.getProducts({
        search: search || undefined,
        category_id: categoryId ? Number(categoryId) : undefined,
        page: nextPage,
        per_page: 12,
        sort_by: 'created_at',
        sort_dir: 'desc',
      });
      setProducts(result.data);
      setPage(result.meta.pagination.current_page);
      setLastPage(result.meta.pagination.last_page);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không tải được sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    void loadProducts(1);
  }, [categoryId]);

  const deleteProduct = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminProductService.delete(deleting.id);
      toast.success('Đã xóa sản phẩm');
      setDeleting(null);
      await loadProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Sản phẩm</h2>
          <p className="mt-1 text-sm text-slate-500">Quản lý sản phẩm, giá bán và tồn kho.</p>
        </div>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:flex-row">
        <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void loadProducts(1)} placeholder="Tìm sản phẩm" className="admin-input lg:max-w-xs" />
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="admin-input lg:max-w-56">
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <button onClick={() => void loadProducts(1)} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Tìm kiếm
        </button>
      </div>

      <AdminTable
        data={products}
        loading={loading}
        keyExtractor={(row) => row.id}
        columns={[
          {
            key: 'image',
            label: 'Ảnh',
            render: (row) => row.image ? <img src={row.image} alt={row.name} className="h-14 w-14 rounded-md object-cover" /> : <div className="h-14 w-14 rounded-md bg-slate-100" />,
          },
          { key: 'name', label: 'Tên', render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
          { key: 'category', label: 'Danh mục', render: (row) => row.category?.name ?? '-' },
          { key: 'cost_price', label: 'Giá vốn', render: (row) => formatCurrency(row.cost_price ?? 0) },
          { key: 'price', label: 'Giá', render: (row) => formatCurrency(row.final_price) },
          { key: 'stock', label: 'Tồn kho', render: (row) => <StockBadge stock={row.stock} /> },
          {
            key: 'actions',
            label: '',
            className: 'text-right',
            render: (row) => (
              <div className="flex justify-end gap-2">
                <Link to={`/admin/products/${row.id}/edit`} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-950">
                  <Edit className="h-4 w-4" />
                </Link>
                <button onClick={() => setDeleting(row)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      <div className="flex justify-end gap-2">
        <button disabled={page <= 1 || loading} onClick={() => void loadProducts(page - 1)} className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50">Trước</button>
        <span className="px-3 py-2 text-sm text-slate-600">{page}/{lastPage}</span>
        <button disabled={page >= lastPage || loading} onClick={() => void loadProducts(page + 1)} className="rounded-md border border-slate-200 px-3 py-2 text-sm disabled:opacity-50">Sau</button>
      </div>

      <ConfirmDialog open={!!deleting} title="Xóa sản phẩm" message={`Xóa sản phẩm "${deleting?.name ?? ''}"?`} danger loading={saving} onCancel={() => setDeleting(null)} onConfirm={deleteProduct} />
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Hết hàng</span>;
  if (stock < 5) return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">Sắp hết ({stock})</span>;
  return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{stock}</span>;
}
