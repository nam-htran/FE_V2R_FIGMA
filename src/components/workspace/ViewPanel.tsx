// ===== .\src/components\workspace\ViewPanel.tsx =====
"use client";

import { Suspense, type FC, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Grid, Edges } from '@react-three/drei';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';

// --- TYPE GUARD ---
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

// --- COMPONENT CHÍNH ---
// CẬP NHẬT: Không cần nhận props về trạng thái panel nữa
const ViewPanel: FC = () => {
  const sceneControls = useControls('Scene', { backgroundColor: '#000000', environment: { value: 'city', options: environmentOptions }, intensity: { value: 0.8, min: 0, max: 2, step: 0.1 } });
  const modelControls = useControls('Model', { scale: { value: 1, min: 0.1, max: 5, step: 0.05 }, rotation: [0, 0, 0] });
  const cameraControls = useControls('Camera', { fov: { value: 45, min: 10, max: 120, step: 1 } });
  const helperControls = useControls('Helpers', { autoRotate: true, showGrid: true, showWireframe: false, polyThickness: { value: 1, min: 0.1, max: 10, step: 0.1, render: (get) => get('Helpers.showWireframe') }, polyColor: { value: '#ffffff', render: (get) => get('Helpers.showWireframe') } });

  const viewPanelRef = useRef<HTMLDivElement>(null);
  const [levaStyle, setLevaStyle] = useState<React.CSSProperties>({
    opacity: 0, 
    position: 'fixed',
    zIndex: 10
  });

  useEffect(() => {
    const viewPanelElement = viewPanelRef.current;
    if (!viewPanelElement) return;

    const updatePosition = () => {
      const rect = viewPanelElement.getBoundingClientRect();
      const levaWidth = 300; 
      
      const newLeft = rect.left + (rect.width / 2) - (levaWidth / 2);
      
      setLevaStyle({
        position: 'fixed',
        left: `${newLeft}px`,
        bottom: '1rem',
        width: `${levaWidth}px`,
        zIndex: 10,
        opacity: 1, 
        transition: 'left 0.2s ease-out'
      });
    };
    
    updatePosition();
    
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(viewPanelElement);
    
    return () => {
      resizeObserver.unobserve(viewPanelElement);
    };
  }, []); 

  return (
    // CẬP NHẬT: Gắn ref vào div cha của ViewPanel (nằm trong workspace/page.tsx)
    // Code bên trong ViewPanel.tsx không cần thay đổi cấu trúc JSX
    // Chỉ cần đảm bảo thẻ cha của nó có ref
    <div ref={viewPanelRef} className="flex-grow h-full bg-neutral-900 relative">
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