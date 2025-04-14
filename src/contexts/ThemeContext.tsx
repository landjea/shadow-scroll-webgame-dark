
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
    // Remove previous theme classes and add the new one
    document.documentElement.classList.remove('theme-starfire', 'theme-batman', 'theme-superman');
    document.documentElement.classList.add(`theme-${theme}`);
    
    // Apply theme colors directly to body
    let bgColor = '#2D1B69';
    let textColor = '#F8F9FA';
    
    if (theme === 'batman') {
      bgColor = '#1A1A1A';
      textColor = '#E6E6E6';
    } else if (theme === 'superman') {
      bgColor = '#0A3161';
      textColor = '#F8F9FA';
    }
    
    // Apply styles directly
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Log to verify theme change is happening
    console.log(`Theme changed to: ${theme}`);
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
