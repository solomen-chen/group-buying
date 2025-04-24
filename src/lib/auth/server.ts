// src/lib/auth/server.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface DecodedToken {
  userId: string;
  email: string;
  name: string;
}

export async function getServerUser(): Promise<DecodedToken | null> {
  try {
    const cookiesData = await cookies();
    const token = cookiesData.get('token')?.value;
    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET 尚未設定');

    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch {
    return null;
  }
}
