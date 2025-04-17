
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Edit, Plus, Save, Trash } from 'lucide-react';
import { items as initialItems } from '@/data/items';
import { Item } from '@/data/items';
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>(() => {
    // Try to load items from localStorage, or use the initial items if not found
    const savedItems = localStorage.getItem('jeniMartItems');
    return savedItems ? JSON.parse(savedItems) : initialItems;
  });
  const [newItem, setNewItem] = useState<Item>({
    id: '', 
    name: '', 
    price: 0, 
    unit: 'piece'
  });
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Save items to localStorage whenever they change
  const saveItems = (updatedItems: Item[]) => {
    localStorage.setItem('jeniMartItems', JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  const handleEditItem = (id: string) => {
    setEditingItem(id);
  };

  const handleSaveItem = (id: string) => {
    setEditingItem(null);
    toast.success("Item updated successfully");
  };

  const handleItemChange = (id: string, field: keyof Item, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'price' ? Number(value) : value };
      }
      return item;
    });
    saveItems(updatedItems);
  };

  const handleAddNewItem = () => {
    if (!newItem.name.trim()) {
      toast.error("Item name cannot be empty");
      return;
    }

    const newItemWithId = {
      ...newItem,
      id: `new-${Date.now()}`,
      price: Number(newItem.price)
    };

    const updatedItems = [...items, newItemWithId];
    saveItems(updatedItems);
    
    // Reset the new item form
    setNewItem({
      id: '', 
      name: '', 
      price: 0, 
      unit: 'piece'
    });
    
    toast.success("New item added successfully");
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveItems(updatedItems);
    toast.success("Item deleted successfully");
  };

  const handleReturnToMain = () => {
    navigate('/');
  };

  // All unit options
  const unitOptions = ["piece", "Set", "g", "grams", "Kg"];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Jeni Mart Admin</h1>
          <Button 
            variant="outline" 
            onClick={handleReturnToMain}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Bill Generator
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <Input
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="flex-1"
            />
            <Input
              type="number"
              min="0"
              step="1"
              placeholder="Price (INR)"
              value={newItem.price || ""}
              onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
              className="w-full sm:w-40"
            />
            <Select
              value={newItem.unit}
              onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
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
              className="mt-2 sm:mt-0"
              onClick={handleAddNewItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Manage Items</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-bold">Item Name</TableHead>
                <TableHead className="text-base font-bold">Price (INR)</TableHead>
                <TableHead className="text-base font-bold">Unit</TableHead>
                <TableHead className="text-base font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className="text-base">
                  <TableCell className="font-medium">
                    {editingItem === item.id ? (
                      <Input
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                        className="w-24"
                      />
                    ) : (
                      `₹${item.price}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingItem === item.id ? (
                      <Select
                        value={item.unit}
                        onValueChange={(value) => handleItemChange(item.id, 'unit', value)}
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
                    ) : (
                      item.unit
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingItem === item.id ? (
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => handleSaveItem(item.id)}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditItem(item.id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
