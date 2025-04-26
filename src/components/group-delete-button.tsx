'use client';

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface Props {
  groupId: string;
}

export function GroupDeleteButton({ groupId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirm = window.confirm("確定要刪除這筆團單嗎？");
    if (!confirm) return;

    startTransition(async () => {
      const res = await fetch(`/api/group/delete/${groupId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("刪除成功");
        router.refresh(); // 重新 fetch 資料
      } else {
        toast.error("刪除失敗");
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "刪除中..." : "刪除"}
    </Button>
  );
}
