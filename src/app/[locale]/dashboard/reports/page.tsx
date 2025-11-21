// ===== src/app/[locale]/dashboard/reports/page.tsx =====
"use client";

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartData, ChartOptions, TooltipItem } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Định nghĩa Interface cho dữ liệu chi phí
interface CostItem {
    name: string;
    gpu: number;
    backend: number;
}

const costDataWeek: CostItem[] = [{"name":"06/07","gpu":18000,"backend":22000},{"name":"07/07","gpu":16000,"backend":21000},{"name":"08/07","gpu":17000,"backend":23000},{"name":"09/07","gpu":15000,"backend":20000},{"name":"10/07","gpu":19000,"backend":24000},{"name":"11/07","gpu":20000,"backend":25000},{"name":"12/07","gpu":18500,"backend":23500}];
const costDataMonth: CostItem[] = [{"name":"Week 1","gpu":120000,"backend":150000},{"name":"Week 2","gpu":125000,"backend":155000},{"name":"Week 3","gpu":110000,"backend":140000},{"name":"Week 4","gpu":130000,"backend":165000}];
const costDataYear: CostItem[] = [{"name":"Jan","gpu":500000,"backend":600000},{"name":"Feb","gpu":520000,"backend":620000},{"name":"Mar","gpu":480000,"backend":580000},{"name":"Apr","gpu":550000,"backend":650000},{"name":"May","gpu":530000,"backend":630000},{"name":"Jun","gpu":580000,"backend":680000},{"name":"Jul","gpu":600000,"backend":700000},{"name":"Aug","gpu":590000,"backend":690000},{"name":"Sep","gpu":620000,"backend":720000},{"name":"Oct","gpu":650000,"backend":750000},{"name":"Nov","gpu":630000,"backend":730000},{"name":"Dec","gpu":680000,"backend":780000}];

type TimeFilter = 'week' | 'month' | 'year';

// Thay thế any[] bằng CostItem[]
const dataMap: Record<TimeFilter, CostItem[]> = {
  week: costDataWeek,
  month: costDataMonth,
  year: costDataYear,
};

// Trả về ChartData<'line'>
const getChartData = (filter: TimeFilter): ChartData<'line'> => {
  const data = dataMap[filter];
  const labels = data.map(d => d.name);
  return {
    labels,
    datasets: [
      { label: 'GPU', data: data.map(d => d.gpu), borderColor: '#818cf8', backgroundColor: '#a5b4fc', fill: true, tension: 0.4 },
      { label: 'Backend', data: data.map(d => d.backend), borderColor: '#312e81', backgroundColor: '#4338ca', fill: true, tension: 0.4 },
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
        // Sử dụng TooltipItem<'line'> thay vì any
        label: function(context: TooltipItem<'line'>) {
            let label = context.dataset.label || '';
            if (label) { label += ': '; }
            if (context.parsed.y !== null && typeof context.parsed.y === 'number') { 
                label += `${(context.parsed.y / 1000).toLocaleString()}K`; 
            }
            return label;
        }
      }
    }
  },
  scales: {
    y: { 
        stacked: true, 
        ticks: { 
            callback: function(value) { 
                return `${Number(value) / 1000}K`; 
            } 
        } 
    },
    x: { grid: { display: false } }
  },
};

export default function ReportsPage() {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
    
    const filters: {key: TimeFilter, label: string}[] = [
        {key: 'week', label: 'TUẦN'},
        {key: 'month', label: 'THÁNG'},
        {key: 'year', label: 'NĂM'}
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Báo cáo & Chi phí</h1>
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
                  <div className="flex justify-start items-center gap-x-6 mb-4">
                       <div className="flex items-center gap-x-2">
                           <div className="w-8 h-6 bg-indigo-300 rounded" />
                           <span className="text-neutral-950 text-xs font-semibold font-['Unbounded']">GPU</span>
                       </div>
                       <div className="flex items-center gap-x-2">
                           <div className="w-8 h-6 bg-blue-900 rounded" />
                           <span className="text-neutral-950 text-xs font-semibold font-['Unbounded']">Backend</span>
                       </div>
                  </div>
                 <div style={{ position: 'relative', height: '400px' }}>
                    <Line options={chartOptions} data={getChartData(timeFilter)} />
                 </div>
             </div>
        </div>
    );
}