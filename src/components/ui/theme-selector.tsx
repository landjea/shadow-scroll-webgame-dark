
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
    icon: <div className="w-4 h-4 rounded-full bg-purple-600" />
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

  const handleThemeChange = (newTheme: 'starfire' | 'batman' | 'superman') => {
    console.log(`Setting theme to: ${newTheme}`);
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-purple-900/50 hover:bg-purple-800">
          <Palette className="h-4 w-4 text-purple-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
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
