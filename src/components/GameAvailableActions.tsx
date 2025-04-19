
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import GameActionButton from './GameActionButton';
import { GameAction } from '@/types/game';

interface GameAvailableActionsProps {
  actions: GameAction[];
  onAction: (action: GameAction) => void;
  heroEnergy: number;
}

const GameAvailableActions: React.FC<GameAvailableActionsProps> = ({ 
  actions,
  onAction,
  heroEnergy
}) => {
  const { theme } = useTheme();
  
  const getActionStyles = () => {
    switch (theme) {
      case 'batman':
        return {
          title: 'text-batman-gold',
          text: 'text-gray-300',
        };
      case 'superman':
        return {
          title: 'text-superman-red',
          text: 'text-blue-100',
        };
      case 'starfire':
      default:
        return {
          title: 'text-purple-300',
          text: 'text-purple-200',
        };
    }
  };
  
  const styles = getActionStyles();
  
  return (
    <div>
      <h3 className={`text-lg font-semibold ${styles.title} mb-2`}>Available Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {actions.map((action) => (
          <GameActionButton
            key={action.id}
            action={action}
            onAction={() => onAction(action)}
            heroEnergy={heroEnergy}
          />
        ))}
      </div>
    </div>
  );
};

export default GameAvailableActions;
