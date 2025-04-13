
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
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
import { Story } from '@/types/admin';
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
  title: '',
  content: '',
  sequence: 1,
  is_published: false,
  requirements: ''
};

const StoriesAdmin: React.FC = () => {
  const { toast } = useToast();
  const [editStory, setEditStory] = useState<Story | null>(null);
  
  const {
    items: stories,
    isLoading,
    dialogOpen,
    setDialogOpen,
    openAddDialog,
    openEditDialog,
    closeDialog,
    handleDelete,
    refetch
  } = useAdminTable<Story>({
    tableName: 'stories',
    queryKey: 'stories',
    orderByField: 'sequence'
  });

  const {
    formData,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormForEditing,
    submitting
  } = useAdminForm<Story, typeof initialFormState>({
    tableName: 'stories',
    initialFormState,
    itemToFormData: (story) => ({
      title: story.title,
      content: story.content,
      sequence: story.sequence,
      is_published: story.is_published,
      requirements: story.requirements || ''
    }),
    onSuccess: () => {
      setDialogOpen(false);
      setEditStory(null);
      refetch();
    }
  });

  const handleOpenEditDialog = (story: Story) => {
    setEditStory(story);
    setFormForEditing(story);
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Story Management"
        description="Create and manage game storylines"
        onAddNew={openAddDialog}
        addButtonText="Add Story"
      />

      {isLoading ? (
        <LoadingState />
      ) : stories?.length === 0 ? (
        <AdminEmptyState
          icon={BookOpen}
          title="No stories found"
          description="Start by adding some story chapters to your game."
          onAddNew={openAddDialog}
          addButtonText="Add First Story Chapter"
        />
      ) : (
        <Table>
          <TableCaption>A list of all story chapters in the game.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Sequence</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stories?.map((story) => (
              <TableRow key={story.id}>
                <TableCell>{story.sequence}</TableCell>
                <TableCell className="font-medium">{story.title}</TableCell>
                <TableCell>{story.requirements || 'None'}</TableCell>
                <TableCell>
                  <AdminStatus 
                    value={story.is_published}
                    activeText="Published"
                    inactiveText="Draft"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <AdminItemActions
                    onEdit={() => handleOpenEditDialog(story)}
                    onDelete={() => handleDelete(story.id, story.title)}
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
            <DialogTitle>{editStory ? 'Edit Story' : 'Add New Story'}</DialogTitle>
            <DialogDescription>
              {editStory 
                ? `Make changes to ${editStory.title}.` 
                : 'Fill out the form below to create a new story chapter.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, editStory)}>
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
                <Label htmlFor="content" className="text-right pt-2">Content</Label>
                <Textarea 
                  id="content" 
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="col-span-3 min-h-32" 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sequence" className="text-right">Sequence</Label>
                <Input 
                  id="sequence" 
                  name="sequence"
                  type="number"
                  min={1}
                  value={formData.sequence}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requirements" className="text-right">Requirements</Label>
                <Input 
                  id="requirements" 
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="col-span-3" 
                  placeholder="Optional requirements to unlock (e.g., level, mission)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_published" className="text-right">Published</Label>
                <div className="col-span-3">
                  <Input 
                    id="is_published" 
                    name="is_published"
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_published" className="ml-2">
                    Story is currently published
                  </Label>
                </div>
              </div>
            </div>
            <AdminDialogFooter
              onCancel={() => {
                closeDialog();
                resetForm();
              }}
              isEditing={!!editStory}
              isSubmitting={submitting}
            />
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default StoriesAdmin;
