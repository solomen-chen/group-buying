// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    if (!email || !password) {
      setMessage('請填寫 Email 和密碼');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || '登入失敗');
      } else {
        setMessage(`✅ ${data.message}`);
        router.push("/dashboard");
        // 可以導向後台或首頁，如：
        // router.push('/dashboard');
      }
    } catch (err) {
      setMessage('登入時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-gray-500 ">登入</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-3 p-2 border rounded text-gray-500 placeholder-gray-400"
      />

        <div className="relative mb-3">
        <input
            type={showPassword ? 'text' : 'password'}
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 border rounded text-gray-500 placeholder-gray-400"
        />
        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-800 cursor-pointer "
        >
            {showPassword ? <EyeOff size={30} /> : <Eye size={30} />}
        </button>
        </div>


      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? '登入中...' : '登入'}
      </button>

      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </div>
  );
}
