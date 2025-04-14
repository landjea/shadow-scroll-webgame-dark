
import React from 'react';
import { Zap, Clock, Star, Bell, Heart, Activity } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from "@/components/ui/progress";
import { ThemeSelector } from "@/components/ui/theme-selector";

interface GameHeaderProps {
  heroHealth: number;
  heroEnergy: number;
  heroSpeed: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  heroHealth, 
  heroEnergy, 
  heroSpeed 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-purple-950 border-b border-purple-900/80 z-10 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Zap size={20} className="text-game-accent" />
        <h1 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-purple-300`}>SUPER CITY HEROES</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Health Bar */}
        <div className={`flex items-center ${isMobile ? 'w-20' : 'w-32'} gap-1`}>
          <Heart size={14} className="text-red-500 shrink-0" />
          <div className="w-full bg-purple-950 rounded-full h-1.5">
            <div 
              className="bg-red-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${heroHealth}%` }}
            ></div>
          </div>
        </div>
        
        {/* Energy Bar */}
        <div className={`flex items-center ${isMobile ? 'w-20' : 'w-32'} gap-1`}>
          <Zap size={14} className="text-yellow-500 shrink-0" />
          <div className="w-full bg-purple-950 rounded-full h-1.5">
            <div 
              className="bg-yellow-500 h-1.5 rounded-full transition-all" 
              style={{ width: `${heroEnergy}%` }}
            ></div>
          </div>
        </div>
        
        {/* Speed Indicator */}
        {!isMobile && (
          <div className="flex items-center gap-1 text-blue-400">
            <Activity size={14} />
            <span className="text-sm">{heroSpeed} Speed</span>
          </div>
        )}
        
        {/* XP */}
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
        
        {/* Theme Selector */}
        <ThemeSelector />
      </div>
    </header>
  );
};

export default GameHeader;
