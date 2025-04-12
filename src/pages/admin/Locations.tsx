import React, { useState } from 'react';
import { Map, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
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
import { Location } from '@/types/admin';

const LocationsAdmin: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    x_coord: 0,
    y_coord: 0,
    is_unlocked: true
  });

  const { data: locations, isLoading, refetch } = useQuery({
    queryKey: ['map-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('map_locations')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as Location[];
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? checked 
        : (name === 'x_coord' || name === 'y_coord') 
          ? parseInt(value) || 0 
          : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: '',
      x_coord: 0,
      y_coord: 0,
      is_unlocked: true
    });
    setEditLocation(null);
  };

  const openEditDialog = (location: Location) => {
    setEditLocation(location);
    setFormData({
      name: location.name,
      description: location.description,
      type: location.type,
      x_coord: location.x_coord,
      y_coord: location.y_coord,
      is_unlocked: location.is_unlocked
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const locationData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        x_coord: formData.x_coord,
        y_coord: formData.y_coord,
        is_unlocked: formData.is_unlocked
      };
      
      if (editLocation) {
        // Update existing location
        const { error } = await supabase
          .from('map_locations')
          .update(locationData)
          .eq('id', editLocation.id);
          
        if (error) throw error;
        
        toast({
          title: 'Location updated',
          description: `${formData.name} has been updated.`
        });
      } else {
        // Create new location
        const { error } = await supabase
          .from('map_locations')
          .insert(locationData);
          
        if (error) throw error;
        
        toast({
          title: 'Location created',
          description: `${formData.name} has been added to the map.`
        });
      }
      
      setOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save location.'
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('map_locations')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Location deleted',
        description: `${name} has been removed from the map.`
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete location.'
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
          <h1 className="text-3xl font-bold text-purple-800">Map Location Management</h1>
          <p className="text-gray-600">Create and manage locations on the game map</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
              <DialogDescription>
                {editLocation 
                  ? `Make changes to ${editLocation.name}.` 
                  : 'Fill out the form below to add a new location to the map.'}
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
                  <Label htmlFor="description" className="text-right">Description</Label>
                  <Input 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Input 
                    id="type" 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                    placeholder="city, building, park, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="x_coord" className="text-right">X Coordinate</Label>
                  <Input 
                    id="x_coord" 
                    name="x_coord"
                    type="number"
                    value={formData.x_coord}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="y_coord" className="text-right">Y Coordinate</Label>
                  <Input 
                    id="y_coord" 
                    name="y_coord"
                    type="number"
                    value={formData.y_coord}
                    onChange={handleInputChange}
                    className="col-span-3" 
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_unlocked" className="text-right">Unlocked</Label>
                  <div className="col-span-3">
                    <Input 
                      id="is_unlocked" 
                      name="is_unlocked"
                      type="checkbox"
                      checked={formData.is_unlocked}
                      onChange={handleInputChange}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_unlocked" className="ml-2">
                      Location is unlocked by default
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
                  {editLocation ? 'Save Changes' : 'Add Location'}
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
      ) : locations?.length === 0 ? (
        <div className="text-center my-12 p-8 border border-dashed rounded-lg">
          <Map className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No locations found</h3>
          <p className="text-gray-600 mb-4">Start by adding some locations to your game map.</p>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Location
          </Button>
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all locations on the game map.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations?.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>{location.type}</TableCell>
                <TableCell>({location.x_coord}, {location.y_coord})</TableCell>
                <TableCell>
                  {location.is_unlocked ? 
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Unlocked</span> : 
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Locked</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(location)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(location.id, location.name)}
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

export default LocationsAdmin;
