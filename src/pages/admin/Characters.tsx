
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminTable } from '@/hooks/useAdminTable';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';
import FormField from '@/components/admin/FormField';
import TextareaField from '@/components/admin/TextareaField';
import CheckboxField from '@/components/admin/CheckboxField';
import DialogFooter from '@/components/admin/DialogFooter';
import AdminTag from '@/components/admin/AdminTag';
import AdminItemActions from '@/components/admin/AdminItemActions';

interface Character {
  id: string;
  name: string;
  role: string;
  backstory: string | null;
  is_playable: boolean;
  abilities: string[] | null;
  created_at: string;
  updated_at: string;
}

const CharactersAdmin: React.FC = () => {
  const { toast } = useToast();
  
  const {
    items: characters,
    isLoading,
    dialogOpen,
    setDialogOpen,
    editItem,
    refetch,
    handleDelete,
    openAddDialog,
    closeDialog
  } = useAdminTable<Character>({
    tableName: 'characters',
    queryKey: 'characters',
    orderByField: 'name'
  });
  
  const {
    formData,
    handleInputChange,
    updateFormField,
    resetForm,
    submitting,
    handleSubmit,
    setFormForEditing
  } = useAdminForm<Omit<Character, 'id' | 'created_at' | 'updated_at'>>({
    tableName: 'characters',
    initialFormState: {
      name: '',
      role: 'hero',
      backstory: '',
      is_playable: true,
      abilities: []
    },
    onSuccess: () => {
      closeDialog();
      refetch();
    }
  });
  
  const roleOptions = [
    { value: 'hero', label: 'Hero' },
    { value: 'villain', label: 'Villain' },
    { value: 'citizen', label: 'Citizen' },
    { value: 'sidekick', label: 'Sidekick' }
  ];
  
  const handleAbilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const abilities = e.target.value.split(',').map(ability => ability.trim());
    updateFormField('abilities', abilities);
  };
  
  const handleEdit = (character: Character) => {
    setFormForEditing(character);
    setDialogOpen(true);
  };
  
  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'hero': return 'bg-blue-500';
      case 'villain': return 'bg-red-500';
      case 'citizen': return 'bg-green-500';
      case 'sidekick': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AdminLayout
      title="Game Characters"
      description="Manage heroes, villains, and other characters in your game world."
      action={
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Character
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : !characters || characters.length === 0 ? (
        <AdminEmptyState
          title="No characters found"
          description="You haven't created any characters yet. Get started by adding a new hero or villain."
          addButtonText="Add Character"
          buttonIcon={<PlusCircle className="h-4 w-4" />}
          onAddNew={openAddDialog}
        />
      ) : (
        <div className="rounded-md border">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <div 
                key={character.id} 
                className="bg-card text-card-foreground rounded-lg shadow-sm border p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{character.name}</h3>
                  <AdminItemActions
                    onEdit={() => handleEdit(character)}
                    onDelete={() => handleDelete(character.id, character.name)}
                  />
                </div>
                
                <div className="mb-2">
                  <AdminTag
                    label={character.role}
                    className={`${getRoleColor(character.role)} text-white`}
                  />
                  {character.is_playable && (
                    <AdminTag
                      label="Playable"
                      className="bg-violet-500 text-white ml-2"
                    />
                  )}
                </div>
                
                {character.backstory && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {character.backstory}
                  </p>
                )}
                
                {character.abilities && character.abilities.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-xs text-muted-foreground mb-1">Abilities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {character.abilities.map((ability, index) => (
                        <span 
                          key={index}
                          className="inline-block bg-primary/10 text-primary text-xs rounded px-2 py-0.5"
                        >
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editItem ? `Edit ${editItem.name}` : 'Add New Character'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => handleSubmit(e, editItem)}>
            <div className="space-y-4 py-2">
              <FormField
                id="name"
                label="Character Name"
                name="name"
                placeholder="e.g., Superman"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <CheckboxField
                  id="is_playable"
                  label="Playable Character"
                  name="is_playable"
                  checked={formData.is_playable}
                  onChange={handleInputChange}
                  description="Can be played by users"
                />
              </div>
              
              <TextareaField
                id="backstory"
                label="Backstory"
                name="backstory"
                placeholder="Character's origin story and background..."
                value={formData.backstory || ''}
                onChange={handleInputChange}
              />
              
              <FormField
                id="abilities"
                label="Abilities (comma separated)"
                name="abilities"
                placeholder="e.g., Flight, Super Strength, Heat Vision"
                value={formData.abilities ? formData.abilities.join(', ') : ''}
                onChange={handleAbilityChange}
              />
            </div>
            
            <DialogFooter
              onCancel={() => {
                closeDialog();
                resetForm();
              }}
              isSubmitting={submitting}
              isEditing={!!editItem}
            />
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default CharactersAdmin;
