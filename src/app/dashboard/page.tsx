// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect('/login'); // 未登入跳轉
    return null; // Prevent further rendering
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">歡迎 {user.name}！</h1>
      <p>您的 user ID 是：{user.userId}</p>
      <Link href="./group/create">
        <Button className="mt-6 ml-6">建立新團單</Button>
      </Link>
    </div>
  );
}
