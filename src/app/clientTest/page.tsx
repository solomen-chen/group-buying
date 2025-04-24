'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ClientPage() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  if (!user) return <div>請先登入</div>;

  return (
  <div>你好，{user.name}
  <p>您的 user ID 是：{user.userId}</p>
      <Link href="./login">
        <Button className="mt-6 ml-6">回登入頁</Button>
      </Link></div>
);
}
