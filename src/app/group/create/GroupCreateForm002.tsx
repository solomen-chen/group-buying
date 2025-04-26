// src/app/group/create/GroupCreateForm.tsx
// This file is part of the project "Group Order System".

'use client';

import { useState } from 'react';
import { getCurrentUser } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";

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

export default function GroupCreateForm() {
  const router = useRouter();
  const [groupname, setgroupname] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pickupOptions, setPickupOptions] = useState<PickupOption[]>([{ time: '', location: '' }]);
  // const [products, setProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([{
    name: "",
    spec: "",
    price: "",
    supply: "",
    imageUrl: "",
}]);
  
  const [supplyInputTouched, setSupplyInputTouched] = useState<boolean[]>([false]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const addPickupOption = () => {
    setPickupOptions([...pickupOptions, { time: '', location: '' }]);
  };

  const removePickupOption = (index: number) => {
    const updated = [...pickupOptions];
    updated.splice(index, 1);
    setPickupOptions(updated);
  };
  

  const updatePickupOption = <K extends keyof PickupOption>(index: number, field: K, value: PickupOption[K]) => {
    const updated = [...pickupOptions];
    updated[index][field] = value;
    setPickupOptions(updated);
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

  // const removeProduct = (index: number) => {
  //   const updated = [...products];
  //   updated.splice(index, 1);
  //   setProducts(updated);
  //   const supplyUpdated = [...supplyInputTouched];
  //   supplyUpdated.splice(index, 1);
  //   setSupplyInputTouched(supplyUpdated);
  // };

  // const markSupplyTouched = (index: number) => {
  //   setSupplyInputTouched((prev) => {
  //     const copy = [...prev];
  //     copy[index] = true;
  //     return copy;
  //   });
  // };

  
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
  // if (!groupname || !deadline || !pickupOptions?.length || !ownerId || !products?.length) {
  //       return NextResponse.json({ message: '欄位不可為空' }, { status: 400 });
  //     }

  const handleSubmit = async () => {
    if ( !groupname){toast.error('請填寫團名');return;}
    if ( !deadline){toast.error('請填寫結單日期');return;}
    // 過濾掉空的取貨選項
    const validPickupOptions = pickupOptions.filter(option => option.time && option.location);
  
    if (validPickupOptions.length === 0) {
      toast.error('請至少添加一個有效的取貨時段與地點');
      return;
    }
    
    // 過濾掉空的商品
    const validProducts = products.filter(p => p.name );
  
    if (validProducts.length === 0) {
      toast.error('請至少添加一個有效商品');
      return;
    }
    

    setSubmitting(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('尚未登入');

      console.log('送出的資料:', {
        groupname,
        deadline,
        pickupOptions,
        ownerId: user.userId,
        products,
      });
      

      const res = await fetch('/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupname,
          deadline,          
          pickupOptions: validPickupOptions,
          products: validProducts,
          ownerId: user.userId
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || '建立失敗');

      toast.success('開團成功');
      // router.push(`/group/${result.groupId}`);
      router.push("/dashboard")
      
    } catch (err: any) {
      toast.error(err.message || '開團失敗');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">建立團單</h1>

      <input
        type="text"
        placeholder="團單名稱"
        value={groupname}
        onChange={(e) => setgroupname(e.target.value)}
        required
        className="border p-2 w-full mb-4"
      />

      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
        className="border p-2 w-full mb-4"
      />

      <div className="mb-4">
        <label className="block font-semibold mb-2">取貨時段與地點</label>
        {pickupOptions.map((option, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="時間"
              value={option.time}
              onChange={(e) => updatePickupOption(idx, 'time', e.target.value)}
              required
              className="border p-2 w-full"
            />
            <input
              type="text"
              placeholder="地點"
              value={option.location}
              onChange={(e) => updatePickupOption(idx, 'location', e.target.value)}
              required
              className="border p-2 w-full"
            />
            {pickupOptions.length > 1 && (
              <button
                type="button"
                onClick={() => removePickupOption(idx)}
                className="text-red-600"
              >
                刪除
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addPickupOption}
          className="mt-2 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          新增取貨時段與地點
        </button>
      </div>

      {/* //以下為團購商品..... */}

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
      
                    {!product.imageUrl ? (
                      <div>
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
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image
                          src={product.imageUrl}
                          alt="商品圖片"
                          width={200}
                          height={200}
                          className="rounded-xl"
                        />
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              // 點更換 -> 觸發 input 點擊
                              document.getElementById(`imageInput-${index}`)?.click();
                            }}
                          >
                            更換
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              if (window.confirm("確定要刪除此圖片嗎？")) {
                                updateProduct(index, "imageUrl", "");
                              }
                            }}
                            
                          >
                            刪除
                          </Button>
                        </div>
                        {/* 隱藏實體 input 供更換用 */}
                        <Input
                          id={`imageInput-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, index)}
                          className="hidden"
                        />
                      </div>
                    )}
                </div>
              </div>
            ))}
      
            <Button type="button" onClick={addProduct}>
              新增商品
            </Button>
          </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-10"
      >
        {submitting ? '建立中...' : '建立團單'}
      </button>
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded ml-10"
      >
        放棄編輯
      </button>
    </div>
  );
}
