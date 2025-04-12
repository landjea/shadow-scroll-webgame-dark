
import React, { useState } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Textarea } from '@/components/ui/textarea';

interface Story {
  id: string;
  title: string;
  content: string;
  sequence: number;
  is_published: boolean;
  requirements: string | null;
}

const StoriesAdmin: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [editStory, setEditStory] = useState<Story | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    sequence: 1,
    is_published: false,
    requirements: ''
  });

  const { data: stories, isLoading, refetch } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('sequence');
        
      if (error) throw error;
      return data as Story[];
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'sequence' 
          ? parseInt(value) || 1 
          : value
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      sequence: 1,
      is_published: false,
      requirements: ''
    });
    setEditStory(null);
  };

  const openEditDialog = (story: Story) => {
    setEditStory(story);
    setFormData({
      title: story.title,
      content: story.content,
      sequence: story.sequence,
      is_published: story.is_published,
      requirements: story.requirements || ''
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storyData = {
        title: formData.title,
        content: formData.content,
        sequence: formData.sequence,
        is_published: formData.is_published,
        requirements: formData.requirements || null
      };
      
      if (editStory) {
        // Update existing story
        const { error } = await supabase
          .from('stories')
          .update(storyData)
          .eq('id', editStory.id);
          
        if (error) throw error;
        
        toast({
          title: 'Story updated',
          description: `${formData.title} has been updated.`
        });
      } else {
        // Create new story
        const { error } = await supabase
          .from('stories')
          .insert(storyData);
          
        if (error) throw error;
        
        toast({
          title: 'Story created',
          description: `${formData.title} has been added to the game.`
        });
      }
      
      setOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save story.'
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'Story deleted',
        description: `${title} has been removed from the game.`
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete story.'
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-purple-800">Story Management</h1>
          <p className="text-gray-600">Create and manage game storylines</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editStory ? 'Edit Story' : 'Add New Story'}</DialogTitle>
              <DialogDescription>
                {editStory 
                  ? `Make changes to ${editStory.title}.` 
                  : 'Fill out the form below to create a new story chapter.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                  {editStory ? 'Save Changes' : 'Add Story'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : stories?.length === 0 ? (
        <div className="text-center my-12 p-8 border border-dashed rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No stories found</h3>
          <p className="text-gray-600 mb-4">Start by adding some story chapters to your game.</p>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Story Chapter
          </Button>
        </div>
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
                  {story.is_published ? 
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</span> : 
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Draft</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(story)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(story.id, story.title)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default StoriesAdmin;
