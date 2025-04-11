
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Package, Award, Zap, Shield, Map, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  userEmail: z.string().email()
});

interface AdminUser {
  id: string;
  email: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userEmail: ''
    }
  });

  useEffect(() => {
    if (isAdmin) {
      loadAdminUsers();
    }
  }, [isAdmin]);

  const loadAdminUsers = async () => {
    try {
      setLoading(true);
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');
      
      if (rolesError) throw rolesError;
      
      if (adminRoles && adminRoles.length > 0) {
        // Get user details for each admin
        const adminIds = adminRoles.map(role => role.user_id);
        
        // Use the get_user_email function instead of accessing auth.users directly
        const adminList: AdminUser[] = [];
        
        for (const id of adminIds) {
          const { data: email } = await supabase.rpc('get_user_email', { user_id: id });
            
          adminList.push({
            id,
            email: email || 'User ' + id.substring(0, 8)
          });
        }
        
        setAdminUsers(adminList);
      } else {
        setAdminUsers([]);
      }
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load admin users'
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      // First, we need to find the user by email
      // This needs a custom RPC call since we can't directly query auth.users
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_id_by_email', { email: values.userEmail });
      
      if (userError || !userData) {
        toast({
          variant: 'destructive',
          title: 'User not found',
          description: 'No user with that email exists or could not be found'
        });
        return;
      }
      
      const userId = userData;
      
      // Check if user is already an admin
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRole) {
        toast({
          title: 'Already an admin',
          description: 'This user already has admin privileges'
        });
        return;
      }
      
      // Add admin role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: 'Admin added',
        description: `${values.userEmail} is now an admin`
      });
      
      form.reset();
      loadAdminUsers();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add admin role'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (userId: string, email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (error) throw error;
      
      toast({
        title: 'Admin removed',
        description: `${email} is no longer an admin`
      });
      
      loadAdminUsers();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove admin role'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const adminCards = [
    {
      title: "Character Management",
      description: "Create and manage superhero profiles and attributes",
      icon: <User className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-100",
      path: "/character-stats"
    },
    {
      title: "Inventory Management",
      description: "Manage items, equipment and resources",
      icon: <Package className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-100",
      path: "/admin/inventory"
    },
    {
      title: "Mission Management",
      description: "Create, assign and track superhero missions",
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      color: "bg-yellow-100",
      path: "/admin/missions"
    },
    {
      title: "Ability Management",
      description: "Create and configure superhero abilities and powers",
      icon: <Zap className="h-6 w-6 text-green-500" />,
      color: "bg-green-100",
      path: "/admin/abilities"
    },
    {
      title: "RBAC Management",
      description: "Manage roles, permissions and access control",
      icon: <Shield className="h-6 w-6 text-red-500" />,
      color: "bg-red-100",
      path: "/admin/roles"
    },
    {
      title: "Map Management",
      description: "Configure city map, locations and points of interest",
      icon: <Map className="h-6 w-6 text-indigo-500" />,
      color: "bg-indigo-100",
      path: "/admin/map"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your superhero game settings and configurations</p>
      </header>
      
      {/* Admin Role Management */}
      <Card className="mb-8 border-t-4 border-purple-500">
        <CardHeader>
          <CardTitle>Admin Role Management</CardTitle>
          <CardDescription>Add or remove admin privileges for users</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addAdmin)} className="flex items-end gap-4 mb-6">
              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>User Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                Add Admin
              </Button>
            </form>
          </Form>
          
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Current Admins</h3>
            {loading ? (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
              </div>
            ) : adminUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No admins found</p>
            ) : (
              <ul className="space-y-2">
                {adminUsers.map(admin => (
                  <li key={admin.id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                    <span>{admin.email}</span>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeAdmin(admin.id, admin.email)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} className="border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold">{card.title}</CardTitle>
                <div className={`p-2 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 min-h-[3rem]">
                {card.description}
              </CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                onClick={() => navigate(card.path)}
              >
                Manage
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
