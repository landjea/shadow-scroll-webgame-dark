
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; 
import { useTheme } from '@/contexts/ThemeContext';
import GameHeader from './GameHeader';
import GameSidebar from './GameSidebar';
import CityGrid from './CityGrid';
import GameAvailableActions from './GameAvailableActions';
import GameActionLog from './GameActionLog';
import { useGameState } from '@/hooks/useGameState';
import { GameAction } from '@/types/game';

const Game: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
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
    handleLocationSelect,
    characterStats
  } = useGameState();
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isMobile && isOpen && !target.closest('.sidebar')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isOpen]);

  const getThemeStyles = () => {
    switch (theme) {
      case 'batman':
        return {
          bg: 'bg-batman-dark',
          borderColor: 'border-batman-border',
          textColor: 'text-gray-200'
        };
      case 'superman':
        return {
          bg: 'bg-superman-blue',
          borderColor: 'border-superman-border',
          textColor: 'text-blue-50'
        };
      case 'starfire':
      default:
        return {
          bg: 'bg-purple-950',
          borderColor: 'border-purple-900/50',
          textColor: 'text-neutral-50'
        };
    }
  };

  const styles = getThemeStyles();

  // Create a wrapper for the handleAction function to match the expected type
  const handleGameAction = (action: GameAction) => {
    handleAction(action.id);
  };

  return (
    <div className={`h-screen overflow-hidden flex flex-col ${styles.textColor} ${styles.bg}`}>
      <GameHeader 
        heroHealth={heroHealth} 
        heroEnergy={heroEnergy}
        heroSpeed={heroSpeed}
      />
      
      <div className="flex-1 pt-14 flex overflow-hidden">
        <GameSidebar 
          heroSpeed={heroSpeed} 
          characterStats={characterStats}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="h-[60%] overflow-auto">
            {cityGrid && currentLocation ? (
              <CityGrid 
                grid={cityGrid}
                currentLocation={currentLocation}
                heroSpeed={heroSpeed}
                heroStamina={heroEnergy}
                onLocationSelect={handleLocationSelect}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-lg">Loading game map...</p>
              </div>
            )}
          </div>
          
          <div className={`h-[40%] ${styles.bg} ${styles.borderColor} border-t`}>
            <div className="p-4 h-full overflow-y-auto">
              <div className="space-y-4">
                <GameAvailableActions 
                  actions={gameActions} 
                  onAction={handleGameAction} 
                  heroEnergy={heroEnergy}
                />
                <GameActionLog entries={actionLog} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Game;
