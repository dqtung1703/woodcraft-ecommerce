import type { TopProduct } from '@/types/admin';
import { formatCurrency } from '@/utils/formatCurrency';

type TopProductsTableProps = {
  products: TopProduct[];
  loading?: boolean;
};

const rankClasses = [
  'bg-amber-100 text-amber-700',
  'bg-slate-200 text-slate-700',
  'bg-orange-100 text-orange-700',
  'bg-slate-100 text-slate-600',
  'bg-slate-100 text-slate-600',
];

export default function TopProductsTable({ products, loading = false }: TopProductsTableProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-slate-950">Top sản phẩm bán chạy</h2>
        <p className="mt-1 text-sm text-slate-500">Xếp hạng theo doanh thu đơn đã giao</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-md border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-16 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hạng
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sản phẩm
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Đã bán
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-4">
                    <div className="h-6 w-8 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-44 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="ml-auto h-4 w-12 animate-pulse rounded bg-slate-200" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="ml-auto h-4 w-24 animate-pulse rounded bg-slate-200" />
                  </td>
                </tr>
              ))
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${rankClasses[index] ?? rankClasses[4]}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">{product.name}</td>
                  <td className="px-4 py-4 text-right text-slate-600">{product.total_sold}</td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(product.total_revenue)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                  Chưa có dữ liệu sản phẩm bán chạy
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
