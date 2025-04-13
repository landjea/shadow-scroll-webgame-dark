
import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeOption {
  name: string;
  value: 'starfire' | 'batman' | 'superman';
  icon: React.ReactNode;
}

const themeOptions: ThemeOption[] = [
  {
    name: 'Starfire',
    value: 'starfire',
    icon: <div className="w-4 h-4 rounded-full bg-game-accent" />
  },
  {
    name: 'Batman',
    value: 'batman',
    icon: <div className="w-4 h-4 rounded-full bg-black border border-yellow-500" />
  },
  {
    name: 'Superman',
    value: 'superman',
    icon: <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-blue-600" />
  }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`flex items-center gap-2 ${theme === option.value ? 'bg-accent' : ''}`}
          >
            {option.icon}
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
