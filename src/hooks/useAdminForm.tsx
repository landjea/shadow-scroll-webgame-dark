
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TableName, TableTypes } from '@/types/supabase';

interface UseAdminFormProps<T, F> {
  tableName: TableName;
  initialFormState: F;
  itemToFormData: (item: T) => F;
  onSuccess: () => void;
}

export function useAdminForm<T extends { id: string }, F>({
  tableName,
  initialFormState,
  itemToFormData,
  onSuccess
}: UseAdminFormProps<T, F>) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<F>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  
  // Type assertion to ensure tableName is recognized as a valid table name
  const tableNameKey = tableName as keyof TableTypes;
  
  const resetForm = () => {
    setFormData(initialFormState);
  };

  const setFormForEditing = (item: T) => {
    setFormData(itemToFormData(item));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : type === 'number'
          ? parseFloat(value) || 0
          : value
    });
  };

  const handleSubmit = async (e: React.FormEvent, editItem: T | null) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (editItem) {
        // Update existing item
        const { error } = await supabase
          .from(tableNameKey)
          .update(formData as any)
          .eq('id', editItem.id);
          
        if (error) throw error;
        
        toast({
          title: 'Item updated',
          description: `Item has been updated successfully.`
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from(tableNameKey)
          .insert(formData as any);
          
        if (error) throw error;
        
        toast({
          title: 'Item created',
          description: `Item has been created successfully.`
        });
      }
      
      resetForm();
      onSuccess();
    } catch (error) {
      console.error(`Error saving ${tableName}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to save item.`
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    resetForm,
    setFormForEditing,
    handleInputChange,
    handleSubmit,
    submitting
  };
}
