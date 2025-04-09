import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, Zap, Target, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const GameConsole: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState("Downtown City");
  const [gameStatus, setGameStatus] = useState("Ready for action! The city needs your help.");
  const [heroEnergy, setHeroEnergy] = useState(100);
  const [heroHealth, setHeroHealth] = useState(100);
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
    switch(actionId) {
      case 'patrol':
        setGameStatus("You patrol the streets of the city, deterring criminal activity.");
        setHeroEnergy(prev => Math.max(0, prev - 10));
        break;
      case 'combat':
        setGameStatus("You spend time at the training facility honing your superhero skills.");
        setHeroEnergy(prev => Math.max(0, prev - 15));
        break;
      case 'mission':
        setGameStatus("You accept a mission to stop a bank robbery in progress!");
        setMissionCount(prev => prev + 1);
        setHeroEnergy(prev => Math.max(0, prev - 25));
        setHeroHealth(prev => Math.max(0, prev - 10));
        break;
      case 'rest':
        setGameStatus("You take time to rest and recover your strength.");
        setHeroEnergy(100);
        setHeroHealth(Math.min(100, heroHealth + 20));
        break;
      case 'story':
        setGameStatus("You delve deeper into your hero's journey, uncovering new aspects of your origin story.");
        setHeroEnergy(prev => Math.max(0, prev - 5));
        break;
    }
    
    if (Math.random() > 0.7) {
      const locations = ["Downtown City", "Hero HQ", "Training Facility", "City Outskirts", "Secret Hideout"];
      const newLocation = locations[Math.floor(Math.random() * locations.length)];
      setCurrentLocation(newLocation);
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-blue-950 border-l border-blue-900/30">
      <div className="bg-blue-900 p-4 border-b border-blue-900/50">
        <h2 className="text-xl font-bold text-blue-300 mb-1">{currentLocation}</h2>
        <p className="text-blue-100">{gameStatus}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-950 rounded-md p-3 border border-blue-900/50">
            <div className="text-sm text-blue-400 mb-1">Hero Health</div>
            <div className="w-full bg-blue-950 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${heroHealth}%` }}
              ></div>
            </div>
            <div className="text-right text-xs mt-1 text-blue-300">{heroHealth}/100</div>
          </div>
          
          <div className="bg-blue-950 rounded-md p-3 border border-blue-900/50">
            <div className="text-sm text-blue-400 mb-1">Hero Energy</div>
            <div className="w-full bg-blue-950 rounded-full h-2.5">
              <div 
                className="bg-game-accent h-2.5 rounded-full" 
                style={{ width: `${heroEnergy}%` }}
              ></div>
            </div>
            <div className="text-right text-xs mt-1 text-blue-300">{heroEnergy}/100</div>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">Available Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
