
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import AdminDialogFooter from '@/components/admin/DialogFooter';

// Defining the role type to match the database schema
type AppRole = 'admin' | 'player';

interface RoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  selectedRole: AppRole;
  setSelectedRole: (role: AppRole) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
  open,
  onOpenChange,
  userEmail,
  setUserEmail,
  selectedRole,
  setSelectedRole,
  onSubmit,
  isSubmitting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add User Role</DialogTitle>
          <DialogDescription>
            Assign a role to a user by email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userEmail" className="text-right">User Email</Label>
              <Input 
                id="userEmail" 
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="col-span-3" 
                required
                placeholder="user@example.com"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AppRole)}
                className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
              >
                <option value="player">Player</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <AdminDialogFooter
            onCancel={() => {
              onOpenChange(false);
              setUserEmail('');
              setSelectedRole('player');
            }}
            isEditing={false}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleForm;
