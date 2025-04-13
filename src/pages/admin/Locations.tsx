
import React, { useState } from 'react';
import { Map } from 'lucide-react';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Location } from '@/types/admin';
import { useAdminTable } from '@/hooks/useAdminTable';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';
import AdminStatus from '@/components/admin/AdminStatus';
import AdminItemActions from '@/components/admin/AdminItemActions';
import AdminDialogFooter from '@/components/admin/DialogFooter';
import AdminTag from '@/components/admin/AdminTag';

const initialFormState = {
  name: '',
  description: '',
  type: '',
  x_coord: 0,
  y_coord: 0,
  is_unlocked: true
};

const LocationsAdmin: React.FC = () => {
  const { toast } = useToast();
  const [editLocation, setEditLocation] = useState<Location | null>(null);
  
  const {
    items: locations,
    isLoading,
    dialogOpen,
    setDialogOpen,
    openAddDialog,
    closeDialog,
    handleDelete,
    refetch
  } = useAdminTable<Location>({
    tableName: 'map_locations',
    queryKey: 'map-locations',
    orderByField: 'name'
  });

  const {
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormForEditing,
    submitting
  } = useAdminForm<Location, typeof initialFormState>({
    tableName: 'map_locations',
    initialFormState,
    itemToFormData: (location) => ({
      name: location.name,
      description: location.description || '',
      type: location.type,
      x_coord: location.x_coord,
      y_coord: location.y_coord,
      is_unlocked: location.is_unlocked
    }),
    onSuccess: () => {
      setDialogOpen(false);
      setEditLocation(null);
      refetch();
    }
  });

  const handleOpenEditDialog = (location: Location) => {
    setEditLocation(location);
    setFormForEditing(location);
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Map Location Management"
        description="Create and manage locations on the game map"
        onAddNew={openAddDialog}
        addButtonText="Add Location"
      />

      {isLoading ? (
        <LoadingState />
      ) : locations?.length === 0 ? (
        <AdminEmptyState
          icon={Map}
          title="No locations found"
          description="Start by adding some locations to your game map."
          onAddNew={openAddDialog}
          addButtonText="Add First Location"
        />
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
                <TableCell>
                  <AdminTag text={location.type} className="bg-blue-100 text-blue-800" />
                </TableCell>
                <TableCell>({location.x_coord}, {location.y_coord})</TableCell>
                <TableCell>
                  <AdminStatus 
                    value={location.is_unlocked}
                    activeText="Unlocked"
                    inactiveText="Locked"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <AdminItemActions
                    onEdit={() => handleOpenEditDialog(location)}
                    onDelete={() => handleDelete(location.id, location.name)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editLocation ? 'Edit Location' : 'Add New Location'}</DialogTitle>
            <DialogDescription>
              {editLocation 
                ? `Make changes to ${editLocation.name}.` 
                : 'Fill out the form below to add a new location to the map.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, editLocation)}>
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
            <AdminDialogFooter
              onCancel={() => {
                closeDialog();
                resetForm();
              }}
              isEditing={!!editLocation}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default LocationsAdmin;
