'use client';

import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/auth';

interface Product {
  name: string;
  image: string;
  spec: string;
  price: string;
  supply: string;
}

interface DecodedToken {
  userId: string;
  email: string;
  name: string;
  
}

export default function GroupCreatePage() {
  const [groupName, setGroupName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pickupOptions, setPickupOptions] = useState<string[]>(['']);
  const [products, setProducts] = useState<Product[]>([{ name: '', image: '', spec: '', price: '', supply: '' }]);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) return <div>請先登入</div>;
  return <div>你好，{user.name}</div>;

  const handleProductChange = (index: number, field: keyof Product, value: string) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handlePickupOptionChange = (index: number, value: string) => {
    const newOptions = [...pickupOptions];
    newOptions[index] = value;
    setPickupOptions(newOptions);
  };

  const addPickupOption = () => {
    setPickupOptions([...pickupOptions, '']);
  };

  const handleSubmit01 = async () => {
    if (!ownerId) return alert('尚未取得使用者 ID');

    const res = await fetch('/api/group/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupName, deadline, pickupOptions, ownerId, products })
    });

    const data = await res.json();
    if (res.ok) alert('建立成功');
    else alert('建立失敗: ' + data.message);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">建立新團單</h1>

      <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="團名" className="mb-2" />
      <Input value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="截止時間" className="mb-2" />

      <h2 className="font-semibold mt-4">取貨時間地點</h2>
      {pickupOptions.map((option, i) => (
        <Input
          key={i}
          value={option}
          onChange={(e) => handlePickupOptionChange(i, e.target.value)}
          placeholder="時間:yyyy-mm-dd HH:MM   地點:"
          className="mb-2"
        />
      ))}
      <Button onClick={addPickupOption} className="mb-4">新增取貨選項</Button>

      <h2 className="font-semibold mt-4">商品列表</h2>
      {products.map((p, i) => (
        <div key={i} className="mb-2 grid grid-cols-2 gap-2">
          <Input value={p.name} onChange={(e) => handleProductChange(i, 'name', e.target.value)} placeholder="商品名稱" />
          <Input value={p.spec} onChange={(e) => handleProductChange(i, 'spec', e.target.value)} placeholder="規格與說明" />
          <Input value={p.price} onChange={(e) => handleProductChange(i, 'price', e.target.value)} placeholder="售價" />
          <Input value={p.supply} onChange={(e) => handleProductChange(i, 'supply', e.target.value)} placeholder="供應量" />
          <Input value={p.image} onChange={(e) => handleProductChange(i, 'image', e.target.value)} placeholder="圖片 URL" />
        </div>
      ))}

      <Button onClick={handleSubmit01} className="mt-4">測試送出</Button>
    </div>
  );
}
