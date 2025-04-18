import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bill } from '@/components/Bill';
import { ItemList } from '@/components/ItemList';
import { items as initialItems } from '@/data/items';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Download, Edit, Settings } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [isEditing, setIsEditing] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('jeniMartItems');
    return savedItems ? JSON.parse(savedItems) : initialItems;
  });

  useEffect(() => {
    const checkForUpdates = () => {
      const savedItems = localStorage.getItem('jeniMartItems');
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
    };

    window.addEventListener('focus', checkForUpdates);
    return () => {
      window.removeEventListener('focus', checkForUpdates);
    };
  }, []);

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
    if (!billRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Create a clone of the bill element and remove action buttons
      const billClone = billRef.current.cloneNode(true) as HTMLElement;
      const actionColumns = billClone.querySelectorAll('[data-action-column]');
      actionColumns.forEach(col => col.remove());
      
      billClone.style.position = 'absolute';
      billClone.style.left = '-9999px';
      billClone.style.width = `${billRef.current.offsetWidth}px`;
      document.body.appendChild(billClone);

      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(billClone, {
        scale: 3,
        logging: false,
        letterRendering: true,
        useCORS: true,
        allowTaint: true,
        windowWidth: billRef.current.scrollWidth,
        windowHeight: billRef.current.scrollHeight,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          clonedDoc.body.style.letterSpacing = 'normal';
          clonedDoc.body.style.wordSpacing = 'normal';
          clonedDoc.body.style.textRendering = 'optimizeLegibility';
          clonedDoc.body.style.webkitFontSmoothing = 'antialiased';
        }
      });

      document.body.removeChild(billClone);

      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = 'jeni-mart-bill.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsDownloading(false);
      toast.success("Bill downloaded successfully!");
    } catch (error) {
      console.error("Error generating bill image:", error);
      toast.error("Failed to download bill. Please try again.");
      setIsDownloading(false);
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
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
              disabled={isDownloading}
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download Bill'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleAdminClick}
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Mode
            </Button>
          </div>
        </div>

        <div 
          ref={billRef} 
          className="bg-white p-6 rounded-lg shadow-sm"
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            letterSpacing: 'normal',
            wordSpacing: 'normal'
          }}
        >
          <Bill
            items={billItems}
            isEditing={isEditing}
            onRemoveItem={handleRemoveItem}
            isDownloading={isDownloading}
          />
        </div>

        {isEditing && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Add Items</h2>
            <ItemList items={items} onAddItem={handleAddItem} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;