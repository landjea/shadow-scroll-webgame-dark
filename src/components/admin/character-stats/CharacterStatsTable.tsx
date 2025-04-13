
import React from 'react';
import { Edit, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

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

interface CharacterStatsTableProps {
  characters: CharacterStat[];
  onEdit: (character: CharacterStat) => void;
}

const CharacterStatsTable: React.FC<CharacterStatsTableProps> = ({ characters, onEdit }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hero Name</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Health</TableHead>
            <TableHead>Energy</TableHead>
            <TableHead>Strength</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characters.map((character) => (
            <TableRow key={character.id}>
              <TableCell className="font-medium">{character.hero_name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{character.user_email}</span>
                </div>
              </TableCell>
              <TableCell>{character.health}</TableCell>
              <TableCell>{character.energy}</TableCell>
              <TableCell>{character.strength}</TableCell>
              <TableCell>{character.level}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(character)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CharacterStatsTable;
