
import React, { useState } from 'react';
import GameHeader from './GameHeader';
import GameSidebar from './GameSidebar';
import GameConsole from './GameConsole';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Game: React.FC = () => {
  const isMobile = useIsMobile();
  const [heroHealth, setHeroHealth] = useState(100);
  const [heroEnergy, setHeroEnergy] = useState(100);
  const [heroSpeed, setHeroSpeed] = useState(2);
  
  return (
    <div className="min-h-screen flex flex-col bg-game-dark text-game-text">
      <GameHeader 
        heroHealth={heroHealth}
        heroEnergy={heroEnergy}
        heroSpeed={heroSpeed}
      />
      
      <div className="flex flex-1 pt-14">
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <button 
                className="fixed bottom-4 left-4 z-20 bg-game-accent rounded-full p-3 shadow-lg text-game-darker"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-full max-w-xs bg-game-darker border-r border-game-dark/80">
              <GameSidebar heroSpeed={heroSpeed} />
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-64 h-[calc(100vh-3.5rem)]">
            <GameSidebar heroSpeed={heroSpeed} />
          </div>
        )}
        
        {/* Game Console - Right Column */}
        <div className="flex-1 h-[calc(100vh-3.5rem)]">
          <GameConsole />
        </div>
      </div>
    </div>
  );
};

export default Game;
