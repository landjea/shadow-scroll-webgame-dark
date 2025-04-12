
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LucideIcon } from 'lucide-react';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onAddNew: () => void;
  addButtonText: string;
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  onAddNew,
  addButtonText
}) => {
  return (
    <div className="text-center my-12 p-8 border border-dashed rounded-lg">
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        onClick={onAddNew}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        {addButtonText}
      </Button>
    </div>
  );
};

export default AdminEmptyState;
