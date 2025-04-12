
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface AdminDialogFooterProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}

const AdminDialogFooter: React.FC<AdminDialogFooterProps> = ({
  onCancel,
  isEditing,
  isSubmitting = false
}) => {
  return (
    <DialogFooter>
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-purple-600 hover:bg-purple-700"
        disabled={isSubmitting}
      >
        {isEditing ? 'Save Changes' : 'Add'}
      </Button>
    </DialogFooter>
  );
};

export default AdminDialogFooter;
