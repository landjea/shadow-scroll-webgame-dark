
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TableName, TableTypes } from '@/types/supabase';

interface UseAdminFormProps<F> {
  tableName: TableName;
  initialFormState: F;
  onSuccess?: () => void;
  validateForm?: (data: F) => boolean;
}

export function useAdminForm<F extends Record<string, any>>({
  tableName,
  initialFormState,
  onSuccess,
  validateForm,
}: UseAdminFormProps<F>) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<F>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  
  const resetForm = () => {
    setFormData(initialFormState);
  };

  const updateFormField = (field: keyof F, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (editItem: F | null) => {
    // If a validation function is provided, run it
    if (validateForm && !validateForm(formData)) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please check your inputs and try again.'
      });
      return false;
    }
    
    setSubmitting(true);
    
    try {
      if (editItem) {
        // Update existing item
        const { error } = await supabase
          .from(tableName)
          .update(formData as any)
          .eq('id', editItem.id);
          
        if (error) throw error;
        
        toast({
          title: 'Item updated',
          description: 'Your item has been updated successfully.'
        });
      } else {
        // Create new item
        const { error } = await supabase
          .from(tableName)
          .insert(formData as any);
          
        if (error) throw error;
        
        toast({
          title: 'Item created',
          description: 'Your new item has been created successfully.'
        });
      }
      
      resetForm();
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error(`Error ${editItem ? 'updating' : 'creating'} ${tableName}:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${editItem ? 'update' : 'create'} item.`
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    updateFormField,
    resetForm,
    submitting,
    handleSubmit
  };
}
