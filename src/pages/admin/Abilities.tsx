
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useAdminTable } from '@/hooks/useAdminTable';
import { useAdminForm } from '@/hooks/useAdminForm';
import { Ability } from '@/types/admin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';
import AbilitiesTable from '@/components/admin/abilities/AbilitiesTable';
import AbilityForm from '@/components/admin/abilities/AbilityForm';

const initialFormState = {
  name: '',
  description: '',
  type: 'offensive',
  energy_cost: 10,
  cooldown: 0,
  is_active: true
};

const AbilitiesAdmin: React.FC = () => {
  const [editAbility, setEditAbility] = React.useState<Ability | null>(null);
  
  const {
    items: abilities,
    isLoading,
    dialogOpen,
    setDialogOpen,
    openAddDialog,
    handleDelete,
    refetch
  } = useAdminTable<Ability>({
    tableName: 'abilities',
    queryKey: 'abilities',
    orderByField: 'name'
  });

  const {
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormForEditing,
    submitting
  } = useAdminForm<Ability>({
    tableName: 'abilities',
    initialFormState,
    onSuccess: () => {
      setDialogOpen(false);
      setEditAbility(null);
      refetch();
    }
  });

  const handleOpenEditDialog = (ability: Ability) => {
    setEditAbility(ability);
    setFormForEditing(ability);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditAbility(null);
    resetForm();
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Ability Management"
        description="Create and manage superhero abilities"
        onAddNew={openAddDialog}
        addButtonText="Add Ability"
      />

      {isLoading ? (
        <LoadingState />
      ) : abilities?.length === 0 ? (
        <AdminEmptyState
          icon={Zap}
          title="No abilities found"
          description="Start by adding some abilities to your game."
          onAddNew={openAddDialog}
          addButtonText="Add First Ability"
        />
      ) : (
        <AbilitiesTable 
          abilities={abilities || []}
          onEdit={handleOpenEditDialog}
          onDelete={handleDelete}
        />
      )}

      <AbilityForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editAbility={editAbility}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={(e) => handleSubmit(e, editAbility)}
        onCancel={handleCloseDialog}
        isSubmitting={submitting}
      />
    </AdminLayout>
  );
};

export default AbilitiesAdmin;
