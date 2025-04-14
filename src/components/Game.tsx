
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
  const { heroHealth, heroEnergy, heroSpeed } = useGameState();
  
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
        <GameSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        
        {/* Main game grid area */}
        <main className={`flex-1 ${isOpen && isMobile ? 'hidden' : 'flex flex-col'} overflow-hidden`}>
          <div className="flex-1 overflow-hidden relative">
            <CityGrid />
            
            {/* Game log console (fixed at bottom) */}
            <div className="absolute bottom-0 w-full">
              <GameConsole>
                <div className="flex flex-col space-y-4 px-4 py-3">
                  <GameAvailableActions />
                  <GameActionLog />
                </div>
              </GameConsole>
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
