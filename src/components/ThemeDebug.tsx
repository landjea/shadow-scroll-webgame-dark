
import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeDebug: React.FC = () => {
  const { theme } = useTheme();
  const [bodyBgColor, setBodyBgColor] = useState('');
  const [bodyTextColor, setBodyTextColor] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState('');
  const [mainContentWidth, setMainContentWidth] = useState('');
  
  useEffect(() => {
    // Get actual computed colors
    const computedStyle = getComputedStyle(document.body);
    setBodyBgColor(computedStyle.backgroundColor);
    setBodyTextColor(computedStyle.color);
    
    // Check layout dimensions
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('main');
    
    if (sidebar) {
      const sidebarStyle = getComputedStyle(sidebar);
      setSidebarWidth(`${sidebar.clientWidth}px (${sidebarStyle.width})`);
    }
    
    if (main) {
      const mainStyle = getComputedStyle(main);
      setMainContentWidth(`${main.clientWidth}px (${mainStyle.width})`);
    }
  }, [theme]);
  
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
    return `actual bg: ${bodyBgColor}, actual text: ${bodyTextColor}`;
  };

  const getLayoutInfo = () => {
    return `sidebar: ${sidebarWidth}, main: ${mainContentWidth}`;
  };
  
  return (
    <div className="fixed bottom-0 left-0 p-2 bg-background text-foreground border-r border-t border-border z-50 text-xs">
      <p>Current Theme: {theme}</p>
      <p className="text-[10px] opacity-70">{getThemeColors()}</p>
      <p className="text-[10px] opacity-70">{getActualColors()}</p>
      <p className="text-[10px] opacity-70">{getLayoutInfo()}</p>
      <button 
        className="text-[10px] mt-1 px-2 py-0.5 bg-purple-600 text-white rounded"
        onClick={() => {
          // Force apply theme styles again
          document.body.classList.remove('theme-starfire', 'theme-batman', 'theme-superman');
          document.body.classList.add(`theme-${theme}`);
          
          // Update the computed colors and layout info
          const computedStyle = getComputedStyle(document.body);
          setBodyBgColor(computedStyle.backgroundColor);
          setBodyTextColor(computedStyle.color);
          
          // Re-check layout dimensions
          const sidebar = document.querySelector('.sidebar');
          const main = document.querySelector('main');
          
          if (sidebar) {
            const sidebarStyle = getComputedStyle(sidebar);
            setSidebarWidth(`${sidebar.clientWidth}px (${sidebarStyle.width})`);
          }
          
          if (main) {
            const mainStyle = getComputedStyle(main);
            setMainContentWidth(`${main.clientWidth}px (${mainStyle.width})`);
          }
        }}
      >
        Force Apply Theme
      </button>
    </div>
  );
};

export default ThemeDebug;
