
import React, { useState } from 'react';
import { Shield, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';
import AdminItemActions from '@/components/admin/AdminItemActions';
import AdminDialogFooter from '@/components/admin/DialogFooter';

const RolesAdmin: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'moderator' | 'player'>('player');

  const {
    data: roles,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['user_roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('role');
        
      if (error) throw error;
      
      // Get email for each user
      const rolesWithEmail = await Promise.all(
        data.map(async (role) => {
          try {
            const { data: emailData } = await supabase.rpc('get_user_email', { user_id: role.user_id });
            return { ...role, user_email: emailData || 'Unknown' };
          } catch (err) {
            console.error('Error fetching email:', err);
            return { ...role, user_email: 'Unknown' };
          }
        })
      );
      
      return rolesWithEmail as UserRole[];
    }
  });

  const filteredRoles = roles?.filter(role => 
    role.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete role for "${email}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Role deleted',
        description: `${email}'s role has been removed.`
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete role.`
      });
    }
  };

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // First get the user_id from email
      const { data: userId, error: userError } = await supabase.rpc(
        'get_user_id_by_email',
        { email: userEmail }
      );
      
      if (userError) throw userError;
      if (!userId) {
        toast({
          variant: 'destructive',
          title: 'User not found',
          description: `No user found with email: ${userEmail}`
        });
        setSubmitting(false);
        return;
      }
      
      // Check if user already has this role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', selectedRole);
        
      if (checkError) throw checkError;
      if (existingRole && existingRole.length > 0) {
        toast({
          variant: 'destructive',
          title: 'Role already exists',
          description: `User already has the ${selectedRole} role.`
        });
        setSubmitting(false);
        return;
      }
      
      // Add the role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: selectedRole
        });
        
      if (error) throw error;
      
      toast({
        title: 'Role added',
        description: `User has been assigned the ${selectedRole} role.`
      });
      
      setDialogOpen(false);
      setUserEmail('');
      setSelectedRole('player');
      refetch();
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to add role.`
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="User Roles Management"
        description="Manage user roles and permissions in the game"
        onAddNew={() => setDialogOpen(true)}
        addButtonText="Add Role"
      />

      <div className="flex mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !filteredRoles || filteredRoles.length === 0 ? (
        <AdminEmptyState
          icon={Shield}
          title="No roles found"
          description={searchQuery ? "No roles matching your search criteria." : "Start by adding roles to users."}
          onAddNew={() => setDialogOpen(true)}
          addButtonText="Add First Role"
        />
      ) : (
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
            {filteredRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium">{role.user_email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${role.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                     role.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
                     'bg-green-100 text-green-800'}`}>
                    {role.role}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(role.id, role.user_email || '')}
                  >
                    <Shield className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add User Role</DialogTitle>
            <DialogDescription>
              Assign a role to a user by email address.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRole}>
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
                  onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'moderator' | 'player')}
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                >
                  <option value="player">Player</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <AdminDialogFooter
              onCancel={() => {
                setDialogOpen(false);
                setUserEmail('');
                setSelectedRole('player');
              }}
              isEditing={false}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default RolesAdmin;
