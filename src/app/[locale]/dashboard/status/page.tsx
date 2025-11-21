// ===== .\src\app\[locale]\dashboard\status\page.tsx =====
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  ScriptableContext,
  ChartOptions
} from 'chart.js';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

interface GPUMemory { total_mb: number; used_mb: number; free_mb: number; }
interface GPUStats { name: string; utilization_percent: number; memory: GPUMemory; }
interface SystemStats { cpu_percent: number; ram_percent: number; gpu: GPUStats; }

const ResourceChart = ({
  title,
  data,
  currentValue,
  unit,
  maxLabel,
  isLoading
}: {
  title: string;
  data: number[];
  currentValue: number;
  unit: string;
  maxLabel: string;
  isLoading: boolean;
}) => {
  const tSys = useTranslations('System');

  const chartData = {
    labels: Array.from({ length: 60 }, (_, i) => i + 1),
    datasets: [{
      label: 'Usage',
      data: data,
      borderColor: '#3b82f6',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        if (!ctx) return 'rgba(59, 130, 246, 0)';
        const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        return gradient;
      },
    }],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 100,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: 'rgba(255,255,255,0.7)'}
      },
      x: { display: false },
    },
  };

  return (
    <div className="w-full bg-neutral-900 rounded-lg border border-zinc-700 overflow-hidden p-6">
      <div className="flex justify-between items-baseline mb-4">
        <h2 className="text-white text-xl font-bold font-['Unbounded']">{title === 'GPU' ? tSys('gpu') : title}</h2>
        {!isLoading && (
          <span className="text-2xl font-semibold text-cyan-400 font-mono">
            {currentValue.toFixed(1)}{unit}
          </span>
        )}
      </div>
      <div style={{ position: 'relative', height: '120px' }}>
        <Line options={chartOptions} data={chartData} />
      </div>
      <div className="flex justify-between text-gray-400 text-xs font-['Inter'] mt-2">
        <span>60 giây trước</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
};

export default function StatusPage() {
  const t = useTranslations('Dashboard');
  const tSys = useTranslations('System');
  
  const HISTORY_LENGTH = 60;
  const POLLING_INTERVAL = 10000;

  const [cpuHistory, setCpuHistory] = useState<number[]>(new Array(HISTORY_LENGTH).fill(0));
  const [ramHistory, setRamHistory] = useState<number[]>(new Array(HISTORY_LENGTH).fill(0));
  const [gpuHistory, setGpuHistory] = useState<number[]>(new Array(HISTORY_LENGTH).fill(0));
  const [vramHistory, setVramHistory] = useState<number[]>(new Array(HISTORY_LENGTH).fill(0));
  
  const [latestStats, setLatestStats] = useState<SystemStats | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const backendUrlRes = await fetch('/api/get-backend-url');
      if (!backendUrlRes.ok) {
        throw new Error("Không thể kết nối đến máy chủ trung gian để lấy URL backend.");
      }
      const { url: backendUrl } = await backendUrlRes.json();
      
      // --- SỬA LỖI TẠI ĐÂY: Thêm header 'ngrok-skip-browser-warning' ---
      const statsRes = await fetch(`${backendUrl}/system/stats`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      // --- KẾT THÚC SỬA LỖI ---
      
      if (!statsRes.ok) {
        throw new Error("Không thể tải dữ liệu tài nguyên từ AI server.");
      }
      
      const statsData: SystemStats = await statsRes.json();

      setLatestStats(statsData);
      
      const vramUsagePercent = (statsData.gpu.memory.used_mb / statsData.gpu.memory.total_mb) * 100;
      
      setCpuHistory(prev => [...prev.slice(1), statsData.cpu_percent]);
      setRamHistory(prev => [...prev.slice(1), statsData.ram_percent]);
      setGpuHistory(prev => [...prev.slice(1), statsData.gpu.utilization_percent]);
      setVramHistory(prev => [...prev.slice(1), vramUsagePercent]);
      
      if (isLoading) setIsLoading(false);
      if (error) setError(null);

    } catch (e: any) {
      console.error(e);
      // Kiểm tra lỗi CORS cụ thể để đưa ra thông báo thân thiện hơn
      if (e instanceof TypeError && e.message.includes('Failed to fetch')) {
          setError("Lỗi CORS hoặc mạng. Hãy chắc chắn backend AI đang chạy và đã được cấu hình CORS.");
      } else {
          setError(e.message || "Đã xảy ra lỗi không xác định.");
      }
      setIsLoading(false);
    }
  }, [isLoading, error]);

  useEffect(() => {
    fetchStats();
  }, []);

  useInterval(fetchStats, POLLING_INTERVAL);

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white font-['Unbounded'] mb-6">Trạng thái & Tài nguyên</h1>
        <div className="flex items-center justify-center h-64 bg-neutral-900 rounded-lg">
          <Icon icon="eos-icons:bubble-loading" className="w-12 h-12 text-cyan-400" />
          <p className="ml-4 text-gray-300 font-['Inter'] text-lg">Đang tải dữ liệu tài nguyên...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
     return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold text-white font-['Unbounded'] mb-6">Trạng thái & Tài nguyên</h1>
        <div className="flex flex-col items-center justify-center h-64 bg-red-900/30 border border-red-500 rounded-lg">
          <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 text-red-400" />
          <p className="mt-4 text-red-300 font-['Inter'] text-lg">{t('cannotLoadResource')}</p>
           <p className="mt-2 text-red-400 font-mono text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const vramUsedGB = latestStats ? (latestStats.gpu.memory.used_mb / 1024).toFixed(1) : '0.0';
  const vramTotalGB = latestStats ? (latestStats.gpu.memory.total_mb / 1024).toFixed(1) : '0.0';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white font-['Unbounded'] mb-2">Trạng thái & Tài nguyên</h1>
        <p className="text-gray-400 font-['Inter']">Giám sát tài nguyên hệ thống theo thời gian thực</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceChart 
          title={tSys('cpu')} 
          data={cpuHistory}
          currentValue={latestStats?.cpu_percent ?? 0}
          unit="%"
          maxLabel="100%"
          isLoading={isLoading}
        />
        <ResourceChart 
          title={tSys('ram')} 
          data={ramHistory}
          currentValue={latestStats?.ram_percent ?? 0}
          unit="%"
          maxLabel="100%"
          isLoading={isLoading}
        />
        <ResourceChart 
          title={tSys('gpu')}
          data={gpuHistory}
          currentValue={latestStats?.gpu.utilization_percent ?? 0}
          unit="%"
          maxLabel={latestStats?.gpu.name ?? "N/A"}
          isLoading={isLoading}
        />
        <ResourceChart 
          title={tSys('vram')}
          data={vramHistory}
          currentValue={latestStats ? (latestStats.gpu.memory.used_mb / latestStats.gpu.memory.total_mb) * 100 : 0}
          unit="%"
          maxLabel={`${vramUsedGB} / ${vramTotalGB} GB`}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}