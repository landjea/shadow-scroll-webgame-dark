
import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';
import SearchBox from '@/components/admin/roles/SearchBox';
import RolesTable from '@/components/admin/roles/RolesTable';
import RoleForm from '@/components/admin/roles/RoleForm';

const RolesAdmin: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'player'>('player');

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
        <SearchBox 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by email..."
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : !filteredRoles || filteredRoles.length === 0 ? (
        <AdminEmptyState
          title="No roles found"
          description={searchQuery ? "No roles matching your search criteria." : "Start by adding roles to users."}
          addButtonText="Add First Role"
          onAddNew={() => setDialogOpen(true)}
          buttonIcon={<Shield className="h-4 w-4" />}
        />
      ) : (
        <RolesTable 
          roles={filteredRoles} 
          onDelete={handleDelete} 
        />
      )}

      <RoleForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onSubmit={handleAddRole}
        isSubmitting={submitting}
      />
    </AdminLayout>
  );
};

export default RolesAdmin;
