
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from '@/contexts/ThemeContext';

interface GameActionLogProps {
  entries: string[];
}

const GameActionLog: React.FC<GameActionLogProps> = ({ entries }) => {
  const { theme } = useTheme();
  
  const getLogStyles = () => {
    switch (theme) {
      case 'batman':
        return {
          title: 'text-batman-gold',
          bg: 'bg-batman-dark',
          border: 'border-batman-border',
          text: 'text-gray-300',
        };
      case 'superman':
        return {
          title: 'text-superman-red',
          bg: 'bg-superman-blue/80',
          border: 'border-superman-border',
          text: 'text-blue-100',
        };
      case 'starfire':
      default:
        return {
          title: 'text-blue-300',
          bg: 'bg-blue-950/80',
          border: 'border-blue-900/30',
          text: 'text-blue-300',
        };
    }
  };
  
  const styles = getLogStyles();
  
  return (
    <div>
      <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>Action Log</h3>
      <div className={`rounded-md border ${styles.border}`}>
        <div className={`p-3 ${styles.bg}`}>
          {entries.map((entry, index) => (
            <div 
              key={index} 
              className={`text-sm ${styles.text} mb-2 pb-2 border-b ${styles.border} last:border-0 last:mb-0 last:pb-0`}
            >
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameActionLog;
