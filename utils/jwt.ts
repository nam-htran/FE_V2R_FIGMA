// JWT Token Utilities

export interface DecodedToken {
  sub?: string; // subject (user id)
  email?: string;
  role?: string;
  roles?: string[];
  exp?: number; // expiration time
  iat?: number; // issued at
  [key: string]: any; // other custom claims
}

/**
 * Decode JWT token without verification (client-side only)
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get user role from token
 */
export function getUserRole(token: string): string | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Support both 'role' and 'roles' claims
  if (decoded.role) return decoded.role;
  if (decoded.roles && Array.isArray(decoded.roles) && decoded.roles.length > 0) {
    return decoded.roles[0];
  }

  return null;
}

/**
 * Get user email from token
 */
export function getUserEmail(token: string): string | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return decoded.email || decoded.sub || null;
}

/**
 * Get user full name from token
 */
export function getUserFullName(token: string): string | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return decoded.fullName || decoded.name || decoded.full_name || null;
}

/**
 * Get user display name (full name or email)
 */
export function getUserDisplayName(token: string): string | null {
  const fullName = getUserFullName(token);
  if (fullName) return fullName;
  
  return getUserEmail(token);
}

/**
 * Get user ID from token
 */
export function getUserId(token: string): string | number | null {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return decoded.userId || decoded.userID || decoded.id || decoded.sub || null;
}

/**
 * Check if user has specific role
 */
export function hasRole(token: string, role: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return false;

  // Check single role claim
  if (decoded.role && decoded.role.toLowerCase() === role.toLowerCase()) {
    return true;
  }

  // Check roles array
  if (decoded.roles && Array.isArray(decoded.roles)) {
    return decoded.roles.some((r) => r.toLowerCase() === role.toLowerCase());
  }

  return false;
}

/**
 * Store token in localStorage
 */
export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

/**
 * Remove token from localStorage
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}
