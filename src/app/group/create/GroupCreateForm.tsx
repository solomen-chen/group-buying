// src/app/group/create/GroupCreateForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ProductInput {
  name: string;
  image: string;
  spec: string;
  price: string;
  supply: string;
}

interface Props {
  ownerId: string;
}

export default function GroupCreateForm({ ownerId }: Props) {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pickupOptions, setPickupOptions] = useState<string[]>(['']);
  const [products, setProducts] = useState<ProductInput[]>([
    { name: '', image: '', spec: '', price: '', supply: '' },
  ]);

  const handlePickupChange = (index: number, value: string) => {
    const updated = [...pickupOptions];
    updated[index] = value;
    setPickupOptions(updated);
  };

  const addPickupOption = () => setPickupOptions([...pickupOptions, '']);

  const handleProductChange = (index: number, field: keyof ProductInput, value: string) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', image: '', spec: '', price: '', supply: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/group/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          deadline,
          pickupOptions: pickupOptions.filter(p => p.trim() !== ''),
          ownerId,
          products,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || '建立失敗');

      toast.success('團單建立成功');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || '錯誤發生');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-semibold">團購名稱</label>
        <input
          className="w-full border p-2 rounded"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">截止日期</label>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">自取時間/地點</label>
        {pickupOptions.map((opt, idx) => (
          <input
            key={idx}
            className="w-full border p-2 rounded mb-2"
            value={opt}
            onChange={(e) => handlePickupChange(idx, e.target.value)}
          />
        ))}
        <button type="button" className="text-blue-500" onClick={addPickupOption}>
          + 新增自取選項
        </button>
      </div>

      <div>
        <label className="block font-semibold">商品項目</label>
        {products.map((p, idx) => (
          <div key={idx} className="border p-4 mb-4 rounded space-y-2">
            <input
              className="w-full border p-2 rounded"
              placeholder="商品名稱"
              value={p.name}
              onChange={(e) => handleProductChange(idx, 'name', e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="圖片 URL"
              value={p.image}
              onChange={(e) => handleProductChange(idx, 'image', e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="說明"
              value={p.spec}
              onChange={(e) => handleProductChange(idx, 'spec', e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="價格"
              type="number"
              value={p.price}
              onChange={(e) => handleProductChange(idx, 'price', e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="供應數量 (0 表示無限)"
              type="number"
              value={p.supply}
              onChange={(e) => handleProductChange(idx, 'supply', e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="text-blue-500" onClick={addProduct}>
          + 新增商品
        </button>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        建立團單
      </button>
    </form>
  );
}
