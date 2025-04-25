"use client";

// import { redirect } from "next/navigation"; // optional if using useRouter
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login"); // 導回登入頁
  };

  return (
    <form onSubmit={handleLogout}>
      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        登出
      </button>
    </form>
  );
}
