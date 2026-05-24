import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';

export type AdminTableColumn<T> = {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => ReactNode;
};

type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  keyExtractor: (row: T) => string | number;
};

export default function AdminTable<T>({
  columns,
  data,
  loading = false,
  emptyText = 'Không có dữ liệu',
  keyExtractor,
}: AdminTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${column.className ?? ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 w-full max-w-32 animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-slate-50">
                  {columns.map((column) => (
                    <td key={column.key} className={`px-4 py-4 text-slate-700 ${column.className ?? ''}`}>
                      {column.render ? column.render(row) : String((row as any)[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center text-slate-500">
                    <Inbox className="h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium">{emptyText}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
