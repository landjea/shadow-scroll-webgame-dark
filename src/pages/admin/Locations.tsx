
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminTable } from '@/hooks/useAdminTable';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';
import FormField from '@/components/admin/FormField';
import TextareaField from '@/components/admin/TextareaField';
import CheckboxField from '@/components/admin/CheckboxField';
import DialogFooter from '@/components/admin/DialogFooter';
import AdminItemActions from '@/components/admin/AdminItemActions';
import AdminTag from '@/components/admin/AdminTag';

// Define the location interface
interface Location {
  id: string;
  name: string;
  type: string;
  description: string | null;
  is_unlocked: boolean;
  x_coord: number;
  y_coord: number;
  created_at: string;
  updated_at: string;
}

// Location form data type (without id and timestamps)
type LocationFormData = Omit<Location, 'id' | 'created_at' | 'updated_at'>;

const LocationsAdmin: React.FC = () => {
  const {
    items: locations,
    isLoading,
    dialogOpen,
    setDialogOpen,
    editItem,
    refetch,
    handleDelete,
    openAddDialog,
    closeDialog
  } = useAdminTable<Location>({
    tableName: 'map_locations',
    queryKey: 'locations',
    orderByField: 'name'
  });
  
  const {
    formData,
    handleInputChange,
    resetForm,
    submitting,
    handleSubmit,
    setFormForEditing
  } = useAdminForm<LocationFormData>({
    tableName: 'map_locations',
    initialFormState: {
      name: '',
      type: 'city',
      description: '',
      is_unlocked: true,
      x_coord: 0,
      y_coord: 0
    },
    onSuccess: () => {
      closeDialog();
      refetch();
    }
  });
  
  const locationTypes = [
    { value: 'city', label: 'City' },
    { value: 'dungeon', label: 'Dungeon' },
    { value: 'forest', label: 'Forest' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'beach', label: 'Beach' },
    { value: 'desert', label: 'Desert' }
  ];
  
  const handleEdit = (location: Location) => {
    setFormForEditing(location);
    setDialogOpen(true);
  };
  
  const getLocationTypeColor = (type: string): string => {
    switch (type) {
      case 'city': return 'bg-blue-500';
      case 'dungeon': return 'bg-purple-500';
      case 'forest': return 'bg-green-500';
      case 'mountain': return 'bg-gray-500';
      case 'beach': return 'bg-yellow-500';
      case 'desert': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <AdminLayout
      title="Map Locations"
      description="Manage locations on your game world map that players can explore."
      action={
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Location
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : !locations || locations.length === 0 ? (
        <AdminEmptyState
          title="No locations found"
          description="You haven't created any map locations yet. Get started by adding a new location."
          buttonText="Add Location"
          buttonIcon={<PlusCircle className="h-4 w-4" />}
          onButtonClick={openAddDialog}
        />
      ) : (
        <div className="rounded-md border">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div 
                key={location.id} 
                className="bg-card text-card-foreground rounded-lg shadow-sm border p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{location.name}</h3>
                  <AdminItemActions
                    onEdit={() => handleEdit(location)}
                    onDelete={() => handleDelete(location.id, location.name)}
                  />
                </div>
                
                <div className="mb-2 flex items-center gap-2">
                  <AdminTag
                    label={location.type}
                    className={`${getLocationTypeColor(location.type)} text-white`}
                  />
                  {!location.is_unlocked && (
                    <AdminTag
                      label="Locked"
                      className="bg-red-500 text-white"
                    />
                  )}
                </div>
                
                {location.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {location.description}
                  </p>
                )}
                
                <div className="text-xs text-muted-foreground">
                  Coordinates: ({location.x_coord}, {location.y_coord})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editItem ? `Edit ${editItem.name}` : 'Add New Location'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => handleSubmit(e, editItem)}>
            <div className="space-y-4 py-2">
              <FormField
                label="Location Name"
                name="name"
                placeholder="e.g., Crystal Falls"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Location Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {locationTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <CheckboxField
                  label="Unlocked"
                  name="is_unlocked"
                  checked={formData.is_unlocked}
                  onChange={handleInputChange}
                />
              </div>
              
              <TextareaField
                label="Description"
                name="description"
                placeholder="Describe this location and what players can find here..."
                value={formData.description || ''}
                onChange={handleInputChange}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="X Coordinate"
                  name="x_coord"
                  type="number"
                  value={formData.x_coord.toString()}
                  onChange={handleInputChange}
                  required
                />
                
                <FormField
                  label="Y Coordinate"
                  name="y_coord"
                  type="number"
                  value={formData.y_coord.toString()}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <DialogFooter
              onCancel={() => {
                closeDialog();
                resetForm();
              }}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default LocationsAdmin;
