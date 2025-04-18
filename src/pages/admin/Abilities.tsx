
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
import { Ability } from '@/types/admin';

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
    closeDialog,
    setEditItem
  } = useAdminTable<Ability>({
    tableName: 'abilities',
    queryKey: 'abilities',
    orderByField: 'name'
  });

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
          addButtonText="Add Ability"
          buttonIcon={<PlusCircle className="h-4 w-4" />}
          onAddNew={openAddDialog}
        />
      ) : (
        <AbilitiesTable
          abilities={abilities}
          onDelete={handleDelete}
          onEdit={(ability) => {
            setEditItem(ability);
            setDialogOpen(true);
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
