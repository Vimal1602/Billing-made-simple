
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Item } from '@/data/items';

interface ItemListProps {
  items: Item[];
  onAddItem: (item: Item, quantity: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onAddItem }) => {
  const [search, setSearch] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: string }>({});

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseFloat(value) || 0;
    setSelectedQuantities(prev => ({ ...prev, [itemId]: quantity }));
  };

  const handleUnitChange = (itemId: string, unit: string) => {
    setSelectedUnits(prev => ({ ...prev, [itemId]: unit }));
  };

  const handleAddItem = (item: Item) => {
    const quantity = selectedQuantities[item.id] || 1;
    const unit = selectedUnits[item.id] || item.unit;
    onAddItem({ ...item, unit }, quantity);
    setSelectedQuantities(prev => ({ ...prev, [item.id]: 1 }));
  };

  const getUnitOptions = (item: Item) => {
    if (item.unit === "piece" || item.unit === "set") {
      return [item.unit];
    }
    return ["g", "Kg", "½ Kg"];
  };

  return (
    <div className="w-full">
      <Input
        type="search"
        placeholder="Search items..."
        className="mb-4 text-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-base font-bold">Item</TableHead>
            <TableHead className="text-base font-bold">Price (INR)</TableHead>
            <TableHead className="text-base font-bold">Quantity</TableHead>
            <TableHead className="text-base font-bold">Unit</TableHead>
            <TableHead className="text-base font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id} className="text-base">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>₹{item.price}</TableCell>
              <TableCell className="w-[150px]">
                <Input
                  type="number"
                  min="0.001"
                  step="0.001"
                  value={selectedQuantities[item.id] || 1}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  className="w-24 text-base"
                />
              </TableCell>
              <TableCell className="w-[150px]">
                <Select
                  value={selectedUnits[item.id] || item.unit}
                  onValueChange={(value) => handleUnitChange(item.id, value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getUnitOptions(item).map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleAddItem(item)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-medium"
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
