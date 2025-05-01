// src/app/group/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { getServerUser } from "@/lib/auth/server";
import GroupOrder from "@/models/GroupOrder";
import mongoose from "mongoose";
import {GroupForm} from "@/components/group-form";
import "@/lib/mongodb"; // 確保 mongoose 連線

interface PickupOption {
  time: string;
  location: string;
}

type Product = {
  name: string;
  spec: string;
  price: string;
  supply: string;
  imageUrl: string;
};

// interface GroupFormProps {
//   mode: "edit" | "create";
//   groupId: string;
//   defaultValues?: {
//     groupname: string;
//     deadline: string;
//     pickupOptions: PickupOption[];
//     products: Product[];
//   };
// }

export default async function EditGroupPage({ params }: { params: { id: string } }) {
  const user = await getServerUser();
  if (!user) notFound();

  await mongoose.connect(process.env.MONGODB_URI!);

  const group = await GroupOrder.findOne({ _id: params.id, ownerId: user.userId }).lean() as {
    groupname?: string;
    deadline?: string;
    pickupOptions?: PickupOption[];
    products?: Product[];
  } | null;
  if (!group) notFound();

  const defaultValues = {
    groupname: group.groupname || "",
    deadline: group.deadline ? new Date(group.deadline).toISOString().split("T")[0] : "",
    pickupOptions: (group.pickupOptions || []).filter(
      (o: PickupOption) => o.time && o.location
    ),
    products: (group.products || []).filter(
      (p: Product) => p.name
    ),
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">編輯團單</h1>
      <GroupForm
        mode="edit"
        groupId={params.id}
        defaultValues={defaultValues}
      />
    </div>
  );
}
