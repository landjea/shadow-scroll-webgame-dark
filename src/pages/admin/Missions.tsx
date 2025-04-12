
import React, { useState } from 'react';
import { Award, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';

interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  rewards: string;
  location_id: string | null;
  is_active: boolean;
}

const MissionsAdmin: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [editMission, setEditMission] = useState<Mission | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'normal',
    rewards: '',
    location_id: '',
    is_active: true
  });

  const { data: missions, isLoading, refetch } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .order('title');
        
      if (error) throw error;
      return data as Mission[];
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'normal',
      rewards: '',
      location_id: '',
      is_active: true
    });
    setEditMission(null);
  };

  const openEditDialog = (mission: Mission) => {
    setEditMission(mission);
    setFormData({
      title: mission.title,
      description: mission.description,
      difficulty: mission.difficulty,
      rewards: mission.rewards,
      location_id: mission.location_id || '',
      is_active: mission.is_active
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const missionData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        rewards: formData.rewards,
        location_id: formData.location_id || null,
        is_active: formData.is_active
      };
      
      if (editMission) {
        // Update existing mission
        const { error } = await supabase
          .from('missions')
          .update(missionData)
          .eq('id', editMission.id);
          
        if (error) throw error;
        
        toast({
          title: 'Mission updated',
          description: `${formData.title} has been updated.`
        });
      } else {
        // Create new mission
        const { error } = await supabase
          .from('missions')
          .insert(missionData);
          
        if (error) throw error;
        
        toast({
          title: 'Mission created',
          description: `${formData.title} has been added to the game.`
        });
      }
      
      setOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving mission:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save mission.'
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Mission deleted',
        description: `${title} has been removed from the game.`
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete mission.'
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Mission Management</h1>
          <p className="text-gray-600">Create and manage superhero missions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Mission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editMission ? 'Edit Mission' : 'Add New Mission'}</DialogTitle>
              <DialogDescription>
                {editMission 
                  ? `Make changes to ${editMission.title}.` 
                  : 'Fill out the form below to create a new mission.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3 min-h-24" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="difficulty" className="text-right">Difficulty</Label>
                  <Input 
                    id="difficulty" 
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                    placeholder="easy, normal, hard, expert"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rewards" className="text-right">Rewards</Label>
                  <Input 
                    id="rewards" 
                    name="rewards"
                    value={formData.rewards}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location_id" className="text-right">Location ID</Label>
                  <Input 
                    id="location_id" 
                    name="location_id"
                    value={formData.location_id}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    placeholder="Optional location ID"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_active" className="text-right">Active</Label>
                  <div className="col-span-3">
                    <Input 
                      id="is_active" 
                      name="is_active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_active" className="ml-2">
                      Mission is currently active
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editMission ? 'Save Changes' : 'Add Mission'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : missions?.length === 0 ? (
        <div className="text-center my-12 p-8 border border-dashed rounded-lg">
          <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No missions found</h3>
          <p className="text-gray-600 mb-4">Start by adding some missions to your game.</p>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Mission
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all missions in the game.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Rewards</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions?.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.title}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mission.difficulty === 'expert' ? 'bg-red-100 text-red-800' :
                    mission.difficulty === 'hard' ? 'bg-orange-100 text-orange-800' :
                    mission.difficulty === 'normal' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {mission.difficulty}
                  </span>
                </TableCell>
                <TableCell>{mission.rewards}</TableCell>
                <TableCell>
                  {mission.is_active ? 
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span> : 
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Inactive</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(mission)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(mission.id, mission.title)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MissionsAdmin;
