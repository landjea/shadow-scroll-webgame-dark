
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminDialogFooter from '@/components/admin/DialogFooter';
import { Ability } from '@/types/admin';

interface AbilityFormData {
  name: string;
  description: string;
  type: string;
  energy_cost: number;
  cooldown: number;
  is_active: boolean;
}

interface AbilityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAbility: Ability | null;
  formData: AbilityFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const AbilityForm: React.FC<AbilityFormProps> = ({
  open,
  onOpenChange,
  editAbility,
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editAbility ? 'Edit Ability' : 'Add New Ability'}</DialogTitle>
          <DialogDescription>
            {editAbility 
              ? `Make changes to ${editAbility.name}.` 
              : 'Fill out the form below to create a new ability.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                  onChange={onInputChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="is_active" className="ml-2">
                  Ability is currently active
                </Label>
              </div>
            </div>
          </div>
          <AdminDialogFooter
            onCancel={onCancel}
            isEditing={!!editAbility}
            isSubmitting={isSubmitting}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AbilityForm;
