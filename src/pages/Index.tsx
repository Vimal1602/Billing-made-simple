
import React, { useState, useRef } from 'react';
import { Bill } from '@/components/Bill';
import { ItemList } from '@/components/ItemList';
import { items as initialItems } from '@/data/items';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Edit } from 'lucide-react';

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

const Index = () => {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const billRef = useRef<HTMLDivElement>(null);

  const handleAddItem = (item: typeof initialItems[0], quantity: number) => {
    const existingItem = billItems.find((i) => i.id === item.id);
    
    if (existingItem) {
      setBillItems(billItems.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      ));
    } else {
      setBillItems([...billItems, { ...item, quantity }]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const downloadBill = async () => {
    if (billRef.current) {
      const canvas = await html2canvas(billRef.current);
      const image = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'jeni-mart-bill.jpg';
      link.click();
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jeni Mart Bill Generator</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Preview' : 'Edit'}
            </Button>
            <Button
              variant="default"
              onClick={downloadBill}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Bill
            </Button>
          </div>
        </div>

        <div ref={billRef} className="bg-white p-6 rounded-lg shadow-sm">
          <Bill
            items={billItems}
            isEditing={isEditing}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        {isEditing && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Add Items</h2>
            <ItemList items={initialItems} onAddItem={handleAddItem} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
