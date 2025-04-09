
import React from 'react';
import { Clock } from "lucide-react";

const GameHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-game-darker border-b border-game-dark/80 z-10 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-mono text-game-highlight font-semibold">SHADOW SCROLL</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-game-muted space-x-1">
          <Clock size={14} />
          <span className="text-sm font-mono">00:00</span>
        </div>
        <div className="text-xs text-game-muted font-mono">v0.1.0</div>
      </div>
    </header>
  );
};

export default GameHeader;
