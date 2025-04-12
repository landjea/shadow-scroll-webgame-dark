
import React from 'react';
import { User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
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
import { Character } from '@/types/admin';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminItemActions from '@/components/admin/AdminItemActions';
import AdminStatus from '@/components/admin/AdminStatus';
import AdminTag from '@/components/admin/AdminTag';
import FormField from '@/components/admin/FormField';
import CheckboxField from '@/components/admin/CheckboxField';
import AdminDialogFooter from '@/components/admin/DialogFooter';
import LoadingState from '@/components/admin/LoadingState';
import { useAdminTable } from '@/hooks/useAdminTable';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminLayout from '@/components/admin/AdminLayout';

interface CharacterFormData {
  name: string;
  role: string;
  backstory: string;
  abilities: string;
  is_playable: boolean;
}

const CharactersAdmin: React.FC = () => {
  const {
    items: characters,
    isLoading,
    refetch,
    dialogOpen, 
    setDialogOpen,
    editItem,
    handleDelete,
    openAddDialog,
    openEditDialog,
    closeDialog
  } = useAdminTable<Character>({
    tableName: 'characters',
    queryKey: 'characters',
    orderByField: 'name'
  });

  const initialFormState: CharacterFormData = {
    name: '',
    role: '',
    backstory: '',
    abilities: '',
    is_playable: false
  };

  const itemToFormData = (character: Character): CharacterFormData => ({
    name: character.name,
    role: character.role,
    backstory: character.backstory || '',
    abilities: character.abilities.join(', '),
    is_playable: character.is_playable
  });

  const {
    formData,
    handleInputChange,
    resetForm,
    setFormForEditing,
    handleSubmit,
    submitting
  } = useAdminForm<Character, CharacterFormData>({
    tableName: 'characters',
    initialFormState,
    itemToFormData,
    onSuccess: () => {
      setDialogOpen(false);
      refetch();
    }
  });

  const handleOpenEditDialog = (character: Character) => {
    setFormForEditing(character);
    openEditDialog(character);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert comma-separated abilities to array
    const abilities = formData.abilities
      .split(',')
      .map(ability => ability.trim())
      .filter(ability => ability);
      
    const dataToSubmit = {
      ...formData,
      abilities
    };
    
    try {
      if (editItem) {
        const { error } = await supabase
          .from('characters')
          .update(dataToSubmit)
          .eq('id', editItem.id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('characters')
          .insert(dataToSubmit);
          
        if (error) throw error;
      }
      
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    closeDialog();
    resetForm();
  };

  return (
    <AdminLayout>
      <AdminHeader 
        title="Character Management"
        description="Create and manage superhero characters"
        onAddNew={openAddDialog}
        addButtonText="Add Character"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Character' : 'Add New Character'}</DialogTitle>
            <DialogDescription>
              {editItem 
                ? `Make changes to ${editItem.name}.` 
                : 'Fill out the form below to create a new character.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <FormField 
                id="name" 
                label="Name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormField 
                id="role" 
                label="Role" 
                value={formData.role} 
                onChange={handleInputChange} 
                required 
              />
              
              <FormField 
                id="backstory" 
                label="Backstory" 
                value={formData.backstory} 
                onChange={handleInputChange} 
              />
              
              <FormField 
                id="abilities" 
                label="Abilities" 
                value={formData.abilities} 
                onChange={handleInputChange} 
                placeholder="Super strength, Flight, etc. (comma separated)"
              />
              
              <CheckboxField 
                id="is_playable"
                label="Playable"
                checked={formData.is_playable}
                onChange={handleInputChange}
                description="Character can be played by users"
              />
            </div>
            <AdminDialogFooter 
              onCancel={handleCancel}
              isEditing={!!editItem}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <LoadingState />
      ) : characters?.length === 0 ? (
        <AdminEmptyState 
          icon={User}
          title="No characters found"
          description="Start by adding some characters to your game."
          onAddNew={openAddDialog}
          addButtonText="Add First Character"
        />
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
                      <AdminTag key={index} text={ability} />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <AdminStatus 
                    value={character.is_playable}
                    activeText="Yes"
                    inactiveText="No"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <AdminItemActions
                    onEdit={() => handleOpenEditDialog(character)}
                    onDelete={() => handleDelete(character.id, character.name)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  );
};

export default CharactersAdmin;
