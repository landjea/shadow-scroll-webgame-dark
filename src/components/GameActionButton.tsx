
import React from 'react';
import { GameAction } from '@/types/game';

interface GameActionButtonProps {
  action: GameAction;
  onAction: (actionId: string) => void;
  disabled?: boolean;
}

const GameActionButton: React.FC<GameActionButtonProps> = ({ 
  action, 
  onAction, 
  disabled = false 
}) => {
  return (
    <button
      key={action.id}
      onClick={() => onAction(action.id)}
      className="bg-blue-900 hover:bg-blue-800 rounded-lg p-4 transition-all flex items-start space-x-3 text-left"
      disabled={disabled}
    >
      <div className="bg-blue-950 p-3 rounded-full">
        {action.icon}
      </div>
      <div>
        <h4 className="font-semibold text-blue-100">{action.label}</h4>
        <p className="text-sm text-blue-400 mt-1">{action.description}</p>
      </div>
    </button>
  );
};

export default GameActionButton;
