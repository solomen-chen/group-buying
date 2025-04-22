'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchTokenAndDecode = async () => {
      try {
        const res = await fetch('/api/auth/profile');
        const data = await res.json();

        if (res.ok && data.name) {
          setUserName(data.name);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('取得使用者資料失敗', error);
        router.push('/login');
      }
    };

    fetchTokenAndDecode();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white text-gray-700">
      <h1 className="text-2xl font-bold mb-4">歡迎回來，{userName || '使用者'}！</h1>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        登出
      </button>
    </div>
  );
}
