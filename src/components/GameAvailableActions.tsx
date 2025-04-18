
import React from 'react';
import { GameAction } from '@/types/game';
import GameActionButton from './GameActionButton';

interface GameAvailableActionsProps {
  actions: GameAction[];
  onAction: (actionId: string) => void;
  heroEnergy: number;
}

const GameAvailableActions: React.FC<GameAvailableActionsProps> = ({ 
  actions, 
  onAction,
  heroEnergy
}) => {
  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-semibold text-blue-300 mb-2">Available Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {actions.map((action) => (
          <GameActionButton 
            key={action.id}
            action={action} 
            onAction={onAction}
            disabled={heroEnergy < 5}
          />
        ))}
      </div>
    </div>
  );
};

export default GameAvailableActions;
