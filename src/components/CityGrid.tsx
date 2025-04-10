
import React from 'react';
import { MapPin, Hospital, Police, Building, ParkIcon, Road } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LocationType {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'mall' | 'suburb' | 'park' | 'street';
  x: number;
  y: number;
}

interface LocationIconProps {
  type: LocationType['type'];
  className?: string;
}

const LocationIcon: React.FC<LocationIconProps> = ({ type, className }) => {
  switch (type) {
    case 'hospital':
      return <Hospital className={cn("h-4 w-4", className)} />;
    case 'police':
      return <Police className={cn("h-4 w-4", className)} />;
    case 'mall':
      return <Building className={cn("h-4 w-4", className)} />;
    case 'suburb':
      return <MapPin className={cn("h-4 w-4", className)} />;
    case 'park':
      return <ParkIcon className={cn("h-4 w-4", className)} />;
    case 'street':
      return <Road className={cn("h-4 w-4", className)} />;
    default:
      return <MapPin className={cn("h-4 w-4", className)} />;
  }
};

interface CityGridProps {
  grid: LocationType[][];
  currentLocation: LocationType;
  heroSpeed: number;
  heroStamina: number;
  onLocationSelect: (location: LocationType) => void;
}

const CityGrid: React.FC<CityGridProps> = ({
  grid,
  currentLocation,
  heroSpeed,
  heroStamina,
  onLocationSelect,
}) => {
  const isLocationReachable = (location: LocationType): boolean => {
    if (location.x === currentLocation.x && location.y === currentLocation.y) {
      return false; // Current location is not reachable (already there)
    }
    
    // Manhattan distance: |x2 - x1| + |y2 - y1|
    const distance = Math.abs(location.x - currentLocation.x) + Math.abs(location.y - currentLocation.y);
    
    return distance <= heroSpeed && distance <= heroStamina;
  };

  return (
    <div className="grid grid-cols-7 gap-1 p-2 bg-blue-950 rounded-md border border-blue-900/50">
      {grid.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {row.map((location) => {
            const isCurrent = location.x === currentLocation.x && location.y === currentLocation.y;
            const isReachable = isLocationReachable(location);
            
            return (
              <button
                key={location.id}
                onClick={() => isReachable && onLocationSelect(location)}
                className={cn(
                  "relative h-12 p-1 rounded flex flex-col items-center justify-center text-xs transition-all",
                  isCurrent ? "bg-blue-500 text-white" : 
                    isReachable ? "bg-blue-900 hover:bg-blue-800 text-blue-100" : 
                    "bg-blue-950/50 text-blue-500/50 cursor-not-allowed"
                )}
                disabled={!isReachable && !isCurrent}
              >
                <LocationIcon 
                  type={location.type} 
                  className={cn(
                    isCurrent ? "text-white" : 
                      isReachable ? "text-game-accent" : "text-blue-500/50"
                  )} 
                />
                <div className="text-[9px] mt-0.5">
                  {location.name}
                </div>
                <div className="absolute bottom-0.5 right-0.5 text-[8px] opacity-70">
                  {location.x},{location.y}
                </div>
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CityGrid;
