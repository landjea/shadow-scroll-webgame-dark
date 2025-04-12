
import React from 'react';

interface AdminTagProps {
  text: string;
  className?: string;
}

const AdminTag: React.FC<AdminTagProps> = ({
  text,
  className = 'bg-purple-100 text-purple-800'
}) => {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${className}`}>
      {text}
    </span>
  );
};

export default AdminTag;
