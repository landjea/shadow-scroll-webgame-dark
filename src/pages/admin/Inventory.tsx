
import React, { useState } from 'react';
import { Package, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  quantity: number;
}

const InventoryAdmin: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    rarity: 'common',
    quantity: 1
  });

  const { data: inventoryItems, isLoading, refetch } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      rarity: 'common',
      quantity: 1
    });
    setEditItem(null);
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      quantity: item.quantity
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editItem) {
        // Update existing item
        const { error } = await supabase
          .from('inventory_items')
          .update({
            name: formData.name,
            description: formData.description,
            type: formData.type,
            rarity: formData.rarity,
            quantity: formData.quantity
          })
          .eq('id', editItem.id);
          
        if (error) throw error;
        
        toast({
          title: 'Item updated',
          description: `${formData.name} has been updated.`
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from('inventory_items')
          .insert({
            name: formData.name,
            description: formData.description,
            type: formData.type,
            rarity: formData.rarity,
            quantity: formData.quantity
          });
          
        if (error) throw error;
        
        toast({
          title: 'Item created',
          description: `${formData.name} has been added to inventory.`
        });
      }
      
      setOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save inventory item.'
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Item deleted',
        description: `${name} has been removed from inventory.`
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete inventory item.'
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Inventory Management</h1>
          <p className="text-gray-600">Manage game items, equipment and resources</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              <DialogDescription>
                {editItem 
                  ? `Make changes to ${editItem.name}.` 
                  : 'Fill out the form below to add a new inventory item.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Input 
                    id="type" 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rarity" className="text-right">Rarity</Label>
                  <Input 
                    id="rarity" 
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Quantity</Label>
                  <Input 
                    id="quantity" 
                    name="quantity"
                    type="number"
                    min={0}
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editItem ? 'Save Changes' : 'Add Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : inventoryItems?.length === 0 ? (
        <div className="text-center my-12 p-8 border border-dashed rounded-lg">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-gray-600 mb-4">Start by adding some items to your inventory.</p>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Item
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all inventory items in the game.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rarity</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.rarity === 'legendary' ? 'bg-orange-100 text-orange-800' :
                    item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                    item.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.rarity}
                  </span>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default InventoryAdmin;
