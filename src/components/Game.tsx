
import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile'; 
import { useTheme } from '@/contexts/ThemeContext';
import GameHeader from './GameHeader';
import GameSidebar from './GameSidebar';
import CityGrid from './CityGrid';
import GameAvailableActions from './GameAvailableActions';
import GameActionLog from './GameActionLog';
import { useGameState } from '@/hooks/useGameState';
import ThemeDebug from './ThemeDebug';

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

  // Log for debugging
  useEffect(() => {
    console.log("Game component rendered with:", { 
      cityGridExists: !!cityGrid, 
      currentLocationExists: !!currentLocation,
      cityGridSize: cityGrid ? `${cityGrid.length}x${cityGrid[0]?.length}` : 'N/A',
      currentLocation: currentLocation ? `(${currentLocation.x},${currentLocation.y})` : 'N/A',
      currentTheme: theme
    });
  }, [cityGrid, currentLocation, theme]);

  // Get theme-specific background colors
  const getThemeStyles = () => {
    switch (theme) {
      case 'batman':
        return {
          bg: 'bg-batman-dark',
          borderColor: 'border-gray-800/50',
          textColor: 'text-gray-200'
        };
      case 'superman':
        return {
          bg: 'bg-superman-blue',
          borderColor: 'border-blue-800/50',
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

  return (
    <div className={`h-screen overflow-hidden flex flex-col ${styles.textColor} ${styles.bg}`}>
      {/* Game header with stats and controls */}
      <GameHeader 
        heroHealth={heroHealth} 
        heroEnergy={heroEnergy}
        heroSpeed={heroSpeed}
      />
      
      <div className="flex-1 pt-14 flex overflow-hidden">
        {/* Sidebar for inventory, abilities, etc */}
        <GameSidebar 
          heroSpeed={heroSpeed} 
          characterStats={characterStats}
        />
        
        {/* Main game grid area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* City Grid Container - fixed height to prevent overlap */}
          <div className="h-[calc(100%-180px)] overflow-auto">
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
          
          {/* Game actions and log - now as a separate section below the grid */}
          <div className={`h-[180px] ${styles.bg} ${styles.borderColor} border-t`}>
            <div className="p-4 flex flex-col h-full overflow-hidden">
              <GameAvailableActions 
                actions={gameActions} 
                onAction={handleAction} 
                heroEnergy={heroEnergy}
              />
              <div className="mt-2 overflow-auto">
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
