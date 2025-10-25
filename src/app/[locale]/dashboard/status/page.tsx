// ===== .\src\app\[locale]\dashboard\status\page.tsx =====
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
  Filler,
  Tooltip,
  ScriptableContext
} from 'chart.js';

// Đăng ký các thành phần với ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

// --- DỮ LIỆU GỐC (Không đổi) ---
// Tạo dữ liệu ngẫu nhiên để mô phỏng việc sử dụng tài nguyên
const usageData = Array.from({ length: 60 }, (_, i) => ({
  name: i + 1,
  uv: Math.random() * 80 + 10, // Giá trị ngẫu nhiên từ 10 đến 90
}));

// --- COMPONENT BIỂU ĐỒ CON ĐÃ CHUYỂN ĐỔI ---
const ResourceChart = ({ title, unit, max, data }: { title: string; unit: string; max: string; data: any[];}) => {
  
  // Cấu hình dữ liệu cho Chart.js
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Usage',
        data: data.map(d => d.uv),
        borderColor: '#1e3a8a',
        borderWidth: 3,
        pointRadius: 0, // Ẩn các điểm chấm trên đường line
        tension: 0.4,   // Làm mượt đường cong
        fill: true,     // Bật tô màu vùng
        // Tạo hiệu ứng gradient cho màu nền
        backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            if (!ctx) return 'rgba(59, 130, 246, 0)';
            const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            return gradient;
        },
      },
    ],
  };

  // Cấu hình tùy chọn cho Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ẩn chú thích
      },
      tooltip: {
        enabled: false, // Tắt tooltip
      },
    },
    scales: {
      y: {
        display: false, // Ẩn trục Y
        min: 0,
        max: 100, // Giữ giới hạn từ 0-100%
      },
      x: {
        display: false, // Ẩn trục X
      }
    },
  };

  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden p-8">
      <h2 className="text-black text-4xl font-bold font-['Unbounded']">{title}</h2>
      <div className="flex justify-between text-neutral-800 text-base font-normal mt-10">
        <span>{unit}</span>
        <span>{max}</span>
      </div>
      {/* SỬA ĐỔI: Sử dụng Line component và container có chiều cao cố định */}
      <div style={{ position: 'relative', height: '350px' }}>
        <Line options={chartOptions} data={chartData} />
      </div>
      <div className="flex justify-between text-neutral-800 text-base font-normal">
          <span>60 giây</span>
          <span>0%</span>
      </div>
    </div>
  );
};


// --- COMPONENT CHÍNH ---
export default function StatusPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">Trạng thái & Tài nguyên</h1>
      <ResourceChart title="CPU" unit="% Sử dụng" max="100%" data={usageData} />
      <ResourceChart title="CPU của GPU" unit="% Sử dụng" max="100%" data={usageData} />
      <ResourceChart title="RAM của GPU (VRAM)" unit="Bộ nhớ đã dùng" max="15.4 GB" data={usageData} />
    </div>
  );
}