// ===== src/app/[locale]/dashboard/revenue/page.tsx =====
"use client";

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ScriptableContext,
  TooltipItem,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Định nghĩa Interface cho dữ liệu doanh thu
interface RevenueItem {
    name: string;
    value: number;
}

const revenueDataWeek: RevenueItem[] = [{"name":"06/07","value":22000000},{"name":"07/07","value":19000000},{"name":"08/07","value":21000000},{"name":"09/07","value":18000000},{"name":"10/07","value":24000000},{"name":"11/07","value":25000000},{"name":"12/07","value":23000000}];
const revenueDataMonth: RevenueItem[] = [{"name":"Week 1","value":80000000},{"name":"Week 2","value":95000000},{"name":"Week 3","value":78000000},{"name":"Week 4","value":110000000}];
const revenueDataYear: RevenueItem[] = [{"name":"Jan","value":400000000},{"name":"Feb","value":420000000},{"name":"Mar","value":380000000},{"name":"Apr","value":450000000},{"name":"May","value":430000000},{"name":"Jun","value":480000000},{"name":"Jul","value":500000000},{"name":"Aug","value":490000000},{"name":"Sep","value":520000000},{"name":"Oct","value":550000000},{"name":"Nov","value":530000000},{"name":"Dec","value":580000000}];

type TimeFilter = 'week' | 'month' | 'year';

// Thay thế any[] bằng RevenueItem[]
const dataMap: Record<TimeFilter, RevenueItem[]> = {
  week: revenueDataWeek,
  month: revenueDataMonth,
  year: revenueDataYear,
};

// Chỉ định kiểu trả về là ChartData<'line'>
const getChartData = (filter: TimeFilter): ChartData<'line'> => {
  const data = dataMap[filter];
  const labels = data.map(d => d.name);
  return {
    labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map(d => d.value),
        borderColor: '#1e3a8a',
        borderWidth: 3,
        pointRadius: 0,
        tension: 0.4,
        fill: true,
        // Sử dụng ScriptableContext<"line">
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          if (!ctx) return 'rgba(59, 130, 246, 0)';
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          return gradient;
        },
      },
    ],
  };
};

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        // Sử dụng TooltipItem<'line'>
        label: function(context: TooltipItem<'line'>) {
          if (context.parsed.y !== null && typeof context.parsed.y === 'number') {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
          }
          return '';
        }
      }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: function(value) {
          if (typeof value === 'number') {
            return `${value / 1000000}M`;
          }
          return value;
        }
      }
    },
    x: { grid: { display: false } }
  },
};

export default function RevenuePage() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
    const filters: {key: TimeFilter, label: string}[] = [
        {key: 'week', label: 'TUẦN'},
        {key: 'month', label: 'THÁNG'},
        {key: 'year', label: 'NĂM'}
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Doanh thu</h1>
             <div className="flex justify-start gap-2">
                 {filters.map(filter => (
                     <button 
                       key={filter.key}
                       onClick={() => setTimeFilter(filter.key)}
                       className={`w-24 h-11 rounded-md text-base font-semibold font-['Unbounded'] transition-colors ${
                         timeFilter === filter.key 
                           ? "bg-blue-900 text-neutral-100" 
                           : "bg-white text-neutral-950 hover:bg-gray-100"
                       }`}
                     >
                       {filter.label}
                     </button>
                 ))}
             </div>
             <div className="w-full bg-white rounded-2xl p-8">
                 <div style={{ position: 'relative', height: '400px' }}>
                    <Line options={chartOptions} data={getChartData(timeFilter)} />
                 </div>
             </div>
        </div>
    );
}