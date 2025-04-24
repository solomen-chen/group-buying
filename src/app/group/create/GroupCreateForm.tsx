'use client';

import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function GroupCreateForm() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const [groupName, setGroupName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [pickupOptions, setPickupOptions] = useState([{ time: '', location: '' }]);
  const [products, setProducts] = useState([
    { name: '', image: '', spec: '', price: '', supply: '' },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('請先登入');
      return;
    }

    const res = await fetch('/api/group/create', {
      method: 'POST',
      body: JSON.stringify({
        name,
        deadline,
        pickupOptions,
        ownerId: user.userId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      alert('開團成功');
    } else {
      alert('開團失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="團名"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <Input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <div>
        <p className="font-bold">取貨時段與地點</p>
        {pickupOptions.map((opt, idx) => (
          <div key={idx} className="flex gap-2 my-1">
            <Input
              placeholder="時間"
              value={opt.time}
              onChange={(e) => {
                const next = [...pickupOptions];
                next[idx].time = e.target.value;
                setPickupOptions(next);
              }}
            />
            <Input
              placeholder="地點"
              value={opt.location}
              onChange={(e) => {
                const next = [...pickupOptions];
                next[idx].location = e.target.value;
                setPickupOptions(next);
              }}
            />
          </div>
        ))}
        <Button type="button" onClick={() => setPickupOptions([...pickupOptions, { time: '', location: '' }])}>
          + 新增取貨選項
        </Button>
      </div>

      <div>
        <p className="font-bold">商品</p>
        {products.map((p, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-2 my-1">
            <Input
              placeholder="名稱"
              value={p.name}
              onChange={(e) => {
                const next = [...products];
                next[idx].name = e.target.value;
                setProducts(next);
              }}
            />
            <Input
              placeholder="圖片 URL"
              value={p.image}
              onChange={(e) => {
                const next = [...products];
                next[idx].image = e.target.value;
                setProducts(next);
              }}
            />
            <Input
              placeholder="規格"
              value={p.spec}
              onChange={(e) => {
                const next = [...products];
                next[idx].spec = e.target.value;
                setProducts(next);
              }}
            />
            <Input
              placeholder="價格"
              type="number"
              value={p.price}
              onChange={(e) => {
                const next = [...products];
                next[idx].price = e.target.value;
                setProducts(next);
              }}
            />
            <Input
              placeholder="數量限制（0 表示不限）"
              type="number"
              value={p.supply}
              onChange={(e) => {
                const next = [...products];
                next[idx].supply = e.target.value;
                setProducts(next);
              }}
            />
          </div>
        ))}
        <Button type="button" onClick={() => setProducts([...products, { name: '', image: '', spec: '', price: '', supply: '' }])}>
          + 新增商品
        </Button>
      </div>

      <Button type="submit">建立團單</Button>
    </form>
  );
}
