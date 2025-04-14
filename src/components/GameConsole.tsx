
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useGameState } from '@/hooks/useGameState';

const GameConsole: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentLocation,
    gameStatus,
    heroEnergy,
    handleAction
  } = useGameState();
  
  return (
    <div className="bg-blue-950/90 border-t border-blue-900/30">
      <div className="bg-blue-900/80 p-3 border-b border-blue-900/50">
        <h2 className="text-lg font-bold text-blue-300">{currentLocation?.name} ({currentLocation?.x},{currentLocation?.y})</h2>
        <p className="text-blue-100 text-sm">{gameStatus}</p>
      </div>
      
      <ScrollArea className="max-h-[300px]">
        {children}
      </ScrollArea>
      
      {heroEnergy < 20 && (
        <div className="p-3 bg-blue-900/80 border-t border-blue-900/50">
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
