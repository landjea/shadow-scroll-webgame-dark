
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
import AdminStatus from '@/components/admin/AdminStatus';

// Define the story interface
interface Story {
  id: string;
  title: string;
  content: string;
  sequence: number;
  is_published: boolean;
  requirements: string | null;
  created_at: string;
  updated_at: string;
}

// Story form data type (without id and timestamps)
type StoryFormData = Omit<Story, 'id' | 'created_at' | 'updated_at'>;

const StoriesAdmin: React.FC = () => {
  const {
    items: stories,
    isLoading,
    dialogOpen,
    setDialogOpen,
    editItem,
    refetch,
    handleDelete,
    openAddDialog,
    closeDialog
  } = useAdminTable<Story>({
    tableName: 'stories',
    queryKey: 'stories',
    orderByField: 'sequence'
  });
  
  const {
    formData,
    handleInputChange,
    resetForm,
    submitting,
    handleSubmit,
    setFormForEditing
  } = useAdminForm<StoryFormData>({
    tableName: 'stories',
    initialFormState: {
      title: '',
      content: '',
      sequence: 1,
      is_published: false,
      requirements: null
    },
    onSuccess: () => {
      closeDialog();
      refetch();
    }
  });
  
  const handleEdit = (story: Story) => {
    setFormForEditing(story);
    setDialogOpen(true);
  };

  return (
    <AdminLayout
      title="Story Management"
      description="Manage your game's storyline and narrative content."
      action={
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Story
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState />
      ) : !stories || stories.length === 0 ? (
        <AdminEmptyState
          title="No stories found"
          description="You haven't created any story content yet. Get started by adding a new story."
          buttonText="Add Story"
          buttonIcon={<PlusCircle className="h-4 w-4" />}
          onButtonClick={openAddDialog}
        />
      ) : (
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left text-sm font-medium">Title</th>
                  <th className="p-3 text-left text-sm font-medium">Sequence</th>
                  <th className="p-3 text-left text-sm font-medium">Status</th>
                  <th className="p-3 text-left text-sm font-medium">Requirements</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.id} className="border-b">
                    <td className="p-3">
                      <div className="font-medium">{story.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                        {story.content}
                      </div>
                    </td>
                    <td className="p-3">{story.sequence}</td>
                    <td className="p-3">
                      <AdminStatus 
                        isActive={story.is_published} 
                        activeText="Published" 
                        inactiveText="Draft" 
                      />
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {story.requirements || 'None'}
                    </td>
                    <td className="p-3 text-right">
                      <AdminItemActions
                        onEdit={() => handleEdit(story)}
                        onDelete={() => handleDelete(story.id, story.title)}
                        compact
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editItem ? `Edit ${editItem.title}` : 'Add New Story'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => handleSubmit(e, editItem)}>
            <div className="space-y-4 py-2">
              <FormField
                label="Story Title"
                name="title"
                placeholder="e.g., Origin of the Hero"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Sequence Number"
                  name="sequence"
                  type="number"
                  value={formData.sequence.toString()}
                  onChange={handleInputChange}
                  required
                />
                
                <CheckboxField
                  label="Published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                />
              </div>
              
              <TextareaField
                label="Story Content"
                name="content"
                placeholder="Write your story content here..."
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                required
              />
              
              <TextareaField
                label="Requirements (optional)"
                name="requirements"
                placeholder="e.g., Complete Mission 'City in Danger'"
                value={formData.requirements || ''}
                onChange={handleInputChange}
              />
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

export default StoriesAdmin;
