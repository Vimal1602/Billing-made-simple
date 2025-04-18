
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Item } from '@/data/items';
import { motion, AnimatePresence } from "framer-motion";

interface ItemListProps {
  items: Item[];
  onAddItem: (item: Item, quantity: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, onAddItem }) => {
  const [clickedButtons, setClickedButtons] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
  const [selectedUnits, setSelectedUnits] = useState<{ [key: string]: string }>({});
  const [newItemPrice, setNewItemPrice] = useState<number>(0);
  const [newItemUnit, setNewItemUnit] = useState<string>("piece");

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
  
    // Mark button as clicked
    setClickedButtons(prev => ({ ...prev, [item.id]: true }));
  
    // Show toast
    toast.success(`${item.name} added successfully!`);
  };
  

  const handleAddNewItem = () => {
    if (search.trim() === "") return;
    
    // Create a new item with a unique ID
    const newId = `new-${Date.now()}`;
    const newItem: Item = {
      id: newId,
      name: search,
      price: newItemPrice,
      unit: newItemUnit
    };
    
    // Add the new item
    onAddItem(newItem, 1);
    
    // Clear the search and reset the price
    setSearch("");
    setNewItemPrice(0);
  };

  // Provide all unit options for every item
  const unitOptions = ["piece", "Set", "g", "grams", "Kg"];

  return (
    <div className="w-full">
      <Input
        type="search"
        placeholder="Search items..."
        className="mb-4 text-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && filteredItems.length === 0 && (
        <div className="bg-gray-50 p-4 mb-4 rounded-lg border">
          <p className="mb-2 text-gray-700">No items found matching "{search}"</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Price (INR)"
              value={newItemPrice || ""}
              onChange={(e) => setNewItemPrice(Number(e.target.value))}
              className="w-full sm:w-40"
            />
            <Select
              value={newItemUnit}
              onValueChange={setNewItemUnit}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              className="flex-1"
              onClick={handleAddNewItem}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Add "{search}" to list
            </Button>
          </div>
        </div>
      )}

      {filteredItems.length > 0 && (
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
                      {unitOptions.map((unit) => (
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
    className={`px-4 py-2 rounded font-medium transition-colors duration-200 ${
      clickedButtons[item.id]
        ? "bg-green-700 transition-colors duration-200 text-white"
        : "bg-blue-500 text-white hover:bg-blue-600"
    }`}
  >
    Add
  </button>
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
