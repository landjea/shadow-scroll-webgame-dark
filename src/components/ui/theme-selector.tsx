
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
    icon: <div className="w-5 h-5 rounded-full bg-[#2D1B69] border border-white/20" />,
    description: 'A heroic purple theme'
  },
  {
    name: 'Batman',
    value: 'batman',
    icon: <div className="w-5 h-5 rounded-full bg-[#1A1A1A] border border-yellow-500" />,
    description: 'Dark, mysterious theme'
  },
  {
    name: 'Superman',
    value: 'superman',
    icon: <div className="w-5 h-5 rounded-full bg-[#0A3161] border-2 border-red-600" />,
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
          variant="outline" 
          size="icon" 
          className="h-9 w-9 rounded-full transition-colors duration-200 border-2"
          style={{
            background: theme === 'starfire' ? '#2D1B69' : 
                      theme === 'batman' ? '#1A1A1A' : '#0A3161',
            borderColor: theme === 'starfire' ? '#D946EF' : 
                        theme === 'batman' ? '#FFC700' : '#EA384C'
          }}
        >
          <Palette className="h-5 w-5" style={{
            color: theme === 'starfire' ? '#D946EF' : 
                 theme === 'batman' ? '#FFC700' : '#EA384C'
          }} />
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
            className={`flex items-center gap-3 py-3 ${theme === option.value ? 'bg-accent' : ''}`}
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
