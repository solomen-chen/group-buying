// src/components/image-upload.tsx 
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  initialImage?: string;
  onImageUploaded: (url: string) => void;
}

export default function ImageUpload({ initialImage, onImageUploaded }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialImage || "");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "solomen"); // ← 替換為你的 Cloudinary unsigned preset 名稱

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dasjcpmcg/image/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const secureUrl = data.secure_url;

      setImageUrl(secureUrl);
      onImageUploaded(secureUrl);
      toast.success("圖片上傳成功");
    } catch (err) {
      console.error(err);
      toast.error("圖片上傳失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="預覽圖"
          width={200}
          height={200}
          className="rounded-md object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={loading}
        className="block"
      />
      {loading && <p className="text-sm text-gray-500">上傳中...</p>}
    </div>
  );
}
