// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: '未登入' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; name: string };
    return NextResponse.json({ userId: decoded.userId, name: decoded.name });
  } catch (err) {
    return NextResponse.json({ message: 'Token 無效' }, { status: 401 });
  }
}
