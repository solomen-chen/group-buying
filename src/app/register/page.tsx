// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Toaster, toast } from 'sonner'

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setMessage('');

    if (!email || !password || !name) {
      toast.error('請填寫所有欄位');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        // setMessage(data.message || '註冊失敗');
        toast.error(data.message || '註冊失敗');
      } else {
        // setMessage(`✅ ${data.message}`);
        toast.success(`✅ ${data.message}`);
        setTimeout(() => router.push('/dashboard'), 2000); // 2秒後自動導向
        // router.push('/dashboard'); // 自動導向
      }
    } catch (err) {
      // setMessage('註冊時發生錯誤');
      toast.error('註冊時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" closeButton={false} expand={false} />
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">註冊新帳號</h2>

        <label className="block mb-1 text-blue-600 font-bold ">姓名</label>
        <input
          type="text"
          placeholder="姓名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border rounded text-gray-500 placeholder-gray-400"
        />
        <label className="block mb-1 text-blue-600 font-bold">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded text-gray-500 placeholder-gray-400"
        />

        <label className="block mb-1 text-blue-600 font-bold">密碼</label>

        <div className="relative mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 border rounded text-gray-500 placeholder-gray-400  "
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800 cursor-pointer"
          >
            {showPassword ? <EyeOff size={30} /> : <Eye size={30} />}
          </button>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? '註冊中...' : '註冊'}
        </button>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </div>
    </>
  );
}
