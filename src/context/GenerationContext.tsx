// ===== .\src\context\GenerationContext.tsx =====
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useMemo } from 'react';

interface GeneratedModel {
  jobId: string;
  url: string; 
  prompt: string;
  thumbnailUrl: string;
  status: 'idle' | 'queued' | 'processing' | 'downloading' | 'completed' | 'failed';
  error?: string;
}

interface GenerationState {
  currentModelUrl: string | null;
  library: GeneratedModel[];
  isRateLimited: boolean;
  submitJob: (payload: { type: 'text'; caption: string } | { type: 'image'; imageFile: File }) => Promise<void>;
  setCurrentModelUrl: (url: string | null) => void;
  updateThumbnail: (jobId: string, thumbnailUrl: string) => void;
}

const GenerationContext = createContext<GenerationState | undefined>(undefined);

const MAX_REQUESTS = 5;
const TIME_WINDOW_MINUTES = 10;

async function getBackendUrl(): Promise<string> {
  const res = await fetch('/api/get-backend-url');
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to fetch backend URL');
  }
  const data = await res.json();
  return data.url;
}

export const GenerationProvider = ({ children }: { children: ReactNode }) => {
  const [currentModelUrl, setCurrentModelUrl] = useState<string | null>(null);
  const [library, setLibrary] = useState<GeneratedModel[]>([]);
  const [requestTimestamps, setRequestTimestamps] = useState<Date[]>([]);

  const pollingIntervalsRef = useRef(new Map<string, NodeJS.Timeout>());

  const isRateLimited = useMemo(() => {
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - TIME_WINDOW_MINUTES * 60 * 1000);
    const recentRequests = requestTimestamps.filter(ts => ts > tenMinutesAgo);
    return recentRequests.length >= MAX_REQUESTS;
  }, [requestTimestamps]);

  const updateThumbnail = (jobIdToUpdate: string, thumbnailUrl: string) => {
    setLibrary(prevLibrary =>
      prevLibrary.map(item =>
        item.jobId === jobIdToUpdate ? { ...item, thumbnailUrl } : item
      )
    );
  };

  const updateLibraryItem = (jobId: string, updates: Partial<GeneratedModel>) => {
      setLibrary(prev => prev.map(item => 
          item.jobId === jobId ? { ...item, ...updates } : item
      ));
  };
  
  const stopPollingForJob = (id: string) => {
      if (pollingIntervalsRef.current.has(id)) {
          clearInterval(pollingIntervalsRef.current.get(id)!);
          pollingIntervalsRef.current.delete(id);
      }
  };

  const pollJobStatus = async (id: string, backendUrl: string) => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${backendUrl}/jobs/${id}/status`, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });

        if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
        
        const data = await res.json();
        
        if (data.status !== 'completed' && data.status !== 'failed') {
            updateLibraryItem(id, { status: data.status });
        }

        if (data.status === 'completed' || data.status === 'failed') {
          stopPollingForJob(id);

          if (data.status === 'completed' && data.download_url) {
            updateLibraryItem(id, { status: 'downloading' });
            const modelUrl = `${backendUrl}${data.download_url}`;
            const modelResponse = await fetch(modelUrl, {
              headers: { 'ngrok-skip-browser-warning': 'true' },
            });
            if (!modelResponse.ok) throw new Error(`Failed to download GLB file. Status: ${modelResponse.status}`);
            
            const modelBlob = await modelResponse.blob();
            const blobUrl = URL.createObjectURL(modelBlob);
            
            updateLibraryItem(id, { status: 'completed', url: blobUrl, thumbnailUrl: '/logo/dark.png' });
            setCurrentModelUrl(blobUrl);

          } else { 
            const errorMsg = data.error || 'An unknown error occurred.';
            updateLibraryItem(id, { status: 'failed', error: errorMsg });
          }
        }
      } catch (err) {
        stopPollingForJob(id);
        const errorMsg = (err as Error).message;
        updateLibraryItem(id, { status: 'failed', error: errorMsg });
      }
    }, 3000);
    pollingIntervalsRef.current.set(id, intervalId);
  };
  
  // SỬA LỖI: Khắc phục cảnh báo react-hooks/exhaustive-deps
  useEffect(() => {
    const pollingMap = pollingIntervalsRef.current;
    return () => {
      // Sử dụng biến đã được sao chép trong hàm dọn dẹp
      pollingMap.forEach(intervalId => clearInterval(intervalId));
    };
  }, []);

  const submitJob = async (payload: { type: 'text'; caption: string } | { type: 'image'; imageFile: File }) => {
    if (isRateLimited) {
        alert(`Rate limit exceeded. Please wait. (Max ${MAX_REQUESTS} requests per ${TIME_WINDOW_MINUTES} minutes)`);
        return;
    }
    
    let promptForLibrary: string;
    let requestBody: BodyInit | null = null;
    // SỬA LỖI: Chuyển 'let' thành 'const' vì không gán lại
    const requestHeaders: HeadersInit = { 'ngrok-skip-browser-warning': 'true' };
    let endpoint: string;

    if (payload.type === 'text') {
        promptForLibrary = payload.caption;
        endpoint = '/jobs/text-to-3d';
        requestHeaders['Content-Type'] = 'application/json';
        requestBody = JSON.stringify({ caption: payload.caption });
    } else {
        promptForLibrary = payload.imageFile.name;
        endpoint = '/jobs/image-to-3d';
        const formData = new FormData();
        formData.append('image', payload.imageFile);
        requestBody = formData;
        // Xóa 'Content-Type' để trình duyệt tự động đặt với boundary chính xác cho multipart/form-data
        // delete requestHeaders['Content-Type']; // Dòng này không cần thiết nếu khởi tạo lại header
    }

    try {
        const backendUrl = await getBackendUrl();
        const response = await fetch(`${backendUrl}${endpoint}`, {
            method: 'POST',
            headers: requestHeaders,
            body: requestBody,
        });

        setRequestTimestamps(prev => [...prev, new Date()]);
      
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Job submission failed');
        }

        const data = await response.json();
        const newJobId = data.job_id;
      
        const placeholderModel: GeneratedModel = {
            jobId: newJobId,
            url: '',
            prompt: promptForLibrary,
            thumbnailUrl: '',
            status: data.status,
        };
        setLibrary(prev => [placeholderModel, ...prev]);

        pollJobStatus(newJobId, backendUrl);

    } catch (err) {
      console.error("Job submission failed:", (err as Error).message);
    }
  };
  
  const value = { currentModelUrl, library, submitJob, setCurrentModelUrl, updateThumbnail, isRateLimited };

  return (
    <GenerationContext.Provider value={value}>
      {children}
    </GenerationContext.Provider>
  );
};

export const useGeneration = () => {
  const context = useContext(GenerationContext);
  if (context === undefined) {
    throw new Error('useGeneration must be used within a GenerationProvider');
  }
  return context;
};