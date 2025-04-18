
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export interface AdminItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}

const AdminItemActions: React.FC<AdminItemActionsProps> = ({ 
  onEdit, 
  onDelete,
  compact = false
}) => {
  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-red-600 focus:text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="space-x-2">
      <Button 
        onClick={onEdit} 
        variant="outline" 
        size="sm"
        className="h-8"
      >
        Edit
      </Button>
      <Button 
        onClick={onDelete} 
        variant="outline" 
        size="sm"
        className="h-8 text-red-600 hover:text-red-700"
      >
        Delete
      </Button>
    </div>
  );
};

export default AdminItemActions;
