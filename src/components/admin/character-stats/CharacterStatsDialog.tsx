
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CharacterStat {
  id: string;
  user_id: string;
  hero_name: string;
  energy: number;
  health: number;
  speed: number;
  strength: number;
  intelligence: number;
  charisma: number;
  missions_completed: number;
  level: number;
  experience: number;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

interface EditValues {
  hero_name?: string;
  energy?: number;
  health?: number;
  speed?: number;
  strength?: number;
  intelligence?: number;
  charisma?: number;
  level?: number;
  experience?: number;
}

interface CharacterStatsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCharacter: CharacterStat | null;
  editValues: EditValues;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => Promise<void>;
  loading: boolean;
}

const CharacterStatsDialog: React.FC<CharacterStatsDialogProps> = ({
  isOpen,
  onClose,
  selectedCharacter,
  editValues,
  onInputChange,
  onSave,
  loading
}) => {
  if (!selectedCharacter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Character</DialogTitle>
          <DialogDescription>
            Update the stats and attributes for this character.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hero_name" className="text-right">Hero Name</Label>
            <Input
              id="hero_name"
              name="hero_name"
              value={editValues.hero_name || ''}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="strength" className="text-right">Strength</Label>
              <Input
                id="strength"
                name="strength"
                type="number"
                value={editValues.strength || 0}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="speed" className="text-right">Speed</Label>
              <Input
                id="speed"
                name="speed"
                type="number"
                value={editValues.speed || 0}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="intelligence" className="text-right">Intelligence</Label>
              <Input
                id="intelligence"
                name="intelligence"
                type="number"
                value={editValues.intelligence || 0}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="charisma" className="text-right">Charisma</Label>
              <Input
                id="charisma"
                name="charisma"
                type="number"
                value={editValues.charisma || 0}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="health" className="text-right">Health</Label>
              <Input
                id="health"
                name="health"
                type="number"
                value={editValues.health || 0}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="energy" className="text-right">Energy</Label>
              <Input
                id="energy"
                name="energy"
                type="number"
                value={editValues.energy || 0}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="level" className="text-right">Level</Label>
              <Input
                id="level"
                name="level"
                type="number"
                value={editValues.level || 0}
                onChange={onInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 items-center gap-2">
              <Label htmlFor="experience" className="text-right">Experience</Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={editValues.experience || 0}
                onChange={onInputChange}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={onSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterStatsDialog;
