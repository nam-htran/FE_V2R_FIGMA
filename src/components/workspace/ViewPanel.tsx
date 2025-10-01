// components/workspace/ViewPanel.tsx
"use client";

import { Suspense, type FC, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Environment, Grid, Edges } from '@react-three/drei';
import { useControls, Leva } from 'leva';
import * as THREE from 'three';

// --- TYPE GUARD ---
// Hàm này kiểm tra xem một Object3D có phải là Mesh hay không
// và thông báo cho TypeScript biết điều đó.
function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
  return (obj as THREE.Mesh).isMesh;
}


// --- CÁC COMPONENT PHỤ ---

// Component Loader hiển thị trong khi chờ tải
const Loader: FC = () => {
  return (
    <Html center>
      <div className="text-white text-lg font-sans">Loading 3D Model...</div>
    </Html>
  );
};

// Component Model đơn giản, chỉ có nhiệm vụ render scene
const Model: FC = () => {
  const { scene } = useGLTF('/3D-model/model.glb');
  return <primitive object={scene} />;
};

// Component Wireframe chuyên render khung lưới
interface WireframeProps {
  show: boolean;
  thickness: number;
  color: string;
}
const ModelWireframe: FC<WireframeProps> = ({ show, thickness, color }) => {
  const { nodes } = useGLTF('/3D-model/model.glb');
  if (!show) return null;

  return (
    <>
      {Object.values(nodes).map((node: THREE.Object3D, index) => (
        // Sử dụng Type Guard để đảm bảo node là một Mesh
        isMesh(node) && (
          <mesh key={index} geometry={node.geometry}>
            <meshBasicMaterial transparent opacity={0} /> 
            <Edges
              scale={1}
              threshold={15}
              color={color}
              linewidth={thickness}
            />
          </mesh>
        )
      ))}
    </>
  );
};

// Component Container: Chứa logic xoay/scale và render cả Model lẫn Wireframe
interface ModelRendererProps {
  scale: number;
  rotation: [number, number, number];
  autoRotate: boolean;
  showWireframe: boolean;
  polyThickness: number;
  polyColor: string;
}
const ModelRenderer: FC<ModelRendererProps> = (props) => {
  const groupRef = useRef<THREE.Group>(null!);

  // Logic tự động xoay được đặt ở đây, áp dụng cho group cha chung
  useFrame((state, delta) => {
    if (props.autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} scale={props.scale} rotation={props.rotation}>
      <Model />
      <ModelWireframe 
        show={props.showWireframe}
        thickness={props.polyThickness}
        color={props.polyColor}
      />
    </group>
  );
};

useGLTF.preload('/3D-model/model.glb');

// Component chuyên cập nhật fov của camera
const CameraUpdater: FC<{ fov: number }> = ({ fov }) => {
  const { camera } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [fov, camera]);
  return null;
};

// Định nghĩa options và types cho Environment
const environmentOptions = ['city', 'sunset', 'dawn', 'park', 'apartment', 'studio', 'warehouse'] as const;
type EnvironmentPreset = typeof environmentOptions[number];


// --- COMPONENT CHÍNH ---

const ViewPanel: FC = () => {
  // Leva controls
  const sceneControls = useControls('Scene', {
    backgroundColor: '#555555',
    environment: { value: 'city', options: environmentOptions },
    intensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
  });

  const modelControls = useControls('Model', {
    scale: { value: 1, min: 0.1, max: 5, step: 0.05 },
    rotation: [0, 0, 0],
  });

  const cameraControls = useControls('Camera', {
    fov: { value: 45, min: 10, max: 120, step: 1 },
  });

  const helperControls = useControls('Helpers', {
    autoRotate: true,
    showGrid: true,
    showWireframe: false,
    polyThickness: {
      value: 1,
      min: 0.1,
      max: 10,
      step: 0.1,
      render: (get) => get('Helpers.showWireframe'),
    },
    polyColor: {
      value: '#ffffff',
      render: (get) => get('Helpers.showWireframe'),
    },
  });

  return (
    <div className="flex-grow h-full bg-neutral-500 relative">
      <Leva collapsed />
      <Canvas 
        dpr={[1, 2]} 
        camera={{ position: [0, 1.5, 6] }} 
        style={{ position: "absolute" }}
        shadows
      >
        <color attach="background" args={[sceneControls.backgroundColor]} />
        <CameraUpdater fov={cameraControls.fov} />

        {/* Ánh sáng và Môi trường */}
        <ambientLight intensity={sceneControls.intensity / 2} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Environment preset={sceneControls.environment as EnvironmentPreset} />
        
        {/* Lưới nền có thể bật/tắt */}
        {helperControls.showGrid && (
          <Grid
            infiniteGrid
            position={[0, -0.5, 0]}
            sectionSize={1}
            cellSize={0.5}
            sectionColor={"#888888"}
            cellColor={"#555555"}
            fadeDistance={25}
            fadeStrength={1}
          />
        )}

        <Suspense fallback={<Loader />}>
          {/* Sử dụng component container mới */}
          <ModelRenderer 
            scale={modelControls.scale}
            rotation={modelControls.rotation}
            autoRotate={helperControls.autoRotate}
            showWireframe={helperControls.showWireframe}
            polyThickness={helperControls.polyThickness}
            polyColor={helperControls.polyColor}
          />
        </Suspense>
        
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default ViewPanel;