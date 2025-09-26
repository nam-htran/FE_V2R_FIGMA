// components/ViewerPanel.tsx

"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, useAnimations } from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Group } from "three"; // --- THÊM: Import kiểu 'Group' từ three.js ---

/**
 * Component "thông minh" có khả năng tải và tự động phát animation nếu có.
 * @param {object} props - Props cho component.
 * @param {string} props.url - Đường dẫn đến file model .glb/.gltf.
 */
function DynamicModel({ url }: { url: string }) {
  // --- SỬA LỖI: Chỉ định rõ 'group' là một Ref đến đối tượng 'Group' ---
  const group = useRef<Group>(null!); 
  
  // useGLTF sẽ tải cả scene và animations nếu có trong file
  const { scene, animations } = useGLTF(url);
  // useAnimations luôn được gọi, nhưng 'actions' sẽ là object rỗng nếu không có animation
  const { actions } = useAnimations(animations, group);

  // useEffect sẽ kiểm tra xem có animation nào để chạy không
  useEffect(() => {
    // CHỈ KHI có animation trong file (animations.length > 0) thì mới thực hiện
    if (actions && animations.length > 0) {
      const firstAnimationName = animations[0].name;
      // Chạy animation đầu tiên tìm thấy
      actions[firstAnimationName]?.reset().fadeIn(0.5).play();
      
      // Cleanup: Dừng animation khi component bị hủy
      return () => {
        actions[firstAnimationName]?.fadeOut(0.5);
      }
    }
  }, [actions, animations]);

  // 'ref' được gắn vào để useAnimations biết đối tượng nào cần animate
  return <primitive ref={group} object={scene} />;
}


/**
 * Component chính của trình xem.
 * Luôn có camera tự xoay, và sẽ phát animation của model nếu có.
 */
export function ViewerPanel({ modelUrl }: { modelUrl?: string | null }) {
  return (
    <Card className="h-full bg-card relative overflow-hidden shadow-sm">
      {modelUrl ? (
        // Nếu có modelUrl, hiển thị 3D Canvas
        <div className="absolute inset-0">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ fov: 50 }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.6}>
                <DynamicModel url={modelUrl} />
              </Stage>
            </Suspense>
            
            {/* OrbitControls LUÔN có autoRotate, áp dụng cho cả model tĩnh và động */}
            <OrbitControls
              makeDefault
              autoRotate
              autoRotateSpeed={0.8} // Tốc độ xoay
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>
      ) : (
        // Nếu không có model, hiển thị Placeholder
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <div className="flex gap-4">
            <div className="w-40 h-48 bg-background-subtle rounded-lg shadow-inner"></div>
            <div className="w-40 h-48 bg-background-subtle rounded-lg shadow-inner"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">3D Workspace</h3>
            <p className="text-muted-foreground text-sm">Your 3D model will appear here</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="bg-card" disabled>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" className="bg-card" disabled>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}