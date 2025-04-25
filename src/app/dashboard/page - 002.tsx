// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
    return null;
  }

  // 這裡先假資料示意開團清單
  const mockGroupOrders = [
    {
      id: "1",
      name: "中秋烤肉團",
      startDate: "2025-04-10",
      deadline: "2025-04-20",
      status: "open",
      orderCount: "-", // 先預留
    },
    {
      id: "2",
      name: "端午粽子團",
      startDate: "2025-03-01",
      deadline: "2025-03-15",
      status: "close",
      orderCount: "-",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">[團主]: {user.name}</h1>
        <LogoutButton />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">開團記錄列表:</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">團名</th>
                <th className="border px-3 py-2 text-left">開團日</th>
                <th className="border px-3 py-2 text-left">結單日</th>
                <th className="border px-3 py-2 text-left">狀態</th>
                <th className="border px-3 py-2 text-left">訂單數目</th>
                <th className="border px-3 py-2">修改</th>
                <th className="border px-3 py-2">刪除</th>
              </tr>
            </thead>
            <tbody>
              {mockGroupOrders.map((group) => (
                <tr key={group.id}>
                  <td className="border px-3 py-2">{group.name}</td>
                  <td className="border px-3 py-2">{group.startDate}</td>
                  <td className="border px-3 py-2">{group.deadline}</td>
                  <td className="border px-3 py-2 capitalize">{group.status}</td>
                  <td className="border px-3 py-2 text-center">{group.orderCount}</td>
                  <td className="border px-3 py-2 text-center">
                    <Button variant="outline" size="sm">
                      修改
                    </Button>
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <Button variant="destructive" size="sm">
                      刪除
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Link href="./group/create">
        <Button>建立新團單</Button>
      </Link>
    </div>
  );
}
