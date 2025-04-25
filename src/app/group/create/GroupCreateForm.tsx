// src/app/group/create/GroupCreateForm.tsx
// This file is part of the project "Group Order System".

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { v4 as uuidv4 } from "uuid";

import Image from "next/image";

type Product = {
  name: string;
  spec: string;
  price: string;
  supply: string;
  imageUrl: string;
};

export default function GroupCreateForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateProduct = (
    index: number,
    field: keyof Product,
    value: string
  ) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "solomen");

    setUploadingIndex(index);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dasjcpmcg/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        updateProduct(index, "imageUrl", data.secure_url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingIndex(null);
    }
  };

  const addProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        spec: "",
        price: "",
        supply: "",
        imageUrl: "",
      },
    ]);
  };

  return (
    <div className="space-y-8">
      {products.map((product, index) => (
        <div
          key={index}
          className="border rounded-xl p-4 shadow-md space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>商品名稱</Label>
              <Input
                value={product.name}
                onChange={(e) =>
                  updateProduct(index, "name", e.target.value)
                }
              />
            </div>
            <div>
              <Label>規格 / 說明</Label>
              <Input
                value={product.spec}
                onChange={(e) =>
                  updateProduct(index, "spec", e.target.value)
                }
              />
            </div>
            <div>
              <Label>價格</Label>
              <Input
                type="number"
                value={product.price}
                onChange={(e) =>
                  updateProduct(index, "price", e.target.value)
                }
              />
            </div>
            <div>
              <Label>供應數量 (0 表示無限)</Label>
              <Input
                type="number"
                value={product.supply}
                onChange={(e) =>
                  updateProduct(index, "supply", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <Label>商品圖片</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, index)}
            />

            {uploadingIndex === index && (
              <div className="flex items-center space-x-2 text-sm text-blue-600 mt-2">
                <Loader2 className="animate-spin w-4 h-4" />
                <span>上傳中...</span>
              </div>
            )}

            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt="上傳圖片"
                width={200}
                height={200}
                className="rounded-xl mt-2"
              />
            )}
          </div>
        </div>
      ))}

      <Button type="button" onClick={addProduct}>
        新增商品
      </Button>
    </div>
  );
}
