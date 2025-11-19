// ===== .\src/components/workspace/ViewPanel.tsx =====
"use client";

import { Suspense, type FC, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Grid } from '@react-three/drei';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { useGeneration } from '@/context/GenerationContext';
// SỬA LỖI: Gỡ bỏ import 'Icon' không sử dụng
// import { Icon } from '@iconify/react';

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// SỬA LỖI: Viết lại logic để không phụ thuộc vào state toàn cục
const ThumbnailCapturer: FC = () => {
  const { gl } = useThree();
  const { library, updateThumbnail } = useGeneration();
  const prevLibrary = usePrevious(library);

  useEffect(() => {
    // Chỉ chạy khi có prevLibrary và library đã thay đổi
    if (prevLibrary && prevLibrary !== library) {
      // Tìm mô hình vừa chuyển từ 'downloading' sang 'completed'
      const newlyCompleted = library.find(currentItem => {
        const prevItem = prevLibrary.find(p => p.jobId === currentItem.jobId);
        return prevItem && prevItem.status === 'downloading' && currentItem.status === 'completed';
      });

      if (newlyCompleted) {
        setTimeout(() => {
          const dataUrl = gl.domElement.toDataURL('image/png');
          updateThumbnail(newlyCompleted.jobId, dataUrl);
          console.log(`Thumbnail captured for job: ${newlyCompleted.jobId}`);
        }, 500); // 500ms delay để đảm bảo model đã render
      }
    }
  }, [library, prevLibrary, gl, updateThumbnail]);

  return null;
};

const Loader: FC = () => <Html center><div className="text-white text-lg font-sans">Loading 3D Model...</div></Html>;

interface ModelRendererProps {
  url: string;
  scale: number;
  rotation: [number, number, number];
  autoRotate: boolean;
}

const GeneratedModelRenderer: FC<ModelRendererProps> = (props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(props.url);

  useFrame((state, delta) => {
    if (props.autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={props.scale} rotation={props.rotation}>
      <primitive object={scene} />
    </group>
  );
};
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

  const modelToDisplayUrl = currentModelUrl || '/3D-model/model.glb';

  return (
    <div className="w-full h-full relative">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.5, 6] }} style={{ position: "absolute", width: '100%', height: '100%' }} shadows gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={[sceneControls.backgroundColor]} />
        <CameraUpdater fov={cameraControls.fov} />
        <ambientLight intensity={sceneControls.intensity / 2} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset={sceneControls.environment as EnvironmentPresetType} />
        {helperControls.showGrid && (<Grid infiniteGrid position={[0, -0.5, 0]} sectionSize={1} cellSize={0.5} sectionColor={"#444444"} cellColor={"#222222"} fadeDistance={25} fadeStrength={1} />)}
        <Suspense fallback={<Loader />}>
          <GeneratedModelRenderer
            url={modelToDisplayUrl}
            scale={modelControls.scale}
            rotation={modelControls.rotation}
            autoRotate={helperControls.autoRotate}
          />
        </Suspense>
        <OrbitControls makeDefault />
        <ThumbnailCapturer />
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[300px] z-10">
        <Leva fill oneLineLabels collapsed />
      </div>
    </div>
  );
};

export default ViewPanel;