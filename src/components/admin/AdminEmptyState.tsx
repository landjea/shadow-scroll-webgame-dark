
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminEmptyStateProps {
  title: string;
  description: string;
  addButtonText: string;
  buttonIcon?: React.ReactNode;
  onAddNew: () => void;
  // For backward compatibility:
  icon?: React.ElementType;
  buttonText?: string; 
  onButtonClick?: () => void;
}

const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  description,
  addButtonText,
  buttonIcon = <Plus className="mr-2 h-4 w-4" />,
  onAddNew,
  // Handle backward compatibility:
  icon: Icon,
  buttonText,
  onButtonClick
}) => {
  // Use the newer props first, fall back to older ones if needed
  const finalButtonText = buttonText || addButtonText;
  const finalClickHandler = onButtonClick || onAddNew;
  
  return (
    <div className="text-center my-12 p-8 border border-dashed rounded-lg">
      {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Button 
        onClick={finalClickHandler}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {buttonIcon}
        {finalButtonText}
      </Button>
    </div>
  );
};

export default AdminEmptyState;
