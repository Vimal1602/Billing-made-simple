
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Item } from '@/data/items';

interface ItemListProps {
  items: Item[];
  onAddItem: (item: Item, quantity: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onAddItem }) => {
  const [search, setSearch] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value) || 1;
    setSelectedQuantities(prev => ({ ...prev, [itemId]: quantity }));
  };

  const handleAddItem = (item: Item) => {
    const quantity = selectedQuantities[item.id] || 1;
    onAddItem(item, quantity);
    setSelectedQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  return (
    <div className="w-full">
      <Input
        type="search"
        placeholder="Search items..."
        className="mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Price (INR)</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell className="w-[150px]">
                <Input
                  type="number"
                  min="1"
                  value={selectedQuantities[item.id] || 1}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="w-20"
                />
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleAddItem(item)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
