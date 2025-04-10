
import React from 'react';

interface GameActionLogProps {
  entries: string[];
}

const GameActionLog: React.FC<GameActionLogProps> = ({ entries }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-blue-300 mb-3">Action Log</h3>
      <div className="bg-blue-950 rounded-md p-3 border border-blue-900/50 max-h-40 overflow-y-auto">
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
  );
};

export default GameActionLog;
