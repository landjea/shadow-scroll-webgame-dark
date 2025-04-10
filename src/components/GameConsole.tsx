
import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Zap, Target, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import CityGrid, { LocationType } from './CityGrid';

interface GameAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

// Location types
const locationTypes: LocationType['type'][] = [
  'hospital', 'police', 'mall', 'suburb', 'park', 'street'
];

// Generate a random grid
const generateCityGrid = (size: number): LocationType[][] => {
  const grid: LocationType[][] = [];
  const locationNames = {
    hospital: ['Central Hospital', 'Mercy Hospital', 'City Medical'],
    police: ['Police HQ', 'Precinct 99', 'Sheriff Office'],
    mall: ['Mega Mall', 'City Center', 'Shopping Plaza'],
    suburb: ['Green Hills', 'Pleasant View', 'Oak District'],
    park: ['Central Park', 'Rose Garden', 'Lakeside Park'],
    street: ['Main St.', 'Broadway', 'Bay Avenue']
  };

  for (let y = 0; y < size; y++) {
    const row: LocationType[] = [];
    for (let x = 0; x < size; x++) {
      const type = locationTypes[Math.floor(Math.random() * locationTypes.length)];
      const nameOptions = locationNames[type];
      const name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
      
      row.push({
        id: `loc-${x}-${y}`,
        name,
        type,
        x,
        y
      });
    }
    grid.push(row);
  }
  
  return grid;
};

const GameConsole: React.FC = () => {
  const [cityGrid, setCityGrid] = useState<LocationType[][]>(() => generateCityGrid(7));
  const [currentLocation, setCurrentLocation] = useState<LocationType>(() => {
    // Start at the center of the grid (3,3)
    return cityGrid[3][3];
  });
  const [gameStatus, setGameStatus] = useState("Ready for action! The city needs your help.");
  const [actionLog, setActionLog] = useState<string[]>([
    "You've started your hero journey in the city center."
  ]);
  const [heroEnergy, setHeroEnergy] = useState(100);
  const [heroHealth, setHeroHealth] = useState(100);
  const [heroSpeed, setHeroSpeed] = useState(2);
  const [missionCount, setMissionCount] = useState(0);
  
  const gameActions: GameAction[] = [
    { 
      id: 'patrol', 
      label: 'Patrol the Streets', 
      icon: <Shield className="text-game-accent" />,
      description: 'Keep the city safe by patrolling the streets for criminal activity.'
    },
    { 
      id: 'combat', 
      label: 'Combat Training', 
      icon: <Target className="text-game-highlight" />,
      description: 'Improve your combat skills at the hero training facility.'
    },
    { 
      id: 'mission', 
      label: 'Take on Mission', 
      icon: <Zap className="text-yellow-500" />,
      description: 'Accept a mission from the hero headquarters to save the city.'
    },
    { 
      id: 'rest', 
      label: 'Rest & Recover', 
      icon: <Award className="text-green-500" />,
      description: 'Take some time to rest and recover your health and energy.'
    },
    { 
      id: 'story', 
      label: 'Story Progression', 
      icon: <BookOpen className="text-purple-500" />,
      description: 'Advance your hero\'s storyline and unlock new abilities.'
    }
  ];
  
  const handleAction = (actionId: string) => {
    let newLogEntry = "";
    
    switch(actionId) {
      case 'patrol':
        newLogEntry = "You patrol the streets of the city, deterring criminal activity.";
        setGameStatus(newLogEntry);
        setHeroEnergy(prev => Math.max(0, prev - 10));
        break;
      case 'combat':
        newLogEntry = "You spend time at the training facility honing your superhero skills.";
        setGameStatus(newLogEntry);
        setHeroEnergy(prev => Math.max(0, prev - 15));
        break;
      case 'mission':
        newLogEntry = `You accept a mission at ${currentLocation.name}!`;
        setGameStatus(newLogEntry);
        setMissionCount(prev => prev + 1);
        setHeroEnergy(prev => Math.max(0, prev - 25));
        setHeroHealth(prev => Math.max(0, prev - 10));
        break;
      case 'rest':
        newLogEntry = "You take time to rest and recover your strength.";
        setGameStatus(newLogEntry);
        setHeroEnergy(100);
        setHeroHealth(Math.min(100, heroHealth + 20));
        break;
      case 'story':
        newLogEntry = "You delve deeper into your hero's journey, uncovering new aspects of your origin story.";
        setGameStatus(newLogEntry);
        setHeroEnergy(prev => Math.max(0, prev - 5));
        break;
    }
    
    // Add to action log
    setActionLog(prev => [newLogEntry, ...prev]);
  };
  
  const handleLocationSelect = (location: LocationType) => {
    if (location.x === currentLocation.x && location.y === currentLocation.y) {
      const newLogEntry = "You are already at this location.";
      setActionLog(prev => [newLogEntry, ...prev]);
      return;
    }
    
    // Calculate Manhattan distance
    const distance = Math.abs(location.x - currentLocation.x) + Math.abs(location.y - currentLocation.y);
    
    if (distance > heroSpeed) {
      const newLogEntry = `That location is too far away. Your speed is ${heroSpeed} spaces.`;
      setActionLog(prev => [newLogEntry, ...prev]);
      return;
    }
    
    if (distance > heroEnergy) {
      const newLogEntry = "You don't have enough energy to move there.";
      setActionLog(prev => [newLogEntry, ...prev]);
      return;
    }
    
    // Update location and consume stamina
    setCurrentLocation(location);
    setHeroEnergy(prev => prev - distance);
    
    const newLogEntry = `You moved to ${location.name} (${location.x},${location.y}). Used ${distance} stamina.`;
    setGameStatus(`You are now at ${location.name}.`);
    setActionLog(prev => [newLogEntry, ...prev]);
  };
  
  // Effect to ensure we have a valid currentLocation on grid generation
  useEffect(() => {
    setCurrentLocation(cityGrid[3][3]);
  }, [cityGrid]);
  
  return (
    <div className="h-full flex flex-col bg-blue-950 border-l border-blue-900/30">
      <div className="bg-blue-900 p-4 border-b border-blue-900/50">
        <h2 className="text-xl font-bold text-blue-300 mb-1">{currentLocation.name} ({currentLocation.x},{currentLocation.y})</h2>
        <p className="text-blue-100">{gameStatus}</p>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        {/* City Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">City Map</h3>
          <CityGrid 
            grid={cityGrid}
            currentLocation={currentLocation}
            heroSpeed={heroSpeed}
            heroStamina={heroEnergy}
            onLocationSelect={handleLocationSelect}
          />
        </div>
        
        {/* Available Actions */}
        <h3 className="text-lg font-semibold text-blue-300 mb-4">Available Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {gameActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="bg-blue-900 hover:bg-blue-800 rounded-lg p-4 transition-all flex items-start space-x-3 text-left"
              disabled={heroEnergy < 5}
            >
              <div className="bg-blue-950 p-3 rounded-full">
                {action.icon}
              </div>
              <div>
                <h4 className="font-semibold text-blue-100">{action.label}</h4>
                <p className="text-sm text-blue-400 mt-1">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
        
        {/* Action Log */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Action Log</h3>
          <div className="bg-blue-950 rounded-md p-3 border border-blue-900/50 max-h-40 overflow-y-auto">
            {actionLog.map((entry, index) => (
              <div 
                key={index} 
                className="text-sm text-blue-300 mb-2 pb-2 border-b border-blue-900/30 last:border-0 last:mb-0 last:pb-0"
              >
                {entry}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {heroEnergy < 20 && (
        <div className="p-4 bg-blue-900 border-t border-blue-900/50">
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
