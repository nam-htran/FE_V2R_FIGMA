// ===== .\src\app\[locale]\dashboard\reports\page.tsx =====
"use client";

// SỬA ĐỔI: Import Line component từ react-chartjs-2
import { Line } from 'react-chartjs-2';
// SỬA ĐỔI: Import các thành phần cần thiết từ chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Cần Filler để tô màu vùng dưới đường line
} from 'chart.js';

// Đăng ký các thành phần với ChartJS
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

// --- DỮ LIỆU GỐC (Không đổi) ---
const costData = [
  { name: '06/07', gpu: 18000, backend: 22000 },
  { name: '07/07', gpu: 16000, backend: 21000 },
  { name: '08/07', gpu: 17000, backend: 23000 },
  { name: '09/07', gpu: 15000, backend: 20000 },
  { name: '10/07', gpu: 19000, backend: 24000 },
  { name: '11/07', gpu: 20000, backend: 25000 },
  { name: '12/07', gpu: 18500, backend: 23500 },
];

// --- CẤU HÌNH BIỂU ĐỒ CHO CHART.JS ---

const labels = costData.map(d => d.name);

const chartData = {
  labels,
  datasets: [
    {
      label: 'GPU',
      data: costData.map(d => d.gpu),
      borderColor: '#818cf8',
      backgroundColor: '#a5b4fc',
      fill: true, // Bật tô màu vùng
      tension: 0.4, // Làm cho đường cong mượt hơn
    },
    {
      label: 'Backend',
      data: costData.map(d => d.backend),
      borderColor: '#312e81',
      backgroundColor: '#4338ca',
      fill: true, // Bật tô màu vùng
      tension: 0.4,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // Ẩn legend mặc định để dùng legend tùy chỉnh bên ngoài
    },
    tooltip: {
      callbacks: {
        // Tùy chỉnh tooltip để hiển thị dạng '...K'
        label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
                label += ': ';
            }
            if (context.parsed.y !== null) {
                label += `${context.parsed.y / 1000}K`;
            }
            return label;
        }
      }
    }
  },
  scales: {
    y: {
      stacked: true, // Bật chế độ xếp chồng
      ticks: {
        // Tùy chỉnh các nhãn trên trục Y
        callback: function(value: any) {
          return `${value / 1000}K`;
        }
      }
    },
    x: {
        grid: {
            display: false, // Ẩn đường kẻ dọc
        }
    }
  },
};

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Báo cáo & Chi phí</h1>
             <div className="flex justify-start gap-2">
                 <button className="w-24 h-11 bg-blue-900 rounded-md text-neutral-100 text-base font-semibold font-['Unbounded']">TUẦN</button>
                 <button className="w-24 h-11 bg-white rounded-md text-neutral-950 text-base font-semibold font-['Unbounded']">THÁNG</button>
                 <button className="w-24 h-11 bg-white rounded-md text-neutral-950 text-base font-semibold font-['Unbounded']">NĂM</button>
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
                 {/* SỬA ĐỔI: Sử dụng Line component và container có chiều cao cố định */}
                 <div style={{ position: 'relative', height: '400px' }}>
                    <Line options={chartOptions} data={chartData} />
                 </div>
             </div>
        </div>
    );
}