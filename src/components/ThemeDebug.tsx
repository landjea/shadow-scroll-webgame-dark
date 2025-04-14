
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeDebug: React.FC = () => {
  const { theme } = useTheme();
  
  const getThemeColors = () => {
    switch (theme) {
      case 'batman':
        return 'bg: #1A1A1A, text: #E6E6E6';
      case 'superman':
        return 'bg: #0A3161, text: #F8F9FA';
      case 'starfire':
      default:
        return 'bg: #2D1B69, text: #F8F9FA';
    }
  };
  
  const getActualColors = () => {
    const computedStyle = getComputedStyle(document.body);
    return `actual bg: ${computedStyle.backgroundColor}, actual text: ${computedStyle.color}`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 p-2 bg-background text-foreground border-r border-t border-border z-50 text-xs">
      <p>Current Theme: {theme}</p>
      <p className="text-[10px] opacity-70">{getThemeColors()}</p>
      <p className="text-[10px] opacity-70">{getActualColors()}</p>
    </div>
  );
};

export default ThemeDebug;
