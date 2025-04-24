import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  
}

// Client-side：從 cookie 中取 token 再 decode（不驗證）
export function getTokenFromClientCookies(): string | null {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='));
  return match ? match.split('=')[1] : null;
}

export function getCurrentUser(): DecodedToken | null {
  try {
    const token = getTokenFromClientCookies();
    if (!token) return null;
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch {
    return null;
  }
}

// Server-side：從 headers 讀 cookie + 用密鑰驗證 token
export async function getServerUser(): Promise<DecodedToken | null> {
  try {
    const cookiesData = await cookies();
    const token = cookiesData.get('token')?.value;
    if (!token) return null;

    // 替換為你的 JWT 密鑰
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET 尚未設定');

    const verified = jwt.verify(token, secret) as DecodedToken;
    return verified;
  } catch {
    return null;
  }
}
