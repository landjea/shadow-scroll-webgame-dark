
import React from 'react';

interface AdminTagProps {
  text?: string;
  label?: string;
  className?: string;
}

const AdminTag: React.FC<AdminTagProps> = ({
  text,
  label,
  className = 'bg-purple-100 text-purple-800'
}) => {
  // Use label or text, with text taking precedence if both are provided
  const displayText = text || label || '';
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${className}`}>
      {displayText}
    </span>
  );
};

export default AdminTag;
