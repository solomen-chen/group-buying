// src/app/group/create/page.tsx
import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth/server';
import GroupCreateForm from './GroupCreateForm';

export default async function GroupCreatePage() {
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">開團作業   ( {user.name} )</h1>
      
      {/* <GroupCreateForm ownerId={user.userId} /> */}
      <GroupCreateForm />
    </main>
  );
}
