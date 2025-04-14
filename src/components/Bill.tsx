
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Smile } from 'lucide-react';

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
}

export const Bill: React.FC<BillProps> = ({ items, isEditing, onRemoveItem }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Card className="w-full mb-8">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Jeni Mart</h1>
          <p className="text-xl text-gray-500 font-semibold">Bill of Sale</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-lg font-bold w-[40%]">Item</TableHead>
              <TableHead className="text-lg font-bold">Quantity</TableHead>
              <TableHead className="text-lg font-bold">Price per Quantity (INR)</TableHead>
              <TableHead className="text-lg font-bold">Total Price (INR)</TableHead>
              {isEditing && <TableHead className="w-[100px] text-lg font-bold">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="text-base">
                <TableCell className="font-medium text-lg">{item.name}</TableCell>
                <TableCell className="text-lg">
                  {item.unit !== 'piece' ? `${item.quantity} ${item.unit}` : ''}
                </TableCell>
                <TableCell className="text-lg">₹{item.price}</TableCell>
                <TableCell className="text-lg">₹{item.price * item.quantity}</TableCell>
                {isEditing && (
                  <TableCell>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-lg"
                    >
                      Remove
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right text-xl font-bold">
                Total
              </TableCell>
              <TableCell className="text-xl font-bold">₹{total}</TableCell>
              {isEditing && <TableCell />}
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="text-center mt-6">
          <p className="text-xl font-medium flex items-center justify-center gap-2">
            Thank you for purchasing <Smile className="inline-block w-7 h-7 text-yellow-500" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
