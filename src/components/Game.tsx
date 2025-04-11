
import React from 'react';
import { useGameState } from '@/hooks/useGameState';
import GameConsole from '@/components/GameConsole';
import GameSidebar from '@/components/GameSidebar';
import GameHeader from '@/components/GameHeader';

const Game: React.FC = () => {
  const {
    currentLocation,
    gameStatus,
    actionLog,
    heroEnergy,
    heroHealth,
    heroSpeed,
    cityGrid,
    gameActions,
    handleAction,
    handleLocationSelect,
    characterStats
  } = useGameState();
  
  return (
    <>
      <GameHeader 
        heroHealth={heroHealth} 
        heroEnergy={heroEnergy} 
        heroSpeed={heroSpeed} 
      />
      
      <div className="fixed flex top-14 bottom-0 left-0 right-0">
        <div className="w-64 flex-shrink-0">
          <GameSidebar 
            heroSpeed={heroSpeed} 
            characterStats={characterStats}
          />
        </div>
        <div className="flex-1 max-w-full">
          <GameConsole />
        </div>
      </div>
    </>
  );
};

export default Game;
