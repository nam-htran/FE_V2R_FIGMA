// ===== .\src\components\workspace\ViewPanel.tsx =====
"use client";

import { Suspense, type FC, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Grid, Edges } from '@react-three/drei';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';

// --- TYPE GUARD (Không thay đổi) ---
function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh;
}

// --- CÁC COMPONENT PHỤ (Không thay đổi) ---
const Loader: FC = () => <Html center><div className="text-white text-lg font-sans">Loading 3D Model...</div></Html>;
const Model: FC = () => { const { scene } = useGLTF('/3D-model/model.glb'); return <primitive object={scene} />; };
interface WireframeProps { show: boolean; thickness: number; color: string; }
const ModelWireframe: FC<WireframeProps> = ({ show, thickness, color }) => {
  const { nodes } = useGLTF('/3D-model/model.glb');
  if (!show) return null;
  return (<>{Object.values(nodes).map((node: THREE.Object3D, index) => (isMesh(node) && (<mesh key={index} geometry={node.geometry}><meshBasicMaterial transparent opacity={0} /><Edges scale={1} threshold={15} color={color} linewidth={thickness} /></mesh>)))}</>);
};
interface ModelRendererProps { scale: number; rotation: [number, number, number]; autoRotate: boolean; showWireframe: boolean; polyThickness: number; polyColor: string; }
const ModelRenderer: FC<ModelRendererProps> = (props) => {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state, delta) => { if (props.autoRotate && groupRef.current) { groupRef.current.rotation.y += delta * 0.2; } });
  return (<group ref={groupRef} scale={props.scale} rotation={props.rotation}><Model /><ModelWireframe show={props.showWireframe} thickness={props.polyThickness} color={props.polyColor} /></group>);
};
useGLTF.preload('/3D-model/model.glb');
const CameraUpdater: FC<{ fov: number }> = ({ fov }) => {
  const { camera } = useThree();
  useEffect(() => { if (camera instanceof THREE.PerspectiveCamera) { camera.fov = fov; camera.updateProjectionMatrix(); } }, [fov, camera]);
  return null;
};
const environmentOptions = ['city', 'sunset', 'dawn', 'park', 'apartment', 'studio', 'warehouse'] as const;
type EnvironmentPreset = typeof environmentOptions[number];

// --- INTERFACE CHO PROPS MỚI ---
interface ViewPanelProps {
  isSidebarCollapsed: boolean;
  isLibraryPanelCollapsed: boolean;
}

// --- COMPONENT CHÍNH ---
const ViewPanel: FC<ViewPanelProps> = ({ isSidebarCollapsed, isLibraryPanelCollapsed }) => {
  // Các useControls không thay đổi
  const sceneControls = useControls('Scene', { backgroundColor: '#000000', environment: { value: 'city', options: environmentOptions }, intensity: { value: 0.8, min: 0, max: 2, step: 0.1 } });
  const modelControls = useControls('Model', { scale: { value: 1, min: 0.1, max: 5, step: 0.05 }, rotation: [0, 0, 0] });
  const cameraControls = useControls('Camera', { fov: { value: 45, min: 10, max: 120, step: 1 } });
  const helperControls = useControls('Helpers', { autoRotate: true, showGrid: true, showWireframe: false, polyThickness: { value: 1, min: 0.1, max: 10, step: 0.1, render: (get) => get('Helpers.showWireframe') }, polyColor: { value: '#ffffff', render: (get) => get('Helpers.showWireframe') } });

  // CẬP NHẬT: Toàn bộ logic tính toán vị trí
  const [levaStyle, setLevaStyle] = useState<React.CSSProperties>({
    opacity: 0,
    position: 'fixed',
    zIndex: 10
  });

  useEffect(() => {
    // Hàm tính toán và cập nhật vị trí
    const updatePosition = () => {
      // Chiều rộng (rem) của các panel từ Tailwind CSS (w-96 -> 24rem, w-14 -> 3.5rem)
      const SIDEBAR_WIDTH_OPEN = 24 * 16; // 384px
      const SIDEBAR_WIDTH_COLLAPSED = 3.5 * 16; // 56px
      const LIBRARY_WIDTH_OPEN = 24 * 16; // 384px
      const LIBRARY_WIDTH_COLLAPSED = 3.5 * 16; // 56px
      const LEVA_WIDTH = 300; // Chiều rộng ước tính của Leva panel

      // Xác định chiều rộng thực tế của các panel đang chiếm dụng không gian
      const leftOffset = isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_OPEN;
      // LibraryPanel khi thu gọn vẫn chiếm không gian, khi mở thì đè lên
      const rightOffset = isLibraryPanelCollapsed ? LIBRARY_WIDTH_COLLAPSED : LIBRARY_WIDTH_OPEN;

      // Chiều rộng của toàn bộ cửa sổ
      const windowWidth = window.innerWidth;
      
      // Tính chiều rộng của không gian hiển thị ViewPanel thực tế
      const availableWidth = windowWidth - leftOffset - rightOffset;

      // Tính toán vị trí 'left' để căn giữa Leva trong không gian đó
      const newLeft = leftOffset + (availableWidth / 2) - (LEVA_WIDTH / 2);
      
      setLevaStyle({
        position: 'fixed',
        left: `${newLeft}px`,
        bottom: '1rem',
        width: `${LEVA_WIDTH}px`,
        zIndex: 10,
        opacity: 1,
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' // Hiệu ứng mượt mà
      });
    };
    
    // Gọi hàm lần đầu và mỗi khi cửa sổ resize hoặc trạng thái panel thay đổi
    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    // Dọn dẹp
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isSidebarCollapsed, isLibraryPanelCollapsed]); // Chạy lại hiệu ứng khi trạng thái panel thay đổi

  return (
    <div className="flex-grow h-full bg-neutral-900 relative">
      <div style={levaStyle}>
        <Leva 
          fill 
          oneLineLabels 
          collapsed 
        />
      </div>

      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 1.5, 6] }} 
        style={{ position: "absolute", width: '100%', height: '100%' }}
        shadows
      >
        <color attach="background" args={[sceneControls.backgroundColor]} />
        <CameraUpdater fov={cameraControls.fov} />
        <ambientLight intensity={sceneControls.intensity / 2} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset={sceneControls.environment as EnvironmentPreset} />
        {helperControls.showGrid && (<Grid infiniteGrid position={[0, -0.5, 0]} sectionSize={1} cellSize={0.5} sectionColor={"#444444"} cellColor={"#222222"} fadeDistance={25} fadeStrength={1} />)}
        <Suspense fallback={<Loader />}>
          <ModelRenderer scale={modelControls.scale} rotation={modelControls.rotation} autoRotate={helperControls.autoRotate} showWireframe={helperControls.showWireframe} polyThickness={helperControls.polyThickness} polyColor={helperControls.polyColor} />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ViewPanel;