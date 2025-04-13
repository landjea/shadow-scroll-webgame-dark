
import React from 'react';
import { Zap } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Ability } from '@/types/admin';
import { useAdminTable } from '@/hooks/useAdminTable';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import LoadingState from '@/components/admin/LoadingState';
import AdminStatus from '@/components/admin/AdminStatus';
import AdminItemActions from '@/components/admin/AdminItemActions';
import AdminDialogFooter from '@/components/admin/DialogFooter';

const initialFormState = {
  name: '',
  description: '',
  type: 'offensive',
  energy_cost: 10,
  cooldown: 0,
  is_active: true
};

const AbilitiesAdmin: React.FC = () => {
  const [editAbility, setEditAbility] = useState<Ability | null>(null);
  
  const {
    items: abilities,
    isLoading,
    dialogOpen,
    setDialogOpen,
    openAddDialog,
    openEditDialog,
    closeDialog,
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
  } = useAdminForm<Ability, typeof initialFormState>({
    tableName: 'abilities',
    initialFormState,
    itemToFormData: (ability) => ({
      name: ability.name,
      description: ability.description || '',
      type: ability.type,
      energy_cost: ability.energy_cost,
      cooldown: ability.cooldown,
      is_active: ability.is_active
    }),
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
        <Table>
          <TableCaption>A list of all abilities in the game.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Energy Cost</TableHead>
              <TableHead>Cooldown</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abilities?.map((ability) => (
              <TableRow key={ability.id}>
                <TableCell className="font-medium">{ability.name}</TableCell>
                <TableCell>{ability.type}</TableCell>
                <TableCell>{ability.energy_cost}</TableCell>
                <TableCell>{ability.cooldown}</TableCell>
                <TableCell>
                  <AdminStatus 
                    value={ability.is_active}
                    activeText="Active"
                    inactiveText="Inactive"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <AdminItemActions
                    onEdit={() => handleOpenEditDialog(ability)}
                    onDelete={() => handleDelete(ability.id, ability.name)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editAbility ? 'Edit Ability' : 'Add New Ability'}</DialogTitle>
            <DialogDescription>
              {editAbility 
                ? `Make changes to ${editAbility.name}.` 
                : 'Fill out the form below to create a new ability.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, editAbility)}>
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
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3 min-h-32" 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1"
                >
                  <option value="offensive">Offensive</option>
                  <option value="defensive">Defensive</option>
                  <option value="utility">Utility</option>
                  <option value="movement">Movement</option>
                  <option value="healing">Healing</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="energy_cost" className="text-right">Energy Cost</Label>
                <Input 
                  id="energy_cost" 
                  name="energy_cost"
                  type="number"
                  min={0}
                  value={formData.energy_cost}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cooldown" className="text-right">Cooldown (s)</Label>
                <Input 
                  id="cooldown" 
                  name="cooldown"
                  type="number"
                  min={0}
                  value={formData.cooldown}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
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
                    Ability is currently active
                  </Label>
                </div>
              </div>
            </div>
            <AdminDialogFooter
              onCancel={() => {
                closeDialog();
                resetForm();
              }}
              isEditing={!!editAbility}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AbilitiesAdmin;
