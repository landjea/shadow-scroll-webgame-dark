
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TextareaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  id,
  label,
  value,
  onChange,
  required = false,
  placeholder = '',
  className = ''
}) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor={id} className="text-right pt-2">{label}</Label>
      <Textarea 
        id={id} 
        name={id}
        value={value}
        onChange={onChange}
        className={`col-span-3 ${className}`} 
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextareaField;
