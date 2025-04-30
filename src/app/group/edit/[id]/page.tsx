// src/app/group/edit/[id]/page.tsx
import { GroupForm } from "@/components/group-form";
import GroupOrder from "@/models/GroupOrder";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import "@/lib/mongodb"; // 確保 mongoose 連線

interface Props {
  params: { id: string };
}

export default async function EditGroupPage({ params }: Props) {
  const { id } = params;

  // 驗證 id 是否正確
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  const group = await GroupOrder.findById(id).lean() as {
    groupname: string;
    deadline: string | Date;
    pickupOptions: { time: string; location: string }[];
    status: string;
    ownerId: string;   

  } | null;

  if (!group) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">編輯團單</h1>
      <GroupForm
        mode="edit"
        groupId={id}
        initialData={{
          groupname: group.groupname,
          deadline: new Date(group.deadline).toISOString(),
          pickupOptions: group.pickupOptions.map((option) => ({
              time: option.time,
              location: option.location,
            })),
          status: group.status,
          ownerId: group.ownerId,
        }}

      />
    </div>
  );
}
