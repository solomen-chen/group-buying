// src/app/dashboard/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'; // 記得這跟登入那邊一致

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let userName = '';

  if (token) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      userName = decoded.name;
    } catch (err) {
      console.error('JWT 驗證失敗:', err);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white text-gray-700">
      <h1 className="text-2xl font-bold mb-4">歡迎回來，{userName || '使用者'}！</h1>
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          登出
        </button>
      </form>
    </div>
  );
}
