// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'; // 建議放在 .env

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email 與密碼皆為必填' }, { status: 400 });
  }

  await connectToDatabase();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ message: '帳號不存在' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ message: '密碼錯誤' }, { status: 401 });
  }

  // 產生 JWT token
  const token = jwt.sign(
    { userId: user.id, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 建立 response 並設定 HttpOnly cookie
  const res = NextResponse.json(
    { message: '登入成功' ,
         user: {
                id: user._id,
                name: user.name,
                email: user.email,
               }
    }
  )
                

  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 天
    path: '/',
  });

  return res;
}
