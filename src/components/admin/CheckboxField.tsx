
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CheckboxFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  id,
  label,
  checked,
  onChange,
  description
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <div className="col-span-3">
        <Input 
          id={id} 
          name={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4"
        />
        <Label htmlFor={id} className="ml-2">
          {description}
        </Label>
      </div>
    </div>
  );
};

export default CheckboxField;
