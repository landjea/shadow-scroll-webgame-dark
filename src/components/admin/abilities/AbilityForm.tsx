
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AdminDialogFooter from '@/components/admin/DialogFooter';
import { Ability } from '@/types/admin';

interface AbilityFormProps {
  ability?: Ability | null;
  onSuccess: () => void;
}

const AbilityForm: React.FC<AbilityFormProps> = ({
  ability,
  onSuccess
}) => {
  const [formData, setFormData] = React.useState({
    name: ability?.name || '',
    description: ability?.description || '',
    type: ability?.type || 'offensive',
    energy_cost: ability?.energy_cost || 10,
    power_level: ability?.power_level || 1,
    cooldown: ability?.cooldown || 0,
    is_active: ability?.is_active ?? true
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would make your API call to save the ability
      // For example:
      // await supabase.from('abilities').upsert(formData, ability ? { id: ability.id } : undefined);
      
      onSuccess();
    } catch (error) {
      console.error('Error saving ability:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onSuccess(); // Just close the form
  };

  return (
    <form onSubmit={handleSubmit}>
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
          <Label htmlFor="power_level" className="text-right">Power Level</Label>
          <Input 
            id="power_level" 
            name="power_level"
            type="number"
            min={1}
            value={formData.power_level}
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
        onCancel={handleCancel}
        isEditing={!!ability}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default AbilityForm;
