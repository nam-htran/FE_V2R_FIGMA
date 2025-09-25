// components/ModelViewer.tsx
"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";

// Component con để tải và hiển thị model
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Component chính của trình xem
export default function ModelViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 50 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        {/* contactShadow không còn, thay bằng shadows={false} nếu muốn tắt hẳn shadow */}
        <Stage environment="city" intensity={0.5} shadows={false}>
          <Model url={modelUrl} />
        </Stage>
      </Suspense>
      <OrbitControls
        makeDefault
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
}
