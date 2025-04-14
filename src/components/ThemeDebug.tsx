
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeDebug: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed bottom-0 left-0 p-2 bg-background text-foreground border-r border-t border-border z-50 text-xs">
      <p>Current Theme: {theme}</p>
    </div>
  );
};

export default ThemeDebug;
