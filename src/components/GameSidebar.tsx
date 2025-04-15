import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Shield, Zap, Award, Star, Flame, BookOpen, ChevronRight, Activity, Settings, Package, Map } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface GameSidebarProps {
  heroSpeed: number;
  characterStats?: any;
}

const GameSidebar: React.FC<GameSidebarProps> = ({ heroSpeed, characterStats }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isAdmin, user } = useAuth();
  
  const heroStats = [
    { name: "Strength", value: characterStats?.strength || 10 },
    { name: "Speed", value: heroSpeed * 20 }, // Convert speed to a 0-100 scale
    { name: "Agility", value: characterStats?.charisma || 10 },
    { name: "Intelligence", value: characterStats?.intelligence || 10 },
    { name: "Defense", value: 60 }
  ];
  
  const abilities = [
    { name: "Super Strength", icon: <Shield size={16} className="text-game-highlight" /> },
    { name: "Energy Blast", icon: <Zap size={16} className="text-yellow-500" /> },
    { name: "Flight", icon: <Flame size={16} className="text-red-500" /> },
    { name: "Invulnerability", icon: <Star size={16} className="text-purple-400" /> }
  ];
  
  const navigationTabs = [
    { name: "Character", icon: <User size={18} />, path: "/" },
    { name: "Abilities", icon: <Zap size={18} />, path: "/" },
    { name: "Missions", icon: <Award size={18} />, path: "/" },
    { name: "Story", icon: <BookOpen size={18} />, path: "/" },
    { name: "Admin", icon: <Settings size={18} />, path: "/admin" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="h-full w-full bg-purple-950 border-r border-purple-900/80 flex flex-col">
      <div className="p-4 border-b border-purple-900/80">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-game-accent flex items-center justify-center">
                  <User size={24} className="text-purple-950" />
                </div>
                <div>
                  <h2 className="font-bold text-purple-300">
                    {characterStats?.hero_name || user?.email?.split('@')[0] || 'Hero'}
                  </h2>
                  <p className="text-xs text-purple-400">Level {characterStats?.level || 1} Superhero</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-purple-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 bg-purple-900 border border-purple-800" align="start">
            <div className="p-4 bg-purple-950 border-b border-purple-900/80">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-game-accent flex items-center justify-center">
                  <User size={28} className="text-purple-950" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-purple-300">
                    {characterStats?.hero_name || user?.email?.split('@')[0] || 'Hero'}
                  </h2>
                  <p className="text-sm text-purple-400">Level {characterStats?.level || 1} Superhero</p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[350px]">
              <div className="p-4 border-b border-purple-800">
                <h3 className="font-semibold text-purple-300 text-sm mb-3">HERO STATS</h3>
                <div className="space-y-3">
                  {heroStats.map((stat) => (
                    <div key={stat.name}>
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-400">{stat.name}</span>
                        <span className="text-purple-200">{stat.value}/100</span>
                      </div>
                      <div className="w-full bg-purple-950 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-game-accent h-1.5 rounded-full" 
                          style={{ width: `${stat.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-purple-300 text-sm mb-3">HERO ABILITIES</h3>
                <div className="space-y-2">
                  {abilities.map((ability) => (
                    <div key={ability.name} className="flex items-center space-x-2 bg-purple-950/50 p-2 rounded">
                      {ability.icon}
                      <span className="text-sm text-purple-200">{ability.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
      
      <nav className="p-4">
        <h3 className="font-semibold text-purple-300 text-sm mb-3">NAVIGATION</h3>
        <ul className="space-y-2">
          {navigationTabs.map((tab) => (
            <li key={tab.name}>
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center space-x-3 hover:bg-purple-900 hover:text-purple-200 transition-colors ${location.pathname === tab.path && tab.name === "Admin" ? "bg-purple-900 text-purple-200" : "text-purple-400"}`}
                onClick={() => handleNavigation(tab.path)}
              >
                <span>{tab.icon}</span>
                <span className="font-mono text-sm">{tab.name}</span>
              </button>
            </li>
          ))}
          
          {/* Admin Popover */}
          <li>
            <Popover>
              <PopoverTrigger asChild>
                <button className={`w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-purple-900 hover:text-purple-200 transition-colors ${location.pathname === '/admin' ? "bg-purple-900 text-purple-200" : "text-purple-400"}`}>
                  <div className="flex items-center space-x-3">
                    <span><Settings size={18} /></span>
                    <span className="font-mono text-sm">Admin</span>
                  </div>
                  <ChevronRight size={16} className="text-purple-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-purple-900 border border-purple-800" align="end" side="right">
                <div className="p-3 bg-purple-950 border-b border-purple-900/80">
                  <h3 className="font-semibold text-purple-300 text-sm">ADMIN OPTIONS</h3>
                </div>
                <div className="p-2">
                  {adminOptions.map((option) => (
                    <button 
                      key={option.name}
                      className="w-full text-left px-3 py-2 rounded flex items-center space-x-3 hover:bg-purple-800 text-purple-300 transition-colors"
                      onClick={() => handleNavigation('/admin')}
                    >
                      <span>{option.icon}</span>
                      <span className="text-sm">{option.name}</span>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </li>
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-purple-900/80">
        <h3 className="font-semibold text-purple-300 text-sm mb-2">CURRENT MISSION</h3>
        <p className="text-sm text-purple-200">Stop the bank robbery downtown</p>
        <div className="flex items-center space-x-2 mt-2">
          <div className="w-full bg-purple-950 rounded-full h-1.5">
            <div className="bg-yellow-500 h-1.5 rounded-full w-2/3"></div>
          </div>
          <span className="text-xs text-purple-400">66%</span>
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;
