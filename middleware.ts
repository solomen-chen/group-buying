// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'; // 跟 login 時用的 secret 一樣

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

  try {
    if (token) {
      jwt.verify(token, JWT_SECRET);

      // 若已登入，且在登入頁或註冊頁 → 導向 /dashboard
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // 已登入且在其他地方就正常放行
      return NextResponse.next();
    } else {
      // 沒有 token
      if (isDashboardPage) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      return NextResponse.next();
    }
  } catch (err) {
    // token 無效或過期 → 強制跳轉登入頁
    if (isDashboardPage) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  }
  
}
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
};

