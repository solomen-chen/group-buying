// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: '未提供 token' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; name: string };

    return NextResponse.json({
      userId: decoded.userId,
      name: decoded.name,
    });
  } catch (err) {
    return NextResponse.json({ message: '無效的 token' }, { status: 401 });
  }
}
