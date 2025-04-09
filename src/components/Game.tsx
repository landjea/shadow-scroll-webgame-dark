
import React from 'react';
import GameHeader from './GameHeader';
import GameSidebar from './GameSidebar';
import GameConsole from './GameConsole';

const Game: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-game-dark text-game-text">
      <GameHeader />
      
      <div className="flex flex-1 pt-14">
        {/* Sidebar - Left Column */}
        <div className="w-64 h-[calc(100vh-3.5rem)]">
          <GameSidebar />
        </div>
        
        {/* Game Console - Right Column */}
        <div className="flex-1 h-[calc(100vh-3.5rem)]">
          <GameConsole />
        </div>
      </div>
    </div>
  );
};

export default Game;
