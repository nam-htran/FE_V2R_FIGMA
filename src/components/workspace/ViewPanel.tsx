// ===== .\src\components\workspace\ViewPanel.tsx =====
"use client";

import { Suspense, type FC, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// Bỏ PresetsType, nó không tồn tại
import { OrbitControls, useGLTF, Html, Environment, Grid, Edges } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

// --- Các component phụ không đổi ---
function isMesh(obj: THREE.Object3D): obj is THREE.Mesh { return (obj as THREE.Mesh).isMesh; }
const Loader: FC = () => <Html center><div className="text-white text-lg font-sans">Loading 3D Model...</div></Html>;
const Model: FC = () => { const { scene } = useGLTF('/3D-model/model.glb'); return <primitive object={scene} />; };
interface WireframeProps { show: boolean; thickness: number; color: string; }
const ModelWireframe: FC<WireframeProps> = ({ show, thickness, color }) => { const { nodes } = useGLTF('/3D-model/model.glb'); if (!show) return null; return (<>{Object.values(nodes).map((node: THREE.Object3D, index) => (isMesh(node) && (<mesh key={index} geometry={node.geometry}><meshBasicMaterial transparent opacity={0} /><Edges scale={1} threshold={15} color={color} linewidth={thickness} /></mesh>)))}</>); };
interface ModelRendererProps { scale: number; rotation: [number, number, number]; autoRotate: boolean; showWireframe: boolean; polyThickness: number; polyColor: string; }
const ModelRenderer: FC<ModelRendererProps> = (props) => { const groupRef = useRef<THREE.Group>(null!); useFrame((state, delta) => { if (props.autoRotate && groupRef.current) { groupRef.current.rotation.y += delta * 0.2; } }); return (<group ref={groupRef} scale={props.scale} rotation={props.rotation}><Model /><ModelWireframe show={props.showWireframe} thickness={props.polyThickness} color={props.polyColor} /></group>); };
useGLTF.preload('/3D-model/model.glb');
const CameraUpdater: FC<{ fov: number }> = ({ fov }) => { const { camera } = useThree(); useEffect(() => { if (camera instanceof THREE.PerspectiveCamera) { camera.fov = fov; camera.updateProjectionMatrix(); } }, [fov, camera]); return null; };

// Tạo một "nguồn chân lý" cho các giá trị preset
const environmentOptions = ['sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment', 'studio', 'city', 'park', 'lobby'] as const;
// Tự động tạo type từ mảng trên
type EnvironmentPresetType = typeof environmentOptions[number];


const ViewPanel: FC = () => {
  const { resolvedTheme } = useTheme();

  const [sceneControls, setSceneControls] = useControls('Scene', () => ({
    backgroundColor: resolvedTheme === 'light' ? '#EEF2FF' : '#171717',
    environment: { value: 'city' as EnvironmentPresetType, options: environmentOptions },
    intensity: { value: 0.8, min: 0, max: 2, step: 0.1 }
  }));
  
  const modelControls = useControls('Model', { scale: { value: 1, min: 0.1, max: 5, step: 0.05 }, rotation: [0, 0, 0] });
  const cameraControls = useControls('Camera', { fov: { value: 45, min: 10, max: 120, step: 1 } });
  const helperControls = useControls('Helpers', { autoRotate: true, showGrid: true, showWireframe: false, polyThickness: { value: 1, min: 0.1, max: 10, step: 0.1, render: (get) => get('Helpers.showWireframe') }, polyColor: { value: '#ffffff', render: (get) => get('Helpers.showWireframe') } });

  useEffect(() => {
    if (resolvedTheme) {
      const newBgColor = resolvedTheme === 'light' ? '#EEF2FF' : '#171717';
      setSceneControls({ backgroundColor: newBgColor });
    }
  }, [resolvedTheme, setSceneControls]);

  return (
    <div className="w-full h-full relative">
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
        
        {/* === SỬA LỖI TẠI ĐÂY === */}
        {/* Ép kiểu (cast) `sceneControls.environment` thành `EnvironmentPresetType` */}
        <Environment preset={sceneControls.environment as EnvironmentPresetType} />
        
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