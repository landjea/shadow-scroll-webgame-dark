
import React, { useState } from 'react';
import { User, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
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

interface Character {
  id: string;
  name: string;
  role: string;
  backstory: string;
  abilities: string[];
  is_playable: boolean;
}

const CharactersAdmin: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [editCharacter, setEditCharacter] = useState<Character | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    backstory: '',
    abilities: '',
    is_playable: false
  });

  const { data: characters, isLoading, refetch } = useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as Character[];
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      backstory: '',
      abilities: '',
      is_playable: false
    });
    setEditCharacter(null);
  };

  const openEditDialog = (character: Character) => {
    setEditCharacter(character);
    setFormData({
      name: character.name,
      role: character.role,
      backstory: character.backstory,
      abilities: character.abilities.join(', '),
      is_playable: character.is_playable
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const abilities = formData.abilities
        .split(',')
        .map(ability => ability.trim())
        .filter(ability => ability);
        
      if (editCharacter) {
        // Update existing character
        const { error } = await supabase
          .from('characters')
          .update({
            name: formData.name,
            role: formData.role,
            backstory: formData.backstory,
            abilities: abilities,
            is_playable: formData.is_playable
          })
          .eq('id', editCharacter.id);
          
        if (error) throw error;
        
        toast({
          title: 'Character updated',
          description: `${formData.name} has been updated.`
        });
      } else {
        // Create new character
        const { error } = await supabase
          .from('characters')
          .insert({
            name: formData.name,
            role: formData.role,
            backstory: formData.backstory,
            abilities: abilities,
            is_playable: formData.is_playable
          });
          
        if (error) throw error;
        
        toast({
          title: 'Character created',
          description: `${formData.name} has been added to the game.`
        });
      }
      
      setOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving character:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save character.'
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Character deleted',
        description: `${name} has been removed from the game.`
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete character.'
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
          <h1 className="text-3xl font-bold text-purple-800">Character Management</h1>
          <p className="text-gray-600">Create and manage superhero characters</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Character
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editCharacter ? 'Edit Character' : 'Add New Character'}</DialogTitle>
              <DialogDescription>
                {editCharacter 
                  ? `Make changes to ${editCharacter.name}.` 
                  : 'Fill out the form below to create a new character.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">Role</Label>
                  <Input 
                    id="role" 
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="backstory" className="text-right">Backstory</Label>
                  <Input 
                    id="backstory" 
                    name="backstory"
                    value={formData.backstory}
                    onChange={handleInputChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="abilities" className="text-right">Abilities</Label>
                  <Input 
                    id="abilities" 
                    name="abilities"
                    value={formData.abilities}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    placeholder="Super strength, Flight, etc. (comma separated)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_playable" className="text-right">Playable</Label>
                  <div className="col-span-3">
                    <Input 
                      id="is_playable" 
                      name="is_playable"
                      type="checkbox"
                      checked={formData.is_playable}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_playable" className="ml-2">
                      Character can be played by users
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
                  {editCharacter ? 'Save Changes' : 'Add Character'}
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
      ) : characters?.length === 0 ? (
        <div className="text-center my-12 p-8 border border-dashed rounded-lg">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No characters found</h3>
          <p className="text-gray-600 mb-4">Start by adding some characters to your game.</p>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Character
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all characters in the game.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Abilities</TableHead>
              <TableHead>Playable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {characters?.map((character) => (
              <TableRow key={character.id}>
                <TableCell className="font-medium">{character.name}</TableCell>
                <TableCell>{character.role}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {character.abilities.map((ability, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                      >
                        {ability}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {character.is_playable ? 
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Yes</span> : 
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">No</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(character)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(character.id, character.name)}
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

export default CharactersAdmin;
