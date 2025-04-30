// src/components/group-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface GroupFormProps {
  mode: "create" | "edit";
  initialData?: {
    groupname: string;
    deadline: string; // ISO 格式
    pickupOptions?: { time: string; location: string }[]; // 編輯時需要
    status?: string; // 編輯時需要
    ownerId?: string; // 編輯時需要
  };
  groupId?: string; // 編輯時需要
}

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

export function GroupForm({ mode, initialData, groupId }: GroupFormProps) {
  const router = useRouter();

  const [groupname, setgroupname] = useState('');
    const [deadline, setDeadline] = useState('');
    const [pickupOptions, setPickupOptions] = useState<PickupOption[]>([{ time: '', location: '' }]);
    const [products, setProducts] = useState<Product[]>([{
      name: "",
      spec: "",
      price: "",
      supply: "",
      imageUrl: "",
  }]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    
    const payload = { groupname, deadline, pickupOptions, products, ownerId: "" }; // 這裡可以根據需要添加其他欄位



    if (mode === "create") {
      // 建立新團單
      await fetch("/api/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else if (mode === "edit" && groupId) {
      // 更新舊的團單
      await fetch(`/api/group/edit/${groupId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    router.push("/dashboard"); // 送出後回到 dashboard
    router.refresh(); // 強制重新讀取 dashboard 資料
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">團名</label>
        <input
          type="text"
          value={groupname}
          onChange={(e) => setgroupname(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block mb-1">結單日</label>
        <input
          type="date"
          value={deadline.split("T")[0]} // 只取日期部分
          onChange={(e) => setDeadline(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <Button type="submit">{mode === "create" ? "建立團單" : "更新團單"}</Button>
    </form>
  );
}
