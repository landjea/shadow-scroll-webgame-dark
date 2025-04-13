
import React, { useState } from 'react';
import { Award } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Mission } from '@/types/admin';
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
  title: '',
  description: '',
  difficulty: 'normal',
  rewards: '',
  location_id: '',
  is_active: true
};

const getDifficultyClassName = (difficulty: string) => {
  switch (difficulty) {
    case 'expert': return 'bg-red-100 text-red-800';
    case 'hard': return 'bg-orange-100 text-orange-800';
    case 'normal': return 'bg-blue-100 text-blue-800';
    default: return 'bg-green-100 text-green-800';
  }
};

const MissionsAdmin: React.FC = () => {
  const { toast } = useToast();
  const [editMission, setEditMission] = useState<Mission | null>(null);
  
  const {
    items: missions,
    isLoading,
    dialogOpen,
    setDialogOpen,
    openAddDialog,
    closeDialog,
    handleDelete,
    refetch
  } = useAdminTable<Mission>({
    tableName: 'missions',
    queryKey: 'missions',
    orderByField: 'title'
  });

  const {
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormForEditing,
    submitting
  } = useAdminForm<Mission, typeof initialFormState>({
    tableName: 'missions',
    initialFormState,
    itemToFormData: (mission) => ({
      title: mission.title,
      description: mission.description,
      difficulty: mission.difficulty,
      rewards: mission.rewards,
      location_id: mission.location_id || '',
      is_active: mission.is_active
    }),
    onSuccess: () => {
      setDialogOpen(false);
      setEditMission(null);
      refetch();
    }
  });

  const handleOpenEditDialog = (mission: Mission) => {
    setEditMission(mission);
    setFormForEditing(mission);
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Mission Management"
        description="Create and manage superhero missions"
        onAddNew={openAddDialog}
        addButtonText="Add Mission"
      />

      {isLoading ? (
        <LoadingState />
      ) : missions?.length === 0 ? (
        <AdminEmptyState
          icon={Award}
          title="No missions found"
          description="Start by adding some missions to your game."
          onAddNew={openAddDialog}
          addButtonText="Add First Mission"
        />
      ) : (
        <Table>
          <TableCaption>A list of all missions in the game.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Rewards</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions?.map((mission) => (
              <TableRow key={mission.id}>
                <TableCell className="font-medium">{mission.title}</TableCell>
                <TableCell>
                  <AdminTag 
                    text={mission.difficulty} 
                    className={getDifficultyClassName(mission.difficulty)}
                  />
                </TableCell>
                <TableCell>{mission.rewards}</TableCell>
                <TableCell>
                  <AdminStatus
                    value={mission.is_active}
                    activeText="Active"
                    inactiveText="Inactive"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <AdminItemActions
                    onEdit={() => handleOpenEditDialog(mission)}
                    onDelete={() => handleDelete(mission.id, mission.title)}
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
            <DialogTitle>{editMission ? 'Edit Mission' : 'Add New Mission'}</DialogTitle>
            <DialogDescription>
              {editMission 
                ? `Make changes to ${editMission.title}.` 
                : 'Fill out the form below to create a new mission.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, editMission)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  value={formData.title}
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
                  className="col-span-3 min-h-24" 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="difficulty" className="text-right">Difficulty</Label>
                <Input 
                  id="difficulty" 
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
                  placeholder="easy, normal, hard, expert"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rewards" className="text-right">Rewards</Label>
                <Input 
                  id="rewards" 
                  name="rewards"
                  value={formData.rewards}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location_id" className="text-right">Location ID</Label>
                <Input 
                  id="location_id" 
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="Optional location ID"
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
                    Mission is currently active
                  </Label>
                </div>
              </div>
            </div>
            <AdminDialogFooter
              onCancel={() => {
                closeDialog();
                resetForm();
              }}
              isEditing={!!editMission}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default MissionsAdmin;
