import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartDataPoint } from '@/types/admin';
import { formatCurrency } from '@/utils/formatCurrency';

type RevenueChartProps = {
  data: ChartDataPoint[];
  days: number;
  onDaysChange: (days: number) => void;
};

const periodOptions = [7, 30, 90];

function formatDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  }).format(date);
}

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return String(value);
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  const revenue = payload.find((item: any) => item.dataKey === 'revenue')?.value ?? 0;
  const orders = payload.find((item: any) => item.dataKey === 'orders')?.value ?? 0;

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-900">{formatDate(label)}</p>
      <p className="mt-1 text-emerald-600">Doanh thu: {formatCurrency(Number(revenue))}</p>
      <p className="text-amber-600">Đơn hàng: {Number(orders)}</p>
    </div>
  );
}

export default function RevenueChart({ data, days, onDaysChange }: RevenueChartProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Doanh thu và đơn hàng</h2>
          <p className="mt-1 text-sm text-slate-500">Thống kê theo ngày trong {days} ngày gần nhất</p>
        </div>
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
          {periodOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onDaysChange(option)}
              className={`rounded px-3 py-1.5 text-sm font-medium transition ${
                days === option
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-slate-950'
              }`}
            >
              {option} ngày
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              yAxisId="revenue"
              tickFormatter={formatCompactCurrency}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              allowDecimals={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              name="Doanh thu"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Đơn hàng"
              stroke="#d97706"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
