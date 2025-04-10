
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import CityGrid from './CityGrid';
import GameAvailableActions from './GameAvailableActions';
import GameActionLog from './GameActionLog';
import { useGameState } from '@/hooks/useGameState';

const GameConsole: React.FC = () => {
  const {
    cityGrid,
    currentLocation,
    gameStatus,
    actionLog,
    heroEnergy,
    heroHealth,
    heroSpeed,
    gameActions,
    handleAction,
    handleLocationSelect
  } = useGameState();
  
  return (
    <div className="h-full flex flex-col bg-blue-950 border-l border-blue-900/30">
      <div className="bg-blue-900 p-4 border-b border-blue-900/50">
        <h2 className="text-xl font-bold text-blue-300 mb-1">{currentLocation.name} ({currentLocation.x},{currentLocation.y})</h2>
        <p className="text-blue-100">{gameStatus}</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {/* City Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">City Map</h3>
          <CityGrid 
            grid={cityGrid}
            currentLocation={currentLocation}
            heroSpeed={heroSpeed}
            heroStamina={heroEnergy}
            onLocationSelect={handleLocationSelect}
          />
        </div>
        
        {/* Available Actions */}
        <GameAvailableActions 
          actions={gameActions}
          onAction={handleAction}
          heroEnergy={heroEnergy}
        />
        
        {/* Action Log */}
        <GameActionLog entries={actionLog} />
      </ScrollArea>
      
      {heroEnergy < 20 && (
        <div className="p-4 bg-blue-900 border-t border-blue-900/50">
          <Button 
            variant="outline" 
            onClick={() => handleAction('rest')}
            className="w-full bg-game-accent/20 border-game-accent text-game-accent hover:bg-game-accent/30"
          >
            Quick Rest
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameConsole;
