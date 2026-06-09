import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ProductCard from '@/components/ui/ProductCard';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import type { Category } from '@/types/category';
import type { Product } from '@/types/product';

const SORT_OPTIONS = [
  { label: 'Mới nhất',      value: 'created_at:desc' },
  { label: 'Bán chạy nhất', value: 'sold_count:desc' },   // Issue 3 ✅
  { label: 'Giá tăng dần',  value: 'price:asc' },
  { label: 'Giá giảm dần',  value: 'price:desc' },
  { label: 'Tên A → Z',     value: 'name:asc' },
];

export default function ProductsPage() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [featured, setFeatured]         = useState<Product[]>([]);  // Issue 1 ✅
  const [categories, setCategories]     = useState<Category[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  // Filters
  const [search, setSearch]             = useState('');
  const [categoryId, setCategoryId]     = useState<number | undefined>();
  const [sort, setSort]                 = useState('created_at:desc');

  // Pagination — Issue 2 ✅
  const [currentPage, setCurrentPage]   = useState(1);
  const [lastPage, setLastPage]         = useState(1);
  const [total, setTotal]               = useState(0);

  const PER_PAGE = 12;  // BR-03

  // Load categories once
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  // Load featured products once (for empty-state suggestion)
  useEffect(() => {
    productService.getFeaturedProducts(4).then(setFeatured).catch(() => {});
  }, []);

  // Load products when filters or page change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const [sort_by, sort_dir] = sort.split(':') as [string, 'asc' | 'desc'];

    productService
      .getProducts({
        search: search || undefined,
        category_id: categoryId,
        sort_by: sort_by as any,
        sort_dir,
        per_page: PER_PAGE,
        page: currentPage,
      })
      .then(({ data, meta }) => {
        if (cancelled) return;
        setProducts(data);
        setLastPage(meta.pagination.last_page);
        setTotal(meta.pagination.total);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [search, categoryId, sort, currentPage]);

  // Reset về trang 1 khi thay đổi filter — BR-03
  const handleSearch     = (val: string)  => { setSearch(val);     setCurrentPage(1); };
  const handleCategory   = (id?: number)  => { setCategoryId(id);  setCurrentPage(1); };
  const handleSort       = (val: string)  => { setSort(val);       setCurrentPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Page header */}
      <div className="mb-10">
        <span className="font-sans uppercase tracking-widest text-primary text-sm mb-2 block">Bộ sưu tập</span>
        <h1 className="text-4xl font-serif text-on-surface">Tất cả sản phẩm</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-60 flex-shrink-0 space-y-8">
          {/* Search */}
          <div className="relative">
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 pl-4 pr-10 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="Tìm sản phẩm..."
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Tìm kiếm sản phẩm"
            />
            {search ? (
              <button
                type="button"
                onClick={() => handleSearch('')}
                className="absolute right-3 top-3 text-on-surface-variant hover:text-primary"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute right-3 top-3 w-4 h-4 text-on-surface-variant pointer-events-none" />
            )}
          </div>

          {/* Sort */}
          <div>
            <h2 className="font-serif font-bold mb-4 text-on-surface">Sắp xếp</h2>
            <select
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              aria-label="Sắp xếp sản phẩm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-serif font-bold mb-4 text-on-surface">Danh mục</h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleCategory(undefined)}
                  className={`text-sm w-full text-left py-2 px-3 rounded-lg transition-colors ${
                    !categoryId ? 'bg-primary text-white' : 'hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  Tất cả
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategory(cat.id)}
                    className={`text-sm w-full text-left py-2 px-3 rounded-lg transition-colors flex justify-between ${
                      categoryId === cat.id
                        ? 'bg-primary text-white'
                        : 'hover:bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="opacity-60 text-xs">({cat.products_count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </aside>

        {/* ── Product grid ── */}
        <div className="flex-1 min-h-[50vh]">
          {loading ? (
            <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>
          ) : error ? (
            <div className="text-center py-32">
              <p className="text-red-500 mb-2">{error}</p>
              <p className="text-on-surface-variant text-sm">
                Hãy chắc chắn backend đang chạy tại {import.meta.env.VITE_API_BASE_URL}
              </p>
            </div>
          ) : products.length === 0 ? (
            /* ── Issue 1: Empty state + gợi ý sản phẩm nổi bật ── */
            <div className="py-16">
              <div className="text-center mb-10 text-on-surface-variant">
                <p className="text-lg mb-3">Không tìm thấy sản phẩm nào phù hợp.</p>
                {(search || categoryId) && (
                  <button
                    onClick={() => { handleSearch(''); handleCategory(undefined); }}
                    className="text-primary hover:underline text-sm"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>

              {featured.length > 0 && (
                <div>
                  <p className="text-sm font-serif font-bold text-on-surface mb-5">
                    Sản phẩm nổi bật gợi ý cho bạn
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {featured.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-on-surface-variant mb-6">
                {total} sản phẩm — Trang {currentPage}/{lastPage}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* ── Issue 2: Pagination UI ── */}
              {lastPage > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-outline-variant disabled:opacity-30 hover:bg-surface-container transition-colors"
                    aria-label="Trang trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: lastPage }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === lastPage || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-on-surface-variant">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === p
                              ? 'bg-primary text-white'
                              : 'border border-outline-variant hover:bg-surface-container text-on-surface'
                          }`}
                          aria-label={`Trang ${p}`}
                          aria-current={currentPage === p ? 'page' : undefined}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(lastPage, p + 1))}
                    disabled={currentPage === lastPage}
                    className="p-2 rounded-lg border border-outline-variant disabled:opacity-30 hover:bg-surface-container transition-colors"
                    aria-label="Trang sau"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
