
import { useState, useEffect } from 'react';
import { LocationType } from '@/types/game';
import { generateCityGrid } from '@/utils/mapUtils';
import { Shield, Zap, Target, Award, BookOpen } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface GameState {
  currentLocation: LocationType;
  gameStatus: string;
  actionLog: string[];
  heroEnergy: number;
  heroHealth: number;
  heroSpeed: number;
  missionCount: number;
}

interface CharacterStats {
  id: string;
  hero_name: string;
  energy: number;
  health: number;
  speed: number;
  strength: number;
  intelligence: number;
  charisma: number;
  missions_completed: number;
  level: number;
  experience: number;
}

export function useGameState() {
  const cityGrid = generateCityGrid(7);
  const [currentLocation, setCurrentLocation] = useState<LocationType>(cityGrid[3][3]);
  const [gameStatus, setGameStatus] = useState("Ready for action! The city needs your help.");
  const [actionLog, setActionLog] = useState<string[]>([
    "You've started your hero journey in the city center."
  ]);
  const [heroEnergy, setHeroEnergy] = useState(100);
  const [heroHealth, setHeroHealth] = useState(100);
  const [heroSpeed, setHeroSpeed] = useState(2);
  const [missionCount, setMissionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [characterStats, setCharacterStats] = useState<CharacterStats | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
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

  // Load character stats from the database
  useEffect(() => {
    if (user) {
      loadCharacterStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Update character stats in the database when they change
  useEffect(() => {
    if (user && characterStats && !loading) {
      updateCharacterStats();
    }
  }, [heroEnergy, heroHealth, heroSpeed, missionCount, user, loading, characterStats]);

  // Load game state after character stats are loaded
  useEffect(() => {
    if (characterStats && user) {
      loadGameState();
    }
  }, [characterStats, user]);

  const loadCharacterStats = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      const { data, error } = await supabase
        .from('character_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If character stats don't exist yet, they will be created by the DB trigger
        console.error('Error loading character stats:', error);
        return;
      }
      
      if (data) {
        setCharacterStats(data);
        setHeroEnergy(data.energy);
        setHeroHealth(data.health);
        setHeroSpeed(data.speed);
        setMissionCount(data.missions_completed);
      }
    } catch (error) {
      console.error('Error loading character stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCharacterStats = async () => {
    try {
      if (!user || !characterStats) return;
      
      const { error } = await supabase
        .from('character_stats')
        .update({
          energy: heroEnergy,
          health: heroHealth,
          speed: heroSpeed,
          missions_completed: missionCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', characterStats.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating character stats:', error);
    }
  };

  const loadGameState = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', user.id)
        .order('last_updated', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        const gameState = data.game_state as any;
        
        // Find the location in the grid that matches the saved location
        const savedLocation = gameState.currentLocation;
        if (savedLocation) {
          const matchingLocation = cityGrid[savedLocation.x]?.[savedLocation.y];
          if (matchingLocation) {
            setCurrentLocation(matchingLocation);
          }
        }
        
        setGameStatus(gameState.gameStatus || "Ready for action! The city needs your help.");
        setActionLog(gameState.actionLog || ["You've started your hero journey in the city center."]);
        
        toast({
          title: "Game loaded!",
          description: "Your saved game has been loaded."
        });
      }
    } catch (error) {
      console.error('Error loading game state:', error);
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to load game state"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveGameState = async () => {
    try {
      if (!user) return;
      
      const serializedLocation = {
        id: currentLocation.id,
        name: currentLocation.name,
        type: currentLocation.type,
        x: currentLocation.x,
        y: currentLocation.y
      };
      
      const gameState = {
        currentLocation: serializedLocation,
        gameStatus,
        actionLog
      };
      
      const { error } = await supabase
        .from('game_saves')
        .upsert({
          user_id: user.id,
          game_state: gameState,
          player_data: {
            energy: heroEnergy,
            health: heroHealth,
            speed: heroSpeed,
            missionCount
          },
          last_updated: new Date().toISOString()
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const logGameAction = async (actionId: string, payload: any = {}) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('game_actions')
        .insert({
          user_id: user.id,
          action_type: actionId,
          payload
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error logging game action:', error);
    }
  };
  
  const handleAction = (actionId: string) => {
    let newLogEntry = "";
    let payload = {};
    
    switch(actionId) {
      case 'patrol':
        newLogEntry = "You patrol the streets of the city, deterring criminal activity.";
        setGameStatus(newLogEntry);
        setHeroEnergy(prev => Math.max(0, prev - 10));
        payload = { location: currentLocation, energyUsed: 10 };
        break;
      case 'combat':
        newLogEntry = "You spend time at the training facility honing your superhero skills.";
        setGameStatus(newLogEntry);
        setHeroEnergy(prev => Math.max(0, prev - 15));
        payload = { location: currentLocation, energyUsed: 15 };
        break;
      case 'mission':
        newLogEntry = `You accept a mission at ${currentLocation.name}!`;
        setGameStatus(newLogEntry);
        setMissionCount(prev => prev + 1);
        setHeroEnergy(prev => Math.max(0, prev - 25));
        setHeroHealth(prev => Math.max(0, prev - 10));
        payload = { 
          location: currentLocation, 
          energyUsed: 25, 
          healthLost: 10,
          missionCount: missionCount + 1 
        };
        break;
      case 'rest':
        newLogEntry = "You take time to rest and recover your strength.";
        setGameStatus(newLogEntry);
        setHeroEnergy(100);
        const healthRecovered = Math.min(100, heroHealth + 20) - heroHealth;
        setHeroHealth(prev => Math.min(100, prev + 20));
        payload = { location: currentLocation, healthRecovered, energyRecovered: 100 - heroEnergy };
        break;
      case 'story':
        newLogEntry = "You delve deeper into your hero's journey, uncovering new aspects of your origin story.";
        setGameStatus(newLogEntry);
        setHeroEnergy(prev => Math.max(0, prev - 5));
        payload = { location: currentLocation, energyUsed: 5 };
        break;
    }
    
    setActionLog(prev => [newLogEntry, ...prev]);
    
    logGameAction(actionId, payload);
  };
  
  const handleLocationSelect = (location: LocationType) => {
    if (location.x === currentLocation.x && location.y === currentLocation.y) {
      const newLogEntry = "You are already at this location.";
      setActionLog(prev => [newLogEntry, ...prev]);
      return;
    }
    
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
    
    setCurrentLocation(location);
    setHeroEnergy(prev => prev - distance);
    
    const newLogEntry = `You moved to ${location.name} (${location.x},${location.y}). Used ${distance} stamina.`;
    setGameStatus(`You are now at ${location.name}.`);
    setActionLog(prev => [newLogEntry, ...prev]);
    
    logGameAction('move', { from: currentLocation, to: location, energyUsed: distance });
  };

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
    handleLocationSelect,
    loading,
    characterStats
  };
}
