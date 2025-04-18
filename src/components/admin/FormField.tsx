
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  min?: number;
  className?: string;
  name?: string; // Add name property
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  min,
  className = '',
  name
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input 
        id={id} 
        name={name || id}
        type={type}
        value={type === 'checkbox' ? undefined : value as string | number}
        checked={type === 'checkbox' ? value as boolean : undefined}
        onChange={onChange}
        className={`col-span-3 ${className}`} 
        required={required}
        placeholder={placeholder}
        min={min}
      />
    </div>
  );
};

export default FormField;
