// ===== src/context/GenerationContext.tsx =====
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo, useCallback } from 'react';
import { useToast } from './ToastContext';

// --- TYPES ---
type JobStatus = 'queued' | 'processing' | 'downloading' | 'completed' | 'failed';

interface GeneratedModel {
  jobId: string;
  url: string; 
  prompt: string;
  thumbnailUrl: string;
  status: JobStatus;
  error?: string;
}

interface GenerationState {
  currentModelUrl: string | null;
  library: GeneratedModel[];
  isGenerating: boolean; // Biến này giờ sẽ chỉ dùng để check xem có đang GỬI request hay không
  activeJobCount: number; // BỔ SUNG: Số lượng job đang chạy
  maxConcurrentJobs: number; // BỔ SUNG: Giới hạn tối đa
  isRateLimited: boolean;
  submitJob: (payload: { type: 'text'; caption: string } | { type: 'image'; imageFile: File }) => void;
  setCurrentModelUrl: (url: string | null) => void;
  updateThumbnail: (jobId: string, thumbnailUrl: string) => void;
}

const GenerationContext = createContext<GenerationState | undefined>(undefined);

// --- CONSTANTS ---
const MAX_REQUESTS = 5;
const TIME_WINDOW_MINUTES = 10;
const MAX_CONCURRENT_JOBS = 3; // BỔ SUNG: Giới hạn queue tối đa

async function getBackendUrl(): Promise<string> {
  const res = await fetch('/api/get-backend-url');
  if (!res.ok) throw new Error('Failed to fetch backend URL');
  const data = await res.json();
  return data.url;
}

export const GenerationProvider = ({ children }: { children: ReactNode }) => {
  const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(null);
  const [library, setLibrary] = useState<GeneratedModel[]>([]);
  
  // isGenerating bây giờ chỉ dùng để disable nút trong tích tắc khi đang gửi request đi
  // để tránh spam click đúp
  const [isGenerating, setIsGenerating] = useState(false); 
  const [requestTimestamps, setRequestTimestamps] = useState<Date[]>([]);
  
  const { showToast } = useToast();
  const pollingIntervalsRef = useRef(new Map<string, NodeJS.Timeout>());

  // --- BỔ SUNG: Tính toán số lượng job đang active ---
  const activeJobCount = useMemo(() => {
    return library.filter(job => ['queued', 'processing', 'downloading'].includes(job.status)).length;
  }, [library]);

  // --- QUAN TRỌNG: ĐÃ XÓA useEffect set isGenerating dựa trên activeJob ---
  // (Đoạn code cũ gây ra việc chỉ cho phép 1 job chạy đã bị xóa)

  // Rate limiting logic
  const isRateLimited = useMemo(() => {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - TIME_WINDOW_MINUTES * 60 * 1000);
    return requestTimestamps.filter(ts => ts > tenMinutesAgo).length >= MAX_REQUESTS;
  }, [requestTimestamps]);

  // Helper to update thumbnail (called by ViewPanel after capture)
  const updateThumbnail = useCallback((jobId: string, url: string) => {
    setLibrary(prev => prev.map(item => item.jobId === jobId ? { ...item, thumbnailUrl: url } : item));
  }, []);

  // Helper to update specific item properties
  const updateLibraryItem = useCallback((id: string, updates: Partial<GeneratedModel>) => {
      setLibrary(prev => prev.map(item => item.jobId === id ? { ...item, ...updates } : item));
  }, []);
  
  // Helper to stop polling
  const stopPolling = useCallback((id: string) => {
      if (pollingIntervalsRef.current.has(id)) {
          clearInterval(pollingIntervalsRef.current.get(id)!);
          pollingIntervalsRef.current.delete(id);
      }
  }, []);

  // --- POLLING LOGIC (Giữ nguyên logic cũ, không thay đổi nhiều) ---
  const pollJobStatus = useCallback(async (realJobId: string, backendUrl: string) => {
    if (pollingIntervalsRef.current.has(realJobId)) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}/jobs/${realJobId}/status`, { 
            headers: { 'ngrok-skip-browser-warning': 'true' } 
        });
        if (!res.ok) return;
        const data = await res.json();
        
        setLibrary(prev => {
            const current = prev.find(i => i.jobId === realJobId);
            if (current && current.status !== data.status && !['completed', 'failed'].includes(data.status)) {
                return prev.map(i => i.jobId === realJobId ? { ...i, status: data.status } : i);
            }
            return prev;
        });

        if (data.status === 'completed' || data.status === 'failed') {
          stopPolling(realJobId);
          
          if (data.status === 'completed' && data.download_url) {
            updateLibraryItem(realJobId, { status: 'downloading' });
            
            const modelRes = await fetch(`${backendUrl}${data.download_url}`, { 
                headers: { 'ngrok-skip-browser-warning': 'true' } 
            });
            if (!modelRes.ok) throw new Error('Download failed');
            
            const blob = await modelRes.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            updateLibraryItem(realJobId, { 
                status: 'completed', 
                url: blobUrl, 
                thumbnailUrl: '/logo/dark.png'
            });

            setCurrentModelUrl(blobUrl);
            showToast("Generation completed!", "success");
          } else { 
            updateLibraryItem(realJobId, { status: 'failed', error: data.error || 'Unknown error' });
            showToast("Generation failed.", "error");
          }
        }
      } catch (e) {
        console.warn("Polling error:", e);
      }
    }, 3000);

    pollingIntervalsRef.current.set(realJobId, intervalId);
  }, [updateLibraryItem, stopPolling, showToast]);

  useEffect(() => {
    const pollingMap = pollingIntervalsRef.current;
    return () => { pollingMap.forEach((intervalId) => clearInterval(intervalId)); };
  }, []);

  // --- SUBMIT JOB LOGIC ---
  const submitJob = (payload: { type: 'text'; caption: string } | { type: 'image'; imageFile: File }) => {
    // Validation
    if (isGenerating) return; // Đang gửi request (chưa nhận phản hồi)
    if (isRateLimited) { showToast("Rate limit exceeded. Please wait.", 'warning'); return; }
    
    // --- BỔ SUNG: Kiểm tra giới hạn số lượng job ---
    if (activeJobCount >= MAX_CONCURRENT_JOBS) {
        showToast(`You have reached the limit of ${MAX_CONCURRENT_JOBS} concurrent jobs.`, 'warning');
        return;
    }

    // Set isGenerating = true để chặn double click trong khi đang gọi API
    setIsGenerating(true);

    const tempId = `temp_${Date.now()}`;
    const promptText = payload.type === 'text' ? payload.caption : payload.imageFile.name;
    
    setLibrary(prev => [
        {
            jobId: tempId,
            url: '',
            prompt: promptText,
            thumbnailUrl: '',
            status: 'queued',
        },
        ...prev
    ]);

    (async () => {
        try {
            const backendUrl = await getBackendUrl();
            let body: BodyInit;
            
            const headers: Record<string, string> = { 'ngrok-skip-browser-warning': 'true' };
            const url = `${backendUrl}/jobs/${payload.type === 'text' ? 'text' : 'image'}-to-3d`;

            if (payload.type === 'text') {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({ caption: payload.caption });
            } else {
                const fd = new FormData();
                fd.append('image', payload.imageFile);
                body = fd;
            }

            const res = await fetch(url, { method: 'POST', headers, body });
            
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || 'Submission failed');
            }
            
            const data = await res.json();
            const realJobId = data.job_id;
            
            setRequestTimestamps(prev => [...prev, new Date()]);

            setLibrary(prev => prev.map(item => 
                item.jobId === tempId 
                    ? { ...item, jobId: realJobId, status: 'processing' }
                    : item
            ));

            pollJobStatus(realJobId, backendUrl);

        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "Unknown error";
            
            setLibrary(prev => prev.map(item => 
                item.jobId === tempId 
                    ? { ...item, status: 'failed', error: errorMessage || 'Submission Error' } 
                    : item
            ));
            showToast(errorMessage || "Failed to start generation", "error");
        } finally {
            // --- BỔ SUNG: Reset isGenerating ngay khi API trả về (thành công hoặc thất bại) ---
            // Điều này cho phép người dùng bấm tiếp nút Generate nếu chưa chạm mốc 3 job
            setIsGenerating(false);
        }
    })();
  };

  const value = { 
    currentModelUrl, 
    library, 
    isGenerating, 
    activeJobCount, // Export ra ngoài
    maxConcurrentJobs: MAX_CONCURRENT_JOBS, // Export ra ngoài
    submitJob, 
    setCurrentModelUrl, 
    updateThumbnail, 
    isRateLimited 
  };

  return (
    <GenerationContext.Provider value={value}>
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (!context) throw new Error('useGeneration must be used within a GenerationProvider');
  return context;
};