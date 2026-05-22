import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import type { ElementType, ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: ReactNode;
  icon: ElementType;
  growth?: number;
  subtitle?: string;
};

export default function StatCard({ title, value, icon: Icon, growth, subtitle }: StatCardProps) {
  const GrowthIcon = growth === undefined || growth === 0
    ? Minus
    : growth > 0
      ? TrendingUp
      : TrendingDown;

  const growthClass = growth === undefined || growth === 0
    ? 'text-slate-400'
    : growth > 0
      ? 'text-emerald-600'
      : 'text-red-500';

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 text-2xl font-semibold text-slate-950">{value}</div>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <Icon className="h-5 w-5" />
        </span>
      </div>

      {(growth !== undefined || subtitle) && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          {growth !== undefined && (
            <span className={`inline-flex items-center gap-1 font-semibold ${growthClass}`}>
              <GrowthIcon className="h-4 w-4" />
              {Math.abs(growth).toFixed(1)}%
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </article>
  );
}
