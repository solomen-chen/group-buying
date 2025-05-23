// import { jwtDecode } from 'jwt-decode';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  
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
