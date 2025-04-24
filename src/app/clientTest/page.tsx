'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import type { DecodedToken } from '@/lib/auth'; // ✅ 加上這行！

export default function ClientPage() {
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) return <div>請先登入</div>;
  return <div>你好，{user.name}</div>;
}
