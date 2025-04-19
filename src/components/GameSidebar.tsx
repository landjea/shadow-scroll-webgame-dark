
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, Shield, Zap, Award, Star, Flame, BookOpen, 
  ChevronRight, Settings, Package, Map, LogOut 
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface GameSidebarProps {
  heroSpeed: number;
  characterStats?: any;
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameSidebar: React.FC<GameSidebarProps> = ({ 
  heroSpeed, 
  characterStats,
  isOpen,
  setIsOpen
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isAdmin, user } = useAuth();
  const { theme } = useTheme();
  
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
  
  const getSidebarColors = () => {
    switch (theme) {
      case 'batman':
        return {
          bg: 'bg-batman-dark',
          border: 'border-gray-800/80',
          headerBg: 'bg-batman-dark',
          text: 'text-gray-300',
          highlight: 'text-batman-gold',
          navButton: 'text-gray-400 hover:bg-gray-800 hover:text-gray-200',
          navActive: 'bg-gray-800 text-gray-200',
          subText: 'text-gray-400',
          progBg: 'bg-gray-900', 
          missionText: 'text-gray-300'
        };
      case 'superman':
        return {
          bg: 'bg-superman-blue',
          border: 'border-blue-800/80',
          headerBg: 'bg-superman-blue',
          text: 'text-blue-100',
          highlight: 'text-superman-red',
          navButton: 'text-blue-300 hover:bg-blue-800 hover:text-blue-100',
          navActive: 'bg-blue-800 text-blue-100',
          subText: 'text-blue-300',
          progBg: 'bg-blue-900',
          missionText: 'text-blue-200'
        };
      case 'starfire':
      default:
        return {
          bg: 'bg-purple-950',
          border: 'border-purple-900/80',
          headerBg: 'bg-purple-950',
          text: 'text-purple-300',
          highlight: 'text-game-accent',
          navButton: 'text-purple-400 hover:bg-purple-900 hover:text-purple-200',
          navActive: 'bg-purple-900 text-purple-200',
          subText: 'text-purple-400',
          progBg: 'bg-purple-950',
          missionText: 'text-purple-200'
        };
    }
  };
  
  const colors = getSidebarColors();
  
  const adminOptions = [
    { 
      name: "Admin Dashboard", 
      icon: <Settings size={16} className="text-white" />,
      path: "/admin"
    },
    { 
      name: "Character Management", 
      icon: <User size={16} className="text-purple-300" />,
      path: "/admin/characters"
    },
    { 
      name: "Inventory Management", 
      icon: <Package size={16} className="text-blue-400" />,
      path: "/admin/inventory"
    },
    { 
      name: "Mission Management", 
      icon: <Award size={16} className="text-yellow-400" />,
      path: "/admin/missions"
    },
    { 
      name: "Story Management", 
      icon: <BookOpen size={16} className="text-green-400" />,
      path: "/admin/stories"
    },
    { 
      name: "Ability Management", 
      icon: <Zap size={16} className="text-red-400" />,
      path: "/admin/abilities"
    },
    { 
      name: "RBAC Management", 
      icon: <Shield size={16} className="text-indigo-400" />,
      path: "/admin/roles"
    },
    { 
      name: "Map Management", 
      icon: <Map size={16} className="text-teal-400" />,
      path: "/admin/map"
    }
  ];
  
  const navigationTabs = [
    { name: "Character", icon: <User size={18} />, path: "/" },
    { name: "Abilities", icon: <Zap size={18} />, path: "/" },
    { name: "Missions", icon: <Award size={18} />, path: "/" },
    { name: "Story", icon: <BookOpen size={18} />, path: "/" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  console.log("isAdmin value:", isAdmin);
  console.log("Current location:", location.pathname);

  return (
    <div className={`h-full w-64 flex-shrink-0 ${colors.bg} border-r ${colors.border} flex flex-col sidebar`}>
      <div className={`p-4 border-b ${colors.border}`}>
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-game-accent flex items-center justify-center">
                  <User size={24} className="text-purple-950" />
                </div>
                <div>
                  <h2 className={`font-bold ${colors.text}`}>
                    {characterStats?.hero_name || user?.email?.split('@')[0] || 'Hero'}
                  </h2>
                  <p className={`text-xs ${colors.subText}`}>Level {characterStats?.level || 1} Superhero</p>
                </div>
              </div>
              <ChevronRight size={16} className={colors.subText} />
            </button>
          </PopoverTrigger>
          <PopoverContent className={`w-80 p-0 ${colors.bg} border ${colors.border}`} align="start">
            <div className={`p-4 ${colors.headerBg} border-b ${colors.border}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 rounded-full bg-game-accent flex items-center justify-center">
                  <User size={28} className="text-purple-950" />
                </div>
                <div>
                  <h2 className={`font-bold text-lg ${colors.text}`}>
                    {characterStats?.hero_name || user?.email?.split('@')[0] || 'Hero'}
                  </h2>
                  <p className={`text-sm ${colors.subText}`}>Level {characterStats?.level || 1} Superhero</p>
                </div>
              </div>
            </div>
            
            <ScrollArea className="h-[350px]">
              <div className={`p-4 border-b ${colors.border}`}>
                <h3 className={`font-semibold ${colors.text} text-sm mb-3`}>HERO STATS</h3>
                <div className="space-y-3">
                  {heroStats.map((stat) => (
                    <div key={stat.name}>
                      <div className="flex justify-between text-xs">
                        <span className={colors.subText}>{stat.name}</span>
                        <span className={colors.text}>{stat.value}/100</span>
                      </div>
                      <div className={`w-full ${colors.progBg} rounded-full h-1.5 mt-1`}>
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
                <h3 className={`font-semibold ${colors.text} text-sm mb-3`}>HERO ABILITIES</h3>
                <div className="space-y-2">
                  {abilities.map((ability) => (
                    <div key={ability.name} className={`flex items-center space-x-2 ${colors.progBg}/50 p-2 rounded`}>
                      {ability.icon}
                      <span className={`text-sm ${colors.text}`}>{ability.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
      
      <nav className="p-4">
        <h3 className={`font-semibold ${colors.text} text-sm mb-3`}>NAVIGATION</h3>
        <ul className="space-y-2">
          {navigationTabs.map((tab) => (
            <li key={tab.name}>
              <button 
                className={`w-full text-left px-3 py-2 rounded flex items-center space-x-3 transition-colors ${
                  isActivePath(tab.path) ? colors.navActive : colors.navButton
                }`}
                onClick={() => handleNavigation(tab.path)}
              >
                <span>{tab.icon}</span>
                <span className="font-mono text-sm">{tab.name}</span>
              </button>
            </li>
          ))}
          
          {isAdmin && (
            <li>
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                      location.pathname.includes('/admin') ? colors.navActive : colors.navButton
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span><Shield size={18} /></span>
                      <span className="font-mono text-sm">Admin</span>
                    </div>
                    <ChevronRight size={16} className={colors.subText} />
                  </button>
                </PopoverTrigger>
                <PopoverContent className={`w-64 p-0 ${colors.bg} border ${colors.border}`} align="end" side="right">
                  <div className={`p-3 ${colors.headerBg} border-b ${colors.border}`}>
                    <h3 className={`font-semibold ${colors.text} text-sm`}>ADMIN OPTIONS</h3>
                  </div>
                  <div className="p-2">
                    {adminOptions.map((option) => (
                      <button 
                        key={option.name}
                        className={`w-full text-left px-3 py-2 rounded flex items-center space-x-3 hover:${colors.navActive.split(' ')[0]} transition-colors ${
                          isActivePath(option.path) ? colors.navActive : colors.navButton
                        }`}
                        onClick={() => handleNavigation(option.path)}
                      >
                        <span>{option.icon}</span>
                        <span className="text-sm">{option.name}</span>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </li>
          )}
          
          <li>
            <Button 
              variant="ghost"
              className={`w-full text-left px-3 py-2 rounded flex items-center space-x-3 transition-colors ${colors.navButton}`}
              onClick={signOut}
            >
              <span><LogOut size={18} /></span>
              <span className="font-mono text-sm">Sign Out</span>
            </Button>
          </li>
        </ul>
      </nav>
      
      <div className={`mt-auto p-4 border-t ${colors.border}`}>
        <h3 className={`font-semibold ${colors.text} text-sm mb-2`}>CURRENT MISSION</h3>
        <p className={`text-sm ${colors.missionText}`}>Stop the bank robbery downtown</p>
        <div className="flex items-center space-x-2 mt-2">
          <div className={`w-full ${colors.progBg} rounded-full h-1.5`}>
            <div className="bg-yellow-500 h-1.5 rounded-full w-2/3"></div>
          </div>
          <span className={`text-xs ${colors.subText}`}>66%</span>
        </div>
      </div>
    </div>
  );
};

export default GameSidebar;
