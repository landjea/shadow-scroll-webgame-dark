
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import AdminItemActions from '@/components/admin/AdminItemActions';
import { UserRole } from '@/types/admin';

interface RolesTableProps {
  roles: UserRole[];
  onDelete: (id: string, email: string) => void;
}

const RolesTable: React.FC<RolesTableProps> = ({ roles, onDelete }) => {
  return (
    <Table>
      <TableCaption>A list of all user roles in the system.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.user_email}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                ${role.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                'bg-green-100 text-green-800'}`}>
                {role.role}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <AdminItemActions
                onEdit={() => {}}
                onDelete={() => onDelete(role.id, role.user_email || '')}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RolesTable;
