// src/lib/auth/client.ts
// let cachedUser: any | null = null;

export async function getCurrentUser(): Promise<any | null> {
  // if (cachedUser !== null) return cachedUser;

  try {
    const res = await fetch('/api/auth/me');
    if (!res.ok) return null;

    const user = await res.json();
    // cachedUser = user;
    return user;
  } catch (err) {
    console.error('取得使用者失敗', err);
    return null;
  }
}

