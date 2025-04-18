import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface GameActionLogProps {
  entries: string[];
}

const GameActionLog: React.FC<GameActionLogProps> = ({ entries }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-blue-300 mb-2">Action Log</h3>
      <div className="rounded-md border border-blue-900/30">
        <div className="p-3 bg-blue-950/80">
          {entries.map((entry, index) => (
            <div 
              key={index} 
              className="text-sm text-blue-300 mb-2 pb-2 border-b border-blue-900/30 last:border-0 last:mb-0 last:pb-0"
            >
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameActionLog;
