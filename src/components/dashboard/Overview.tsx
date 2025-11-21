// ===== src/components/dashboard/Overview.tsx =====
"use client";

import { useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { orderService } from '@/services/api/order';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { useTranslations } from 'next-intl';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Định nghĩa Interface cho dữ liệu biểu đồ
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface UserChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Dữ liệu mẫu với type rõ ràng
const userChartDataWeek: UserChartData = {"labels":["06/07","07/07","08/07","09/07","10/07","11/07","12/07"],"datasets":[{"label":"Free","data":[300,350,320,380,360,390,400],"backgroundColor":"#A5B4FC"},{"label":"Basic","data":[400,410,420,430,440,450,460],"backgroundColor":"#6366F1"},{"label":"Pro","data":[200,220,210,230,240,250,260],"backgroundColor":"#4338CA"},{"label":"Enterprise","data":[100,110,120,130,140,150,160],"backgroundColor":"#1E3A8A"}]};
const userChartDataMonth: UserChartData = {"labels":["Week 1","Week 2","Week 3","Week 4"],"datasets":[{"label":"Free","data":[1200,1350,1280,1520],"backgroundColor":"#A5B4FC"},{"label":"Basic","data":[1600,1640,1680,1720],"backgroundColor":"#6366F1"},{"label":"Pro","data":[800,880,840,920],"backgroundColor":"#4338CA"},{"label":"Enterprise","data":[400,440,480,520],"backgroundColor":"#1E3A8A"}]};
const userChartDataYear: UserChartData = {"labels":["Jan","Feb","Mar","Apr","May","Jun"],"datasets":[{"label":"Free","data":[5000,5200,4800,5500,5300,5800],"backgroundColor":"#A5B4FC"},{"label":"Basic","data":[6000,6200,5800,6500,6300,6800],"backgroundColor":"#6366F1"},{"label":"Pro","data":[3000,3100,2900,3200,3150,3400],"backgroundColor":"#4338CA"},{"label":"Enterprise","data":[1500,1600,1400,1700,1650,1800],"backgroundColor":"#1E3A8A"}]};

type TimeFilter = 'week' | 'month' | 'year';

// Thay thế any bằng UserChartData
const dataMap: Record<TimeFilter, UserChartData> = {
  week: userChartDataWeek,
  month: userChartDataMonth,
  year: userChartDataYear,
};
const userChartOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' as const } }, scales: { x: { stacked: true }, y: { stacked: true } }};

interface SystemStats {
    cpu_percent: number;
    ram_percent: number;
    gpu: {
        name: string;
        utilization_percent: number;
        memory: { total_mb: number; used_mb: number; free_mb: number; };
    };
}

export default function Overview() {
  const t = useTranslations('Dashboard');
  const tSys = useTranslations('System');
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [paidUsers, setPaidUsers] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [usersResponse, subsResponse, revenue] = await Promise.all([
          api.user.getUsersList(0, 1).catch(() => null),
          api.subscription.getAllUserSubscriptions(0, 10000).catch(() => null),
          orderService.getTotalPriceByStatus(2).catch(() => null)
        ]);
        
        if(usersResponse) setTotalUsers(usersResponse.totalElements);
        // Fix lỗi any ở subsResponse: dùng unknown và ép kiểu an toàn hơn hoặc dùng interface UserSubscription
        if(subsResponse && Array.isArray(subsResponse.content)) {
             setPaidUsers(subsResponse.content.filter((sub: { active: boolean }) => sub.active).length);
        }
        if(revenue !== null) setTotalRevenue(revenue);
        
        try {
          const backendUrlRes = await fetch('/api/get-backend-url');
          if (backendUrlRes.ok) {
            const { url: backendUrl } = await backendUrlRes.json();
            const statsRes = await fetch(`${backendUrl}/system/stats`, {
              headers: {
                'ngrok-skip-browser-warning': 'true',
              },
            });
            if (statsRes.ok) {
              const statsData = await statsRes.json();
              setSystemStats(statsData);
            }
          }
        } catch (e: unknown) { // Sử dụng unknown thay vì any
             if (e instanceof Error) {
                console.error('Error fetching system stats:', e.message);
             }
        }

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  const filters: {key: TimeFilter, label: string}[] = [
      {key: 'week', label: 'Tuần'},
      {key: 'month', label: 'Tháng'},
      {key: 'year', label: 'Năm'}
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-blue-900 text-4xl font-bold font-['Unbounded']">
        {t('overview')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard title="Tất cả người dùng" value={isLoading ? "..." : String(totalUsers ?? 'N/A')} />
        <StatCard title="Người dùng trả phí" value={isLoading ? "..." : String(paidUsers ?? 'N/A')} />
        <StatCard title="Tổng doanh thu" value={isLoading ? "..." : totalRevenue !== null ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue) : 'N/A'} />
      </div>

      {systemStats ? (
         <div className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-xl font-bold mb-4">{t('aiResourceStatus')}</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ResourceStatCard title={tSys('cpu')} value={systemStats.cpu_percent} unit="%" />
                <ResourceStatCard title={tSys('ram')} value={systemStats.ram_percent} unit="%" />
                <ResourceStatCard title={tSys('gpu')} value={systemStats.gpu.utilization_percent} unit="%" subtitle={systemStats.gpu.name} />
                <ResourceStatCard title={tSys('vram')} value={(systemStats.gpu.memory.used_mb / systemStats.gpu.memory.total_mb) * 100} unit="%" subtitle={`${(systemStats.gpu.memory.used_mb / 1024).toFixed(1)} / ${(systemStats.gpu.memory.total_mb / 1024).toFixed(1)} GB`}/>
             </div>
         </div>
      ) : (
          !isLoading && <p className="text-center text-gray-500">{t('cannotLoadResource')}</p>
      )}

      <ChartContainer 
        title="Biểu đồ người dùng" 
        filterOptions={filters}
        activeFilter={timeFilter}
        onFilterChange={setTimeFilter}
      >
        <div style={{ position: 'relative', height: '350px' }}>
            <Bar options={userChartOptions} data={dataMap[timeFilter]} />
        </div>
      </ChartContainer>
    </div>
  );
}
// ... (Phần dưới của file Overview giữ nguyên StatCard và ChartContainer)
// Cần phải giữ lại StatCard và ChartContainer ở cuối file
function StatCard({ title, value }: { title: string; value: string; }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="bg-blue-900 text-white text-xl font-semibold font-['Unbounded'] p-3 rounded-xl -mt-10 mx-auto w-max">
        {title}
      </div>
      <p className="text-4xl font-black font-['Unbounded'] text-center mt-4">
        {value}
      </p>
    </div>
  );
}

function ChartContainer({ title, children, filterOptions, activeFilter, onFilterChange }: { title: string; children: ReactNode; filterOptions?: {key: TimeFilter, label: string}[]; activeFilter?: TimeFilter; onFilterChange?: (filter: TimeFilter) => void; }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {filterOptions && onFilterChange && (
          <div className="flex gap-x-2">
            {filterOptions.map(option => (
              <button 
                key={option.key} 
                onClick={() => onFilterChange(option.key)}
                className={`px-4 py-2 rounded-md text-base font-semibold transition-colors ${
                  activeFilter === option.key 
                    ? "bg-blue-900 text-white" 
                    : "bg-white text-neutral-950 hover:bg-gray-100"
                }`}
              >
                {option.label.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function ResourceStatCard({ title, value, unit, subtitle }: { title: string; value: number; unit: string; subtitle?: string;}) {
    const percentage = Math.round(value);
    const color = percentage > 85 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-gray-700">{title}</h3>
                <span className="font-bold text-xl">{percentage}{unit}</span>
            </div>
            {subtitle && <p className="text-xs text-gray-500 -mt-1">{subtitle}</p>}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}