
import { useState, useEffect } from 'react';
import { LocationType } from '@/types/game';
import { generateCityGrid } from '@/utils/mapUtils';
import { Shield, Zap, Target, Award, BookOpen } from "lucide-react";

export function useGameState() {
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
  
  const gameActions = [
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

  return {
    cityGrid,
    currentLocation,
    gameStatus,
    actionLog,
    heroEnergy,
    heroHealth,
    heroSpeed,
    missionCount,
    gameActions,
    handleAction,
    handleLocationSelect
  };
}
