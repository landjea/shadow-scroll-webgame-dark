
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TableName, isValidTableName } from '@/types/supabase';

interface UseAdminTableProps {
  tableName: TableName;
  queryKey: string;
  orderByField?: string;
}

export function useAdminTable<T>({ tableName, queryKey, orderByField = 'created_at' }: UseAdminTableProps) {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  
  const { data: items, isLoading, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      // Validate the table name for type safety
      if (!isValidTableName(tableName)) {
        throw new Error(`Invalid table name: ${tableName}`);
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(orderByField);
        
      if (error) throw error;
      return data as T[];
    }
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      // Validate the table name for type safety
      if (!isValidTableName(tableName)) {
        throw new Error(`Invalid table name: ${tableName}`);
      }
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Item deleted',
        description: `${name} has been removed.`
      });
      
      refetch();
    } catch (error) {
      console.error(`Error deleting ${tableName}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete item.`
      });
    }
  };

  const openAddDialog = () => {
    setEditItem(null);
    setDialogOpen(true);
  };

  const openEditDialog = (item: T) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditItem(null);
  };

  return {
    items,
    isLoading,
    refetch,
    dialogOpen,
    setDialogOpen,
    editItem,
    setEditItem,
    handleDelete,
    openAddDialog,
    openEditDialog,
    closeDialog
  };
}
