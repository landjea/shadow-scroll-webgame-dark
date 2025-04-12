
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface AdminItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const AdminItemActions: React.FC<AdminItemActionsProps> = ({
  onEdit,
  onDelete
}) => {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </>
  );
};

export default AdminItemActions;
