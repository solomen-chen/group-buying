// src/app/group/create/GroupCreateForm.tsx
// This file is part of the project "Group Order System".

'use client';

import { useState } from 'react';
import { getCurrentUser } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PickupOption {
  time: string;
  location: string;
}

interface Product {
  name: string;
  spec: string;
  imageUrl: string;
  price: number;
  supply: number;
}

export default function GroupCreateForm() {
  const router = useRouter();
  const [groupname, setgroupname] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pickupOptions, setPickupOptions] = useState<PickupOption[]>([{ time: '', location: '' }]);
  const [products, setProducts] = useState<Product[]>([{
    name: '',
    spec: '',
    imageUrl: '',
    price: 0,
    supply: 0
  }]);
  const [supplyInputTouched, setSupplyInputTouched] = useState<boolean[]>([false]);
  const [submitting, setSubmitting] = useState(false);

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
    setProducts([...products, { name: '', spec: '', imageUrl: '', price: 0, supply: 0 }]);
    setSupplyInputTouched([...supplyInputTouched, false]);
  };

  const removeProduct = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
    const supplyUpdated = [...supplyInputTouched];
    supplyUpdated.splice(index, 1);
    setSupplyInputTouched(supplyUpdated);
  };

  const markSupplyTouched = (index: number) => {
    setSupplyInputTouched((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const updateProduct = <K extends keyof Product>(index: number, field: K, value: Product[K]) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const handleSubmit = async () => {
    if (!groupname || !deadline || products.length === 0 || pickupOptions.length === 0) {
      toast.error('請完整填寫所有欄位');
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
          pickupOptions,
          products,
          ownerId: user.userId
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || '建立失敗');

      toast.success('開團成功');
      router.push(`/group/${result.groupId}`);
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

      <div className="mb-4">
        <label className="block font-semibold mb-2">商品</label>
        {products.map((product, idx) => (
          <div key={idx} className="border rounded-xl p-4 mb-4 bg-gray-50">
            <input
              type="text"
              placeholder="名稱"
              value={product.name}
              onChange={(e) => updateProduct(idx, 'name', e.target.value)}
              required
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="規格"
              value={product.spec}
              onChange={(e) => updateProduct(idx, 'spec', e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="圖片網址"
              value={product.imageUrl}
              onChange={(e) => updateProduct(idx, 'imageUrl', e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="價格"
              value={product.price === 0 ? '' : product.price}
              onChange={(e) => updateProduct(idx, 'price', e.target.value === '' ? 0 : Number(e.target.value))}
              required
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              placeholder="供應量 (0 表示無限）"
              value={product.supply === 0 && supplyInputTouched[idx] === false ? '' : product.supply}
              onChange={(e) => {
                const value = e.target.value;
                updateProduct(idx, 'supply', value === '' ? 0 : Number(value));
                markSupplyTouched(idx);
              }}
              required
              className="border p-2 w-full mb-2"
            />
            {products.length > 1 && (
              <button
                type="button"
                onClick={() => removeProduct(idx)}
                className="text-red-600 text-sm"
              >
                刪除商品
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addProduct}
          className="mt-2 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          新增商品
        </button>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {submitting ? '建立中...' : '建立團單'}
      </button>
    </div>
  );
}
