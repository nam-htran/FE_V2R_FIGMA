// ===== .\src\app\[locale]\dashboard\revenue\page.tsx =====
"use client";

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
  TooltipItem // SỬA LỖI: Import kiểu TooltipItem để sử dụng
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

const revenueData = [
  { name: '06/07', value: 22000 }, { name: '07/07', value: 19000 },
  { name: '08/07', value: 21000 }, { name: '09/07', value: 18000 },
  { name: '10/07', value: 24000 }, { name: '11/07', value: 25000 },
  { name: '12/07', value: 23000 },
];

const labels = revenueData.map(d => d.name);

const chartData = {
  labels,
  datasets: [
    {
      label: 'Doanh thu',
      data: revenueData.map(d => d.value),
      borderColor: '#1e3a8a',
      borderWidth: 3,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
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

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        // SỬA LỖI: Thêm bước kiểm tra giá trị null
        label: function(context: TooltipItem<'line'>) {
          // Chỉ định dạng label nếu giá trị y tồn tại và là một con số
          if (context.parsed.y !== null && typeof context.parsed.y === 'number') {
            return `$${context.parsed.y.toLocaleString()}`;
          }
          // Nếu không, trả về một chuỗi rỗng để tránh lỗi
          return '';
        }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 25000,
      ticks: {
        callback: function(value) {
          return `${Number(value) / 1000}K`;
        }
      }
    },
    x: {
        grid: {
            display: false,
        }
    }
  },
};

export default function RevenuePage() {
    return (
        <div className="space-y-8">
            <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Doanh thu</h1>
             <div className="flex justify-start gap-2">
                 <button className="w-24 h-11 bg-blue-900 rounded-md text-neutral-100 text-base font-semibold font-['Unbounded']">TUẦN</button>
                 <button className="w-24 h-11 bg-white rounded-md text-neutral-950 text-base font-semibold font-['Unbounded']">THÁNG</button>
                 <button className="w-24 h-11 bg-white rounded-md text-neutral-950 text-base font-semibold font-['Unbounded']">NĂM</button>
             </div>
             <div className="w-full bg-white rounded-2xl p-8">
                 <div style={{ position: 'relative', height: '400px' }}>
                    <Line options={chartOptions} data={chartData} />
                 </div>
             </div>
        </div>
    );
}