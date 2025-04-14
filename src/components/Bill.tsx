
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
          <h1 className="text-2xl font-bold mb-2">Jeni Mart</h1>
          <p className="text-sm text-gray-500">Bill of Sale</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price per Quantity (INR)</TableHead>
              <TableHead>Total Price (INR)</TableHead>
              {isEditing && <TableHead className="w-[100px]">Action</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity} {item.unit}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>₹{item.price * item.quantity}</TableCell>
                {isEditing && (
                  <TableCell>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">
                Total
              </TableCell>
              <TableCell className="font-bold">₹{total}</TableCell>
              {isEditing && <TableCell />}
            </TableRow>
          </TableBody>
        </Table>
        
        <div className="text-center mt-6">
          <p>Thank you for purchasing</p>
        </div>
      </CardContent>
    </Card>
  );
};
