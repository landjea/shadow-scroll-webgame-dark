
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminTable } from '@/hooks/useAdminTable';
import AbilitiesTable from '@/components/admin/abilities/AbilitiesTable';
import AbilityForm from '@/components/admin/abilities/AbilityForm';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';

// Define the Ability type
export interface Ability {
  id: string;
  name: string;
  description: string;
  type: string;
  energy_cost: number;
  cooldown: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const Abilities: React.FC = () => {
  const {
    items: abilities,
    isLoading,
    dialogOpen,
    setDialogOpen,
    editItem,
    refetch,
    handleDelete,
    openAddDialog,
    closeDialog
  } = useAdminTable<Ability>({
    tableName: 'abilities',
    queryKey: 'abilities',
    orderByField: 'name'
  });
  
  const initialFormState: Omit<Ability, 'id' | 'created_at' | 'updated_at'> & { id?: string } = {
    name: '',
    description: '',
    type: 'attack',
    energy_cost: 10,
    cooldown: 0,
    is_active: true
  };

  return (
    <AdminLayout
      title="Hero Abilities"
      description="Manage the special abilities that heroes can use in the game."
      action={
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Ability
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : !abilities || abilities.length === 0 ? (
        <AdminEmptyState
          title="No abilities found"
          description="You haven't created any abilities yet. Get started by adding a new ability."
          buttonText="Add Ability"
          buttonIcon={<PlusCircle className="h-4 w-4" />}
          onButtonClick={openAddDialog}
        />
      ) : (
        <AbilitiesTable
          abilities={abilities}
          onDelete={handleDelete}
          onEdit={ability => {
            setDialogOpen(true);
            // Explicitly cast to Ability to ensure type safety
            const abilityWithId = ability as Ability;
            // Now pass the ability with confirmed id
            if (abilityWithId.id) {
              openEditDialog(abilityWithId);
            }
          }}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editItem ? `Edit ${editItem.name}` : 'Add New Ability'}
            </DialogTitle>
          </DialogHeader>
          <AbilityForm
            ability={editItem}
            onSuccess={() => {
              closeDialog();
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Abilities;
