// ===== .\src\utils\modelConverter.ts =====
import * as THREE from 'three';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

// Hàm helper để kích hoạt việc tải file xuống trên trình duyệt
const triggerDownload = (url: string, filename: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Dọn dẹp blob URL sau khi tải
};

/**
 * Tải xuống một model, chuyển đổi định dạng nếu cần.
 * @param modelUrl URL của tệp GLB (thường là một blob URL).
 * @param format Định dạng mong muốn ('glb' hoặc 'stl').
 * @param filename Tên file không bao gồm phần mở rộng.
 */
export const convertAndDownloadModel = async (
  modelUrl: string,
  format: 'glb' | 'stl',
  filename: string = 'model'
) => {
  if (format === 'glb') {
    // Nếu chỉ cần tải GLB, không cần xử lý gì thêm
    triggerDownload(modelUrl, `${filename}.glb`);
    return;
  }

  if (format === 'stl') {
    // Quá trình chuyển đổi sang STL
    try {
      const loader = new GLTFLoader();
      const exporter = new STLExporter();

      // === SỬA LỖI: Tải dữ liệu từ blob URL và parse trực tiếp ===
      // 1. Fetch dữ liệu từ blob URL để lấy ArrayBuffer
      const response = await fetch(modelUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch model data. Status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // 2. Parse ArrayBuffer thay vì dùng loadAsync(url)
      const gltf = await new Promise<GLTF>((resolve, reject) => {
        loader.parse(arrayBuffer, '', resolve, reject);
      });
      // === KẾT THÚC SỬA LỖI ===

      // Trích xuất scene và chuyển đổi sang định dạng STL (dạng text)
      const stlString = exporter.parse(gltf.scene, { binary: false });

      // Tạo một Blob từ chuỗi STL
      const blob = new Blob([stlString], { type: 'application/sla' });

      // Tạo URL cho Blob và kích hoạt tải xuống
      const stlUrl = URL.createObjectURL(blob);
      triggerDownload(stlUrl, `${filename}.stl`);
    } catch (error) {
      console.error('Failed to convert GLB to STL:', error);
      alert('An error occurred while converting the model to STL format.');
    }
  }
};