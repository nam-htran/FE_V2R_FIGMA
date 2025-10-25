// ===== .\src\components\dashboard\Overview.tsx =====
"use client";

// SỬA ĐỔI: Import component Bar và Doughnut từ react-chartjs-2
import { Bar, Doughnut } from 'react-chartjs-2';
// SỬA ĐỔI: Import các thành phần cần thiết từ chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// SỬA ĐỔI: Đăng ký các thành phần với ChartJS. Đây là bước bắt buộc!
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// --- DỮ LIỆU GỐC (Không đổi) ---
const originalUserChartData = [
  { name: "06/07", free: 300, basic: 400, pro: 200, enterprise: 100 },
  { name: "07/07", free: 350, basic: 410, pro: 220, enterprise: 110 },
  { name: "08/07", free: 320, basic: 420, pro: 210, enterprise: 120 },
  { name: "09/07", free: 380, basic: 430, pro: 230, enterprise: 130 },
  { name: "10/07", free: 360, basic: 440, pro: 240, enterprise: 140 },
  { name: "11/07", free: 390, basic: 450, pro: 250, enterprise: 150 },
  { name: "12/07", free: 400, basic: 460, pro: 260, enterprise: 160 },
];

const originalRevenueChartData = [
    { name: 'Spring 2025', basic: 64, pro: 38, enterprise: 25 },
    { name: 'Summer 2025', basic: 70, pro: 42, enterprise: 28 },
    { name: 'Fall 2025', basic: 80, pro: 45, enterprise: 30 },
    { name: 'Winter 2025', basic: 90, pro: 50, enterprise: 35 },
];

const originalUserDistributionData = [
  { name: "Người dùng miễn phí", value: 56 },
  { name: "Người dùng trả phí", value: 44 },
];

// --- CẤU HÌNH BIỂU ĐỒ CHO CHART.JS ---

// Cấu hình chung
const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Rất quan trọng để biểu đồ lấp đầy container
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

// 1. Dữ liệu và tùy chọn cho Biểu đồ người dùng (User Chart - Stacked Bar)
const userChartLabels = originalUserChartData.map(d => d.name);
const userChartData = {
  labels: userChartLabels,
  datasets: [
    { label: 'Free', data: originalUserChartData.map(d => d.free), backgroundColor: '#A5B4FC' },
    { label: 'Basic', data: originalUserChartData.map(d => d.basic), backgroundColor: '#6366F1' },
    { label: 'Pro', data: originalUserChartData.map(d => d.pro), backgroundColor: '#4338CA' },
    { label: 'Enterprise', data: originalUserChartData.map(d => d.enterprise), backgroundColor: '#1E3A8A' },
  ],
};
const userChartOptions = {
  ...commonChartOptions,
  scales: {
    x: { stacked: true }, // Bật chế độ xếp chồng cho trục X
    y: { stacked: true }, // Bật chế độ xếp chồng cho trục Y
  },
};

// 2. Dữ liệu và tùy chọn cho Phân bổ người dùng (User Distribution - Doughnut)
const userDistributionData = {
  labels: originalUserDistributionData.map(d => d.name),
  datasets: [
    {
      label: 'Phân bổ người dùng',
      data: originalUserDistributionData.map(d => d.value),
      backgroundColor: ['#A5B4FC', '#1E3A8A'], // Màu tương ứng với labels
      borderColor: ['#FFFFFF'],
      borderWidth: 2,
    },
  ],
};
const userDistributionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const, // Di chuyển chú thích xuống dưới cho đẹp hơn
    },
  },
};

// 3. Dữ liệu và tùy chọn cho Doanh thu theo gói (Revenue Chart - Bar)
const revenueChartLabels = originalRevenueChartData.map(d => d.name);
const revenueChartData = {
  labels: revenueChartLabels,
  datasets: [
    { label: 'Basic', data: originalRevenueChartData.map(d => d.basic), backgroundColor: '#C7D2FE' },
    { label: 'Pro', data: originalRevenueChartData.map(d => d.pro), backgroundColor: '#A5B4FC' },
    { label: 'Enterprise', data: originalRevenueChartData.map(d => d.enterprise), backgroundColor: '#312E81' },
  ],
};

// --- COMPONENT CHÍNH ---
export default function Overview() {
  return (
    <div className="space-y-8">
      <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">
        Tổng quan
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard title="Tất cả người dùng" value="476" />
        <StatCard
          title="Người dùng trả phí"
          value="127"
          subtitle="64 Basic, 38 Pro, 25 Enterprise"
        />
        <StatCard title="Tổng doanh thu" value="21,402$" />
      </div>

      <ChartContainer title="Biểu đồ người dùng" filterOptions={["Tuần", "Tháng", "Năm"]}>
        {/* SỬA ĐỔI: Sử dụng component Bar của Chart.js */}
        <div style={{ position: 'relative', height: '350px' }}>
            <Bar options={userChartOptions} data={userChartData} />
        </div>
      </ChartContainer>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="Phân bổ người dùng">
            {/* SỬA ĐỔI: Sử dụng component Doughnut của Chart.js */}
            <div style={{ position: 'relative', height: '300px' }}>
                <Doughnut data={userDistributionData} options={userDistributionOptions} />
            </div>
        </ChartContainer>

        <ChartContainer title="Doanh thu theo gói" filterOptions={["Tuần", "Tháng", "Quý", "Năm"]}>
            {/* SỬA ĐỔI: Sử dụng component Bar của Chart.js */}
            <div style={{ position: 'relative', height: '350px' }}>
                <Bar options={commonChartOptions} data={revenueChartData} />
            </div>
        </ChartContainer>
      </div>
    </div>
  );
}

// --- CÁC COMPONENT PHỤ (Không đổi) ---
function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string; }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="bg-blue-900 text-white text-xl font-semibold font-['Unbounded'] p-3 rounded-xl -mt-10 mx-auto w-max">
        {title}
      </div>
      <p className="text-4xl font-black font-['Unbounded'] text-center mt-4">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm font-medium text-center mt-2">{subtitle}</p>
      )}
    </div>
  );
}

function ChartContainer({ title, children, filterOptions }: { title: string; children: React.ReactNode; filterOptions?: string[]; }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {filterOptions && (
          <div className="flex gap-x-2">
            {filterOptions.map((option, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md text-base font-semibold ${
                  index === 0
                    ? "bg-blue-900 text-white"
                    : "bg-white text-neutral-950"
                }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}