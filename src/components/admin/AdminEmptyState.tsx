
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description: string;
  // New prop names
  addButtonText: string;
  onAddNew: () => void;
  buttonIcon?: React.ReactNode;
  // For backward compatibility:
  buttonText?: string; 
  onButtonClick?: () => void;
  icon?: React.ReactNode;
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  addButtonText,
  onAddNew,
  buttonIcon = <Plus className="mr-2 h-4 w-4" />,
  // Handle backward compatibility
  buttonText,
  onButtonClick,
  icon
}) => {
  // Use the newer props first, fall back to older ones if needed
  const finalButtonText = buttonText || addButtonText;
  const finalClickHandler = onButtonClick || onAddNew;
  const finalIcon = icon || buttonIcon;
  
  return (
    <div className="text-center my-12 p-8 border border-dashed rounded-lg">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        onClick={finalClickHandler}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {finalIcon}
        {finalButtonText}
      </Button>
    </div>
  );
};

export default AdminEmptyState;
