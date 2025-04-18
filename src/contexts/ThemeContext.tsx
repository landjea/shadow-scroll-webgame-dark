
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'starfire' | 'batman' | 'superman';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    // Try to get the theme from localStorage
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    return savedTheme || 'starfire';
  });

  useEffect(() => {
    // Function to apply theme styles
    const applyThemeStyles = () => {
      // Remove previous theme classes
      document.documentElement.classList.remove('theme-starfire', 'theme-batman', 'theme-superman');
      document.body.classList.remove('theme-starfire', 'theme-batman', 'theme-superman');
      
      // Add new theme classes
      document.documentElement.classList.add(`theme-${theme}`);
      document.body.classList.add(`theme-${theme}`);
      
      // Apply theme colors directly to body and html element
      let bgColor = '#2D1B69';
      let textColor = '#F8F9FA';
      
      if (theme === 'batman') {
        bgColor = '#1A1A1A';
        textColor = '#E6E6E6';
      } else if (theme === 'superman') {
        bgColor = '#0A3161';
        textColor = '#F8F9FA';
      }
      
      // Apply direct styles for immediate visual feedback
      document.documentElement.style.backgroundColor = bgColor;
      document.documentElement.style.color = textColor;
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = textColor;
      
      // Forcefully set the game background colors
      const gameElements = document.querySelectorAll('.game-panel, .game-sidebar');
      gameElements.forEach(element => {
        (element as HTMLElement).style.backgroundColor = theme === 'batman' ? '#1A1A1A' : 
          theme === 'superman' ? '#0A3161' : '#2D1B69';
      });
      
      // Save the theme preference to localStorage
      localStorage.setItem('theme', theme);
      
      console.log(`Theme applied: ${theme} - Background: ${bgColor}, Text: ${textColor}`);
    };

    // Apply the theme immediately
    applyThemeStyles();
    
    // Also set up a small delay to ensure the theme is applied after any React rendering
    const timeoutId = setTimeout(applyThemeStyles, 50);
    return () => clearTimeout(timeoutId);
  }, [theme]);

  const contextValue = {
    theme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
