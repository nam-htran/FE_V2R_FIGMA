// ===== .\i18n\routing.ts =====
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  pathnames: {
    // Các đường dẫn đã có
    '/': '/',
    '/pathnames': {
      vi: '/pfadnamen'
    },

    // --- BỔ SUNG CÁC ĐƯỜNG DẪN MỚI TẠI ĐÂY ---
    '/login': '/login',
    '/register': '/register',
    '/forgot-password': '/forgot-password',
    '/terms': '/terms',
    '/privacy': '/privacy',
    '/confirm': '/confirm',
    '/profile': '/profile',
    
    // Thêm luôn các đường dẫn từ Header và Footer để tránh lỗi sau này
    '/community': '/community',
    '/features': '/features',
    '/pricing': '/pricing',
    '/start': '/start',
    '/plugin': '/plugin',
    '/status': '/status',
    '/about': '/about',
    '/contact': '/contact',
    '/workspace': '/workspace',

    // Dashboard routes
    '/dashboard': '/dashboard',
    "/dashboard/orders": "/dashboard/orders",
    '/dashboard/users': '/dashboard/users',
    '/dashboard/status': '/dashboard/status',
    '/dashboard/reports': '/dashboard/reports',
    '/dashboard/console': '/dashboard/console',
    '/dashboard/customers': '/dashboard/customers',
    '/dashboard/transactions': '/dashboard/transactions',
    '/dashboard/revenue': '/dashboard/revenue',
    '/dashboard/notifications': '/dashboard/notifications',
  }
});