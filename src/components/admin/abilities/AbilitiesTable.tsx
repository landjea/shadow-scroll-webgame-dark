
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import AdminStatus from '@/components/admin/AdminStatus';
import AdminItemActions from '@/components/admin/AdminItemActions';
import { Ability } from '@/types/admin';

interface AbilitiesTableProps {
  abilities: Ability[];
  onEdit: (ability: Ability) => void;
  onDelete: (id: string, name: string) => void;
}

const AbilitiesTable: React.FC<AbilitiesTableProps> = ({ 
  abilities, 
  onEdit, 
  onDelete 
}) => {
  return (
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
                onEdit={() => onEdit(ability)}
                onDelete={() => onDelete(ability.id, ability.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AbilitiesTable;
