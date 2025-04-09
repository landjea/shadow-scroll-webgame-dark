
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Map, User, Briefcase } from "lucide-react";

interface NavigationItem {
  name: string;
  icon: React.ReactNode;
}

const GameSidebar: React.FC = () => {
  const navigationItems: NavigationItem[] = [
    { name: "Character", icon: <User size={18} /> },
    { name: "Inventory", icon: <Briefcase size={18} /> },
    { name: "Journal", icon: <Book size={18} /> },
    { name: "Map", icon: <Map size={18} /> }
  ];

  return (
    <div className="h-full w-full bg-game-darker border-r border-game-dark/80 flex flex-col">
      <div className="p-4 border-b border-game-dark/80">
        <h2 className="font-mono text-game-highlight text-sm mb-2">PLAYER STATUS</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-game-muted">Health:</span>
            <span>100/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-game-muted">Energy:</span>
            <span>75/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-game-muted">Gold:</span>
            <span>50</span>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <h2 className="font-mono text-game-highlight text-sm mb-3">NAVIGATION</h2>
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button className="w-full text-left px-3 py-2 rounded flex items-center space-x-3 text-game-muted hover:bg-game-dark hover:text-game-text transition-colors">
                <span>{item.icon}</span>
                <span className="font-mono text-sm">{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-game-dark/80">
        <h2 className="font-mono text-game-highlight text-sm mb-2">LOCATION</h2>
        <p className="text-sm font-mono">The Dark Forest</p>
        <p className="text-xs text-game-muted mt-1 font-mono">Unexplored Territory</p>
      </div>
    </div>
  );
};

export default GameSidebar;
