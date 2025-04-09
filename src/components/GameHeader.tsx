
import React from 'react';
import { Zap, Clock, Star, Bell } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

const GameHeader: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-purple-950 border-b border-purple-900/80 z-10 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Zap size={20} className="text-game-accent" />
        <h1 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-purple-300`}>SUPER CITY HEROES</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star size={14} />
          <span className="text-sm">1250 XP</span>
        </div>
        {!isMobile && (
          <div className="flex items-center space-x-1 text-purple-400">
            <Clock size={14} />
            <span className="text-sm">Day 3</span>
          </div>
        )}
        <button className="relative p-1 rounded-full hover:bg-purple-900 text-purple-400">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default GameHeader;
