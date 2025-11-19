// ===== .\src\app\api\get-backend-url\route.ts =====
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Khởi tạo Redis client từ biến môi trường
// QUAN TRỌNG: Các biến này phải được đặt trong tệp .env.local của bạn
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

// Đảm bảo route này không bị cache và luôn lấy dữ liệu mới nhất
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Lấy URL từ key 'active_ai_service_url' trong Redis
    const url = await redis.get('active_ai_service_url');

    if (!url) {
      return NextResponse.json(
        { error: 'Backend service URL not found in Redis.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error fetching backend URL from Redis:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Redis and fetch backend URL.' },
      { status: 500 }
    );
  }
}