
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; 
import GameHeader from './GameHeader';
import GameSidebar from './GameSidebar';
import CityGrid from './CityGrid';
import GameConsole from './GameConsole';
import GameAvailableActions from './GameAvailableActions';
import GameActionLog from './GameActionLog';
import { useGameState } from '@/hooks/useGameState';
import ThemeDebug from './ThemeDebug';

const Game: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const {
    cityGrid,
    currentLocation,
    gameStatus,
    actionLog,
    heroHealth,
    heroEnergy,
    heroSpeed,
    gameActions,
    handleAction,
    handleLocationSelect
  } = useGameState();
  
  useEffect(() => {
    // Close sidebar on mobile when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobile && isOpen && !target.closest('.sidebar')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isOpen]);

  return (
    <div className="h-screen overflow-hidden flex flex-col text-neutral-50">
      {/* Game header with stats and controls */}
      <GameHeader 
        heroHealth={heroHealth} 
        heroEnergy={heroEnergy}
        heroSpeed={heroSpeed}
      />
      
      <div className="flex flex-1 pt-14 overflow-hidden">
        {/* Sidebar for inventory, abilities, etc */}
        <GameSidebar 
          heroSpeed={heroSpeed} 
          characterStats={undefined}
        />
        
        {/* Main game grid area */}
        <main className={`flex-1 ${isOpen && isMobile ? 'hidden' : 'flex flex-col'} overflow-hidden`}>
          <div className="flex-1 overflow-hidden relative">
            {cityGrid && currentLocation && (
              <CityGrid 
                grid={cityGrid}
                currentLocation={currentLocation}
                heroSpeed={heroSpeed}
                heroStamina={heroEnergy}
                onLocationSelect={handleLocationSelect}
              />
            )}
            
            {/* Game log console (fixed at bottom) */}
            <div className="absolute bottom-0 w-full">
              <div className="flex flex-col space-y-4 px-4 py-3 bg-purple-950/80 border-t border-purple-900/50">
                <GameAvailableActions 
                  actions={gameActions} 
                  onAction={handleAction} 
                  heroEnergy={heroEnergy}
                />
                <GameActionLog entries={actionLog} />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Theme debug indicator */}
      <ThemeDebug />
    </div>
  );
};

export default Game;
