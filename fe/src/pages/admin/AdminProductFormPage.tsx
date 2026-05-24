import { ImagePlus, X } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';
import { adminProductService } from '@/services/adminService';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import type { ProductFormState } from '@/types/admin';
import type { Category } from '@/types/category';

const initialForm: ProductFormState = {
  name: '',
  original_price: '',
  cost_price: '',
  price: '',
  stock: '',
  category_id: '',
  description: '',
  material: '',
  newImageFiles: [],
  keepImageUrls: [],
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [originalImageCount, setOriginalImageCount] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService.getProduct(Number(id))
      .then((product) => {
        setForm({
          name: product.name,
          original_price: String(product.original_price ?? product.price),
          cost_price: String(product.cost_price ?? ''),
          price: String(product.price),
          stock: String(product.stock),
          category_id: product.category ? String(product.category.id) : '',
          description: product.description ?? '',
          material: product.material ?? '',
          newImageFiles: [],
          keepImageUrls: product.images ?? [],
        });
        setOriginalImageCount(product.images?.length ?? 0);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Không tải được sản phẩm'))
      .finally(() => setLoading(false));
  }, [id, toast]);

  const filePreviews = useMemo(
    () => form.newImageFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [form.newImageFiles],
  );

  useEffect(() => () => {
    filePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [filePreviews]);

  const setField = (key: keyof ProductFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (Number(form.price) > Number(form.original_price)) {
      toast.error('Giá bán không được lớn hơn giá gốc');
      return;
    }
    if (form.keepImageUrls.length + form.newImageFiles.length > 5) {
      toast.error('Tổng số ảnh không được vượt quá 5');
      return;
    }

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('original_price', form.original_price);
    fd.append('cost_price', form.cost_price);
    fd.append('price', form.price);
    fd.append('stock', form.stock);
    fd.append('category_id', form.category_id);
    fd.append('description', form.description);
    fd.append('material', form.material);

    if (isEdit) {
      fd.append('_method', 'PUT');
      const hasImageChange = form.newImageFiles.length > 0 || form.keepImageUrls.length !== originalImageCount;
      if (hasImageChange) {
        fd.append('replace_images', '1');
        form.keepImageUrls.forEach((url) => fd.append('keep_images[]', url));
        form.newImageFiles.forEach((file) => fd.append('images[]', file));
      }
    } else {
      form.newImageFiles.forEach((file) => fd.append('images[]', file));
    }

    setSaving(true);
    try {
      if (isEdit && id) {
        await adminProductService.update(Number(id), fd);
        toast.success('Đã cập nhật sản phẩm');
      } else {
        await adminProductService.create(fd);
        toast.success('Đã tạo sản phẩm');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải sản phẩm...</div>;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
          <p className="mt-1 text-sm text-slate-500">Nhập thông tin và ảnh sản phẩm.</p>
        </div>
        <Link to="/admin/products" className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Quay lại</Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên sản phẩm"><input className="admin-input" value={form.name} onChange={(e) => setField('name', e.target.value)} required /></Field>
            <Field label="Danh mục"><select className="admin-input" value={form.category_id} onChange={(e) => setField('category_id', e.target.value)} required><option value="">Chọn danh mục</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
            <Field label="Giá gốc"><input className="admin-input" type="number" min="0" value={form.original_price} onChange={(e) => setField('original_price', e.target.value)} required /></Field>
            <Field label="Giá vốn"><input className="admin-input" type="number" min="0" value={form.cost_price} onChange={(e) => setField('cost_price', e.target.value)} required /></Field>
            <Field label="Giá bán"><input className="admin-input" type="number" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} required /></Field>
            <Field label="Tồn kho"><input className="admin-input" type="number" min="0" value={form.stock} onChange={(e) => setField('stock', e.target.value)} required /></Field>
            <Field label="Chất liệu"><input className="admin-input" value={form.material} onChange={(e) => setField('material', e.target.value)} /></Field>
            <div className="sm:col-span-2"><Field label="Mô tả"><textarea className="admin-input min-h-32" value={form.description} onChange={(e) => setField('description', e.target.value)} /></Field></div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-950">Ảnh sản phẩm</h3>
          <p className="mt-1 text-xs text-slate-500">Tối đa 5 ảnh.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {form.keepImageUrls.map((url) => (
              <Thumb key={url} src={url} onRemove={() => setForm((current) => ({ ...current, keepImageUrls: current.keepImageUrls.filter((item) => item !== url) }))} />
            ))}
            {filePreviews.map((preview, index) => (
              <Thumb key={`${preview.file.name}-${index}`} src={preview.url} onRemove={() => setForm((current) => ({ ...current, newImageFiles: current.newImageFiles.filter((_, i) => i !== index) }))} />
            ))}
            {form.keepImageUrls.length + form.newImageFiles.length < 5 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50">
                <ImagePlus className="h-6 w-6" />
                <span className="mt-2 text-xs font-medium">Thêm ảnh</span>
                <input type="file" accept="image/*" multiple hidden onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  setForm((current) => ({ ...current, newImageFiles: [...current.newImageFiles, ...files].slice(0, 5 - current.keepImageUrls.length) }));
                }} />
              </label>
            )}
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button disabled={saving} className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60">
          {saving ? 'Đang lưu...' : 'Lưu sản phẩm'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="text-sm font-medium text-slate-700">{label}</span><div className="mt-1">{children}</div></label>;
}

function Thumb({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-md border border-slate-200">
      <img src={src} alt="" className="h-full w-full object-cover" />
      <button type="button" onClick={onRemove} className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-red-600 shadow">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
