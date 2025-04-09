
import React from 'react';
import { Zap, Clock, Star, Bell } from "lucide-react";

const GameHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-game-darker border-b border-game-dark/80 z-10 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Zap size={20} className="text-game-accent" />
        <h1 className="text-lg font-bold text-game-highlight">SUPER CITY HEROES</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star size={14} />
          <span className="text-sm">1250 XP</span>
        </div>
        <div className="flex items-center space-x-1 text-game-muted">
          <Clock size={14} />
          <span className="text-sm">Day 3</span>
        </div>
        <button className="relative p-1 rounded-full hover:bg-game-dark text-game-muted">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default GameHeader;
