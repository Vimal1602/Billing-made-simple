
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Smile } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

interface BillProps {
  items: BillItem[];
  isEditing: boolean;
  onRemoveItem: (id: string) => void;
  isDownloading?: boolean; // New prop to indicate download mode
}

export const Bill: React.FC<BillProps> = ({ 
  items, 
  isEditing, 
  onRemoveItem, 
  isDownloading = false 
}) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Don't use resizable columns when downloading
  if (isDownloading) {
    return (
      <Card className="w-full mb-8">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Jeni Mart</h1>
            <p className="text-lg text-gray-500 font-medium">Bill of Sale</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-bold">Item</TableHead>
                <TableHead className="text-base font-bold">Quantity</TableHead>
                <TableHead className="text-base font-bold">Price per Quantity (INR)</TableHead>
                <TableHead className="text-base font-bold">Total Price (INR)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="text-base">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity} {item.unit}</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  <TableCell>₹{item.price * item.quantity}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right text-lg font-bold">
                  Total
                </TableCell>
                <TableCell className="text-lg font-bold">₹{total}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="text-center mt-6">
            <p className="text-lg font-medium flex items-center justify-center gap-2">
              Thank you for purchasing <Smile className="inline-block w-6 h-6 text-yellow-500" />
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full mb-8">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Jeni Mart</h1>
          <p className="text-lg text-gray-500 font-medium">Bill of Sale</p>
        </div>

        <div className="w-full">
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="text-base font-bold p-3 border-b">Item</div>
              {items.map((item) => (
                <div key={item.id} className="text-base p-3 border-b font-medium">{item.name}</div>
              ))}
              <div className="text-lg font-bold p-3 border-b text-right">Total</div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={20} minSize={15}>
              <div className="text-base font-bold p-3 border-b">Quantity</div>
              {items.map((item) => (
                <div key={item.id} className="text-base p-3 border-b">{item.quantity} {item.unit}</div>
              ))}
              <div className="text-lg font-bold p-3 border-b"></div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={25} minSize={15}>
              <div className="text-base font-bold p-3 border-b">Price (INR)</div>
              {items.map((item) => (
                <div key={item.id} className="text-base p-3 border-b">₹{item.price}</div>
              ))}
              <div className="text-lg font-bold p-3 border-b"></div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={25} minSize={15}>
              <div className="text-base font-bold p-3 border-b">Total Price (INR)</div>
              {items.map((item) => (
                <div key={item.id} className="text-base p-3 border-b">₹{item.price * item.quantity}</div>
              ))}
              <div className="text-lg font-bold p-3 border-b">₹{total}</div>
            </ResizablePanel>
            
            {isEditing && (
              <>
                <ResizableHandle withHandle />
                
                <ResizablePanel defaultSize={15} minSize={10}>
                  <div className="text-base font-bold p-3 border-b">Action</div>
                  {items.map((item) => (
                    <div key={item.id} className="text-base p-3 border-b">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="text-lg font-bold p-3 border-b"></div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-lg font-medium flex items-center justify-center gap-2">
            Thank you for purchasing <Smile className="inline-block w-6 h-6 text-yellow-500" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
