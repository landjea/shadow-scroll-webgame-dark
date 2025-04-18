
import React from 'react';

interface AdminStatusProps {
  value?: boolean;
  isActive?: boolean; // Add for backward compatibility
  activeText?: string;
  inactiveText?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

const AdminStatus: React.FC<AdminStatusProps> = ({
  value,
  isActive, // For backward compatibility
  activeText = 'Active',
  inactiveText = 'Inactive',
  activeClassName = 'bg-green-100 text-green-800',
  inactiveClassName = 'bg-gray-100 text-gray-800'
}) => {
  // Use value if provided, otherwise fall back to isActive
  const isActiveState = value !== undefined ? value : isActive !== undefined ? isActive : false;
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${isActiveState ? activeClassName : inactiveClassName}`}>
      {isActiveState ? activeText : inactiveText}
    </span>
  );
};

export default AdminStatus;
