
import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { InventoryItem } from '@/types/admin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminItemActions from '@/components/admin/AdminItemActions';
import FormField from '@/components/admin/FormField';
import AdminDialogFooter from '@/components/admin/DialogFooter';
import LoadingState from '@/components/admin/LoadingState';
import { useAdminTable } from '@/hooks/useAdminTable';
import AdminLayout from '@/components/admin/AdminLayout';

const InventoryAdmin: React.FC = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    rarity: 'common',
    quantity: 1
  });

  const {
    items: inventoryItems,
    isLoading,
    refetch,
    dialogOpen, 
    setDialogOpen,
    editItem,
    handleDelete,
    openAddDialog,
    openEditDialog,
    closeDialog
  } = useAdminTable<InventoryItem>({
    tableName: 'inventory_items',
    queryKey: 'inventory-items',
    orderByField: 'name'
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
  };

  const handleOpenEditDialog = (item: InventoryItem) => {
    setFormData({
      name: item.name,
      description: item.description || '',
      type: item.type,
      rarity: item.rarity,
      quantity: item.quantity
    });
    openEditDialog(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
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
      
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save inventory item.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    closeDialog();
    resetForm();
  };

  return (
    <AdminLayout>
      <AdminHeader 
        title="Inventory Management"
        description="Manage game items, equipment and resources"
        onAddNew={openAddDialog}
        addButtonText="Add Item"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
              <FormField 
                id="name" 
                label="Name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormField 
                id="description" 
                label="Description" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
              
              <FormField 
                id="type" 
                label="Type" 
                value={formData.type} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormField 
                id="rarity" 
                label="Rarity" 
                value={formData.rarity} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormField 
                id="quantity" 
                label="Quantity" 
                type="number"
                value={formData.quantity} 
                onChange={handleInputChange} 
                required 
                min={0}
              />
            </div>
            <AdminDialogFooter 
              onCancel={handleCancel}
              isEditing={!!editItem}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <LoadingState />
      ) : inventoryItems?.length === 0 ? (
        <AdminEmptyState 
          title="No items found"
          description="Start by adding some items to your inventory."
          addButtonText="Add First Item"
          onAddNew={openAddDialog}
          buttonIcon={<Package className="h-4 w-4" />}
        />
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
                  <AdminItemActions
                    onEdit={() => handleOpenEditDialog(item)}
                    onDelete={() => handleDelete(item.id, item.name)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  );
};

export default InventoryAdmin;
