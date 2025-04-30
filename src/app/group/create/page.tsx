// src/app/group/create/page.tsx
import { GroupForm } from "@/components/group-form";

export default function CreateGroupPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">建立新團單</h1>
      <GroupForm mode="create" />
    </div>
  );
}
