
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
import AdminStatus from '@/components/admin/AdminStatus';

// Define the mission interface
interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  rewards: string;
  is_active: boolean;
  location_id: string | null;
  created_at: string;
  updated_at: string;
}

// Mission form data type (without id and timestamps)
type MissionFormData = Omit<Mission, 'id' | 'created_at' | 'updated_at'>;

const MissionsAdmin: React.FC = () => {
  const {
    items: missions,
    isLoading,
    dialogOpen,
    setDialogOpen,
    editItem,
    refetch,
    handleDelete,
    openAddDialog,
    closeDialog
  } = useAdminTable<Mission>({
    tableName: 'missions',
    queryKey: 'missions',
    orderByField: 'title'
  });
  
  const {
    formData,
    handleInputChange,
    resetForm,
    submitting,
    handleSubmit,
    setFormForEditing
  } = useAdminForm<MissionFormData>({
    tableName: 'missions',
    initialFormState: {
      title: '',
      description: '',
      difficulty: 'easy',
      rewards: '',
      is_active: true,
      location_id: null
    },
    onSuccess: () => {
      closeDialog();
      refetch();
    }
  });
  
  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'legendary', label: 'Legendary' }
  ];
  
  const handleEdit = (mission: Mission) => {
    setFormForEditing(mission);
    setDialogOpen(true);
  };
  
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'legendary': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <AdminLayout
      title="Game Missions"
      description="Manage missions and quests that players can undertake in the game."
      action={
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Mission
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : !missions || missions.length === 0 ? (
        <AdminEmptyState
          title="No missions found"
          description="You haven't created any missions yet. Get started by adding a new quest."
          addButtonText="Add Mission"
          buttonIcon={<PlusCircle className="h-4 w-4" />}
          onAddNew={openAddDialog}
        />
      ) : (
        <div className="rounded-md border">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <div 
                key={mission.id} 
                className="bg-card text-card-foreground rounded-lg shadow-sm border p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{mission.title}</h3>
                  <AdminItemActions
                    onEdit={() => handleEdit(mission)}
                    onDelete={() => handleDelete(mission.id, mission.title)}
                  />
                </div>
                
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <AdminTag
                    label={mission.difficulty}
                    className={`${getDifficultyColor(mission.difficulty)} text-white`}
                  />
                  <AdminStatus 
                    value={mission.is_active} 
                    activeText="Active" 
                    inactiveText="Inactive" 
                  />
                </div>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {mission.description}
                </p>
                
                <div className="text-xs font-medium mt-2 mb-1">Rewards:</div>
                <p className="text-xs text-muted-foreground">{mission.rewards}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editItem ? `Edit ${editItem.title}` : 'Add New Mission'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => handleSubmit(e, editItem)}>
            <div className="space-y-4 py-2">
              <FormField
                id="title"
                label="Mission Title"
                name="title"
                placeholder="e.g., Rescue the Mayor"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <CheckboxField
                  id="is_active"
                  label="Active Mission"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  description="Available to players"
                />
              </div>
              
              <TextareaField
                id="description"
                label="Mission Description"
                name="description"
                placeholder="Describe the mission objectives and story..."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              
              <TextareaField
                id="rewards"
                label="Rewards"
                name="rewards"
                placeholder="e.g., 500 XP, Legendary Cape, 1000 Gold"
                value={formData.rewards}
                onChange={handleInputChange}
                required
              />
              
              <FormField
                id="location_id"
                label="Location ID (optional)"
                name="location_id"
                placeholder="e.g., location-123"
                value={formData.location_id || ''}
                onChange={handleInputChange}
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

export default MissionsAdmin;
