// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import GroupOrder from "@/models/GroupOrder";
import mongoose from "mongoose";

interface GroupOrderRecord {
  _id: mongoose.Types.ObjectId;
  groupname: string;
  createdAt: Date;
  deadline: Date;
  status: string;
}
import "@/lib/mongodb"; // 確保 mongoose 連線

export default async function DashboardPage() {
  const user = await getServerUser();
  // const records = await GroupOrder.find<GroupOrderRecord>({ ownerId: user.userId }).lean();
  if (!user) {
    redirect("/login");
    return null;
  }

  // 取得目前使用者的開團紀錄
  await mongoose.connect(process.env.MONGODB_URI!);
  // const records = await GroupOrder.find({ ownerId: user.userId }).lean();
  const records = await GroupOrder.find<GroupOrderRecord>({ ownerId: user.userId }).lean();

  const now = new Date();
  const updatedRecords = await Promise.all(
    records.map(async (record) => {
      let status = record.status;
      if (status === "open" && new Date(record.deadline) < now) {
        // 更新狀態為 closed
        await GroupOrder.updateOne({ _id: record._id }, { status: "closed" });
        status = "closed";
      }

      return {
        _id: (record._id as mongoose.Types.ObjectId).toString(),
        groupname: record.groupname,
        createdAt: new Date(record.createdAt).toLocaleDateString(),
        deadline: new Date(record.deadline).toLocaleDateString(),
        status,
      };
    })
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">[團主]: {user.name}</h1>
        <LogoutButton />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">開團記錄列表:</h2>

      <div className="space-y-4">
        {updatedRecords.map((r) => (
          <div
            key={r._id}
            className="border rounded-xl p-4 flex items-center justify-between shadow-sm"
          >
            <div className="space-y-1">
              <p>
                <strong>團名:</strong> {r.groupname}
              </p>
              <p>
                <strong>開團日:</strong> {r.createdAt}
              </p>
              <p>
                <strong>結單日:</strong> {r.deadline}
              </p>
              <p>
                <strong>狀態:</strong>{" "}
                <span
                  className={
                    r.status === "closed"
                      ? "text-red-600 font-bold"
                      : "text-blue-600"
                  }
                >
                  {r.status}
                </span>
              </p>
              <p>
                <strong>訂單數目:</strong> (待實作)
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">修改</Button>
              <Button variant="destructive">刪除</Button>
            </div>
          </div>
        ))}
      </div>

      <Link href="/group/create">
        <Button className="mt-6">建立新團單</Button>
      </Link>
    </div>
  );
}
