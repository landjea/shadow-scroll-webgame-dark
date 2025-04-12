
import React from 'react';

interface AdminStatusProps {
  value: boolean;
  activeText?: string;
  inactiveText?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

const AdminStatus: React.FC<AdminStatusProps> = ({
  value,
  activeText = 'Active',
  inactiveText = 'Inactive',
  activeClassName = 'bg-green-100 text-green-800',
  inactiveClassName = 'bg-gray-100 text-gray-800'
}) => {
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${value ? activeClassName : inactiveClassName}`}>
      {value ? activeText : inactiveText}
    </span>
  );
};

export default AdminStatus;
