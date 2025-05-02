// src/app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/auth/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import GroupOrder from "@/models/GroupOrder";
import mongoose from "mongoose";
import { GroupDeleteButton } from "@/components/group-delete-button";

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
        createdAt: new Date(record.createdAt).toLocaleDateString('zh-TW'),
        deadline: new Date(record.deadline).toLocaleDateString('zh-TW'),
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
              {updatedRecords.map((group) => (
                <tr key={group._id}>
                  <td className="border px-3 py-2">{group.groupname}</td>
                  <td className="border px-3 py-2">
                      {group.createdAt}                      
                  </td> 
                  <td className="border px-3 py-2">
                      {group.deadline}
                  </td>
                  <td className="border px-3 py-2 capitalize">
                    <span className={group.status === 'closed' ? 'text-red-600 font-bold' : 'text-blue-600'}>
                      {group.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-center">(待完成)</td>
                  <td className="border px-3 py-2 text-center">
                      <Link href={`/group/edit/${group._id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-white-600 hover:cursor-pointer">
                              修改
                          </Button>
                      </Link>
                  </td>
                  <td className="border px-3 py-2 text-center ">
                      {/* [刪除鈕] */}
                      <GroupDeleteButton groupId={group._id} /> 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      <Link href="/group/create">
        <Button className="mt-6">建立新團單</Button>
      </Link>
    </div>
  );
}
