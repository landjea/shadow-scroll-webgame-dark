
import React from 'react';

export interface AdminTagProps {
  label: string;
  className?: string;
  children?: React.ReactNode;
}

const AdminTag: React.FC<AdminTagProps> = ({ 
  label, 
  className = '', 
  children 
}) => {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${className}`}>
      {children || label}
    </span>
  );
};

export default AdminTag;
