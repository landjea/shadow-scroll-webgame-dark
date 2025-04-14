
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
import { useToast } from '@/hooks/use-toast';

interface ThemeOption {
  name: string;
  value: 'starfire' | 'batman' | 'superman';
  icon: React.ReactNode;
  description: string;
}

const themeOptions: ThemeOption[] = [
  {
    name: 'Starfire',
    value: 'starfire',
    icon: <div className="w-4 h-4 rounded-full bg-purple-600" />,
    description: 'A heroic purple theme'
  },
  {
    name: 'Batman',
    value: 'batman',
    icon: <div className="w-4 h-4 rounded-full bg-black border border-yellow-500" />,
    description: 'Dark, mysterious theme'
  },
  {
    name: 'Superman',
    value: 'superman',
    icon: <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-blue-600" />,
    description: 'Bold, bright theme'
  }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (newTheme: 'starfire' | 'batman' | 'superman') => {
    console.log(`Setting theme to: ${newTheme}`);
    setTheme(newTheme);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Theme`,
      description: `Theme changed to ${newTheme}`,
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full transition-colors duration-200 bg-purple-900/50 hover:bg-purple-800"
        >
          <Palette className="h-4 w-4 text-purple-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2 text-xs text-muted-foreground">
          Select a hero theme
        </div>
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            className={`flex items-center gap-2 py-2 ${theme === option.value ? 'bg-accent' : ''}`}
          >
            {option.icon}
            <div className="flex flex-col">
              <span className="font-medium">{option.name}</span>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
