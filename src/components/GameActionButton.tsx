
import React from 'react';
import { GameAction } from '@/types/game';
import { useTheme } from '@/contexts/ThemeContext';

interface GameActionButtonProps {
  action: GameAction;
  onAction: () => void;
  disabled?: boolean;
  heroEnergy?: number;
}

const GameActionButton: React.FC<GameActionButtonProps> = ({ 
  action, 
  onAction, 
  disabled = false,
  heroEnergy
}) => {
  const { theme } = useTheme();

  // Get theme-specific colors
  const getButtonColors = () => {
    switch (theme) {
      case 'batman':
        return {
          bg: 'bg-gray-800',
          hoverBg: 'hover:bg-gray-700',
          iconBg: 'bg-gray-900',
          text: 'text-gray-200',
          subtext: 'text-gray-400'
        };
      case 'superman':
        return {
          bg: 'bg-blue-900',
          hoverBg: 'hover:bg-blue-800',
          iconBg: 'bg-blue-950',
          text: 'text-blue-100',
          subtext: 'text-blue-300'
        };
      case 'starfire':
      default:
        return {
          bg: 'bg-purple-900',
          hoverBg: 'hover:bg-purple-800',
          iconBg: 'bg-purple-950',
          text: 'text-purple-100',
          subtext: 'text-purple-300'
        };
    }
  };

  const colors = getButtonColors();

  return (
    <button
      onClick={onAction}
      className={`${colors.bg} ${colors.hoverBg} rounded-lg p-2 transition-all flex items-start space-x-2 text-left disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={disabled || (heroEnergy !== undefined && heroEnergy < 10)}
    >
      <div className={`${colors.iconBg} p-2 rounded-full`}>
        {action.icon}
      </div>
      <div>
        <h4 className={`font-semibold ${colors.text} text-sm`}>{action.label}</h4>
        <p className={`text-xs ${colors.subtext}`}>{action.description}</p>
      </div>
    </button>
  );
};

export default GameActionButton;
