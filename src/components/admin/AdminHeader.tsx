
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
  onAddNew: () => void;
  addButtonText?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  description,
  onAddNew,
  addButtonText = 'Add'
}) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-purple-800">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <Button 
        className="bg-purple-600 hover:bg-purple-700"
        onClick={onAddNew}
      >
        <Plus className="mr-2 h-4 w-4" />
        {addButtonText}
      </Button>
    </header>
  );
};

export default AdminHeader;
