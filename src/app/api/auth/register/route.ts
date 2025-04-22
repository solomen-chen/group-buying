// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ message: '所有欄位皆為必填' }, { status: 400 });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ message: 'Email 格式不正確' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ message: '密碼需至少 6 字元' }, { status: 400 });
  }

  await connectToDatabase();
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json({ message: '此 Email 已被註冊' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    name,
    password: hashedPassword,
  });

  // 註冊後自動登入（設定 JWT cookie）
  const token = jwt.sign({ userId: newUser.id, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

  const response = NextResponse.json({ message: '註冊成功' });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
