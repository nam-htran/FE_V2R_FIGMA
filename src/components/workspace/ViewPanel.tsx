// ===== ./src/components/workspace/ViewPanel.tsx =====
"use client";

import { Suspense, type FC, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Grid } from '@react-three/drei';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { useGeneration } from '@/context/GenerationContext';

// --- 1. THUMBNAIL CAPTURER: Đã sửa logic đợi model load ---
interface ThumbnailCapturerProps {
  isModelLoaded: boolean; // Nhận props để biết model đã load xong chưa
}

const ThumbnailCapturer: FC<ThumbnailCapturerProps> = ({ isModelLoaded }) => {
  const { gl, scene, camera } = useThree();
  const { library, updateThumbnail, currentModelUrl } = useGeneration();
  
  // Lưu trữ jobId đang chờ chụp
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);

  useEffect(() => {
    // Tìm model đã hoàn thành (status='completed') NHƯNG vẫn dùng thumbnail mặc định
    const jobToCapture = library.find(item => 
      item.status === 'completed' && 
      item.url === currentModelUrl && 
      (item.thumbnailUrl === '' || item.thumbnailUrl.startsWith('/logo'))
    );

    if (jobToCapture) {
      // Tìm thấy job cần chụp, set vào state chờ
      setPendingJobId(jobToCapture.jobId);
    } else {
      setPendingJobId(null);
    }
  }, [library, currentModelUrl]);

  useEffect(() => {
    // CHỈ CHỤP KHI: Có job cần chụp VÀ Model đã báo load xong
    if (pendingJobId && isModelLoaded) {
      
      // Dùng setTimeout để đợi thêm 1 xíu cho Canvas render frame đầu tiên thật sự mượt
      const timer = setTimeout(() => {
        try {
          // Force render một frame để đảm bảo có hình
          gl.render(scene, camera);
          
          const dataUrl = gl.domElement.toDataURL('image/png', 0.5); // 0.5 quality để nhẹ
          
          if (dataUrl && dataUrl.length > 1000) { // Kiểm tra độ dài chuỗi để chắc chắn không phải ảnh lỗi
            console.log(`📸 Captured thumbnail for: ${pendingJobId}`);
            updateThumbnail(pendingJobId, dataUrl);
            setPendingJobId(null); // Reset sau khi chụp xong
          }
        } catch (err) {
          console.error("Failed to capture thumbnail:", err);
        }
      }, 500); // Đợi 500ms sau khi model load xong

      return () => clearTimeout(timer);
    }
  }, [pendingJobId, isModelLoaded, gl, scene, camera, updateThumbnail]);

  return null;
};

const Loader: FC = () => <Html center><div className="text-white text-lg font-sans font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Loading 3D...</div></Html>;

// --- 2. MODEL RENDERER: Thêm callback onLoaded ---
interface ModelRendererProps {
  url: string;
  scale: number;
  rotation: [number, number, number];
  autoRotate: boolean;
  onLoaded: () => void; // Callback mới
}

const GeneratedModelRenderer: FC<ModelRendererProps> = ({ url, scale, rotation, autoRotate, onLoaded }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(url);

  // Kích hoạt callback khi scene thay đổi (tức là model mới đã load)
  useEffect(() => {
    if (scene) {
      onLoaded();
    }
  }, [scene, url, onLoaded]);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={scale} rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
};

// Preload model mặc định để tránh lỗi lần đầu
useGLTF.preload('/3D-model/model.glb');

const CameraUpdater: FC<{ fov: number }> = ({ fov }) => { 
    const { camera } = useThree(); 
    useEffect(() => { 
        if (camera instanceof THREE.PerspectiveCamera) { 
            camera.fov = fov; camera.updateProjectionMatrix(); 
        } 
    }, [fov, camera]); 
    return null; 
};

const environmentOptions = ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'] as const;
type EnvironmentPresetType = typeof environmentOptions[number];

const ViewPanel: FC = () => {
  const { resolvedTheme } = useTheme();
  const { currentModelUrl } = useGeneration();
  
  // --- 3. State mới để theo dõi trạng thái load của model ---
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const [sceneControls, setSceneControls] = useControls('Scene', () => ({
    backgroundColor: resolvedTheme === 'light' ? '#EEF2FF' : '#171717',
    environment: { value: 'city' as EnvironmentPresetType, options: environmentOptions },
    intensity: { value: 0.8, min: 0, max: 2, step: 0.1 }
  }));
  
  const modelControls = useControls('Model', { scale: { value: 1, min: 0.1, max: 5, step: 0.05 }, rotation: [0, 0, 0] });
  const cameraControls = useControls('Camera', { fov: { value: 45, min: 10, max: 120, step: 1 } });
  const helperControls = useControls('Helpers', { autoRotate: true, showGrid: true });

  useEffect(() => {
    if (resolvedTheme) {
      const newBgColor = resolvedTheme === 'light' ? '#EEF2FF' : '#171717';
      setSceneControls({ backgroundColor: newBgColor });
    }
  }, [resolvedTheme, setSceneControls]);

  // Reset trạng thái load khi URL thay đổi
  useEffect(() => {
    setIsModelLoaded(false);
  }, [currentModelUrl]);

  const modelToDisplayUrl = currentModelUrl || '/3D-model/model.glb';

  return (
    <div className="w-full h-full relative">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 6] }} style={{ position: "absolute", width: '100%', height: '100%' }} shadows gl={{ preserveDrawingBuffer: true }}>
        <CameraUpdater fov={cameraControls.fov} />
        <ambientLight intensity={sceneControls.intensity / 2} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset={sceneControls.environment as EnvironmentPresetType} />
        
        {helperControls.showGrid && (
            <Grid infiniteGrid position={[0, -0.5, 0]} sectionSize={1} cellSize={0.5} sectionColor={"#444444"} cellColor={"#222222"} fadeDistance={25} fadeStrength={1} />
        )}
        
        <Suspense fallback={<Loader />}>
          <GeneratedModelRenderer
            url={modelToDisplayUrl}
            scale={modelControls.scale}
            rotation={modelControls.rotation}
            autoRotate={helperControls.autoRotate}
            onLoaded={() => setIsModelLoaded(true)} // Báo hiệu khi model đã load xong
          />
        </Suspense>
        
        <OrbitControls makeDefault />
        
        {/* Truyền trạng thái load vào Capturer */}
        <ThumbnailCapturer isModelLoaded={isModelLoaded} />
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[300px] z-10">
        <Leva fill oneLineLabels collapsed />
      </div>
    </div>
  );
};

export default ViewPanel;