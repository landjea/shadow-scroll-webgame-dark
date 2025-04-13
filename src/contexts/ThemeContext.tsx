
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
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
