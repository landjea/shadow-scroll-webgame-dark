
import React, { useEffect, useState } from 'react';
import { MapPin, Building, Car as RoadIcon, Trees as Park, Shield as PoliceIcon, Hospital as HospitalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LocationType } from '@/types/game';

interface LocationIconProps {
  type: LocationType['type'];
  className?: string;
}

const LocationIcon: React.FC<LocationIconProps> = ({ type, className }) => {
  switch (type) {
    case 'hospital':
      return <HospitalIcon className={cn("h-4 w-4", className)} />;
    case 'police':
      return <PoliceIcon className={cn("h-4 w-4", className)} />;
    case 'mall':
      return <Building className={cn("h-4 w-4", className)} />;
    case 'suburb':
      return <MapPin className={cn("h-4 w-4", className)} />;
    case 'park':
      return <Park className={cn("h-4 w-4", className)} />;
    case 'street':
      return <RoadIcon className={cn("h-4 w-4", className)} />;
    default:
      return <MapPin className={cn("h-4 w-4", className)} />;
  }
};

export interface CityGridProps {
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
  const [centeredGrid, setCenteredGrid] = useState<LocationType[][]>([]);
  const gridSize = 7; // Total grid size (7x7)
  const radius = Math.floor(gridSize / 2); // How far the grid extends from center (3 in each direction)

  useEffect(() => {
    // Ensure we have a valid currentLocation before proceeding
    if (!currentLocation || typeof currentLocation.x === 'undefined' || typeof currentLocation.y === 'undefined') {
      console.error('Invalid currentLocation:', currentLocation);
      return;
    }

    // Generate a centered grid based on the current player position
    const newGrid: LocationType[][] = [];
    for (let y = 0; y < gridSize; y++) {
      const row: LocationType[] = [];
      
      // Calculate the world-space y coordinate
      const worldY = currentLocation.y + (y - radius);
      
      for (let x = 0; x < gridSize; x++) {
        // Calculate the world-space x coordinate
        const worldX = currentLocation.x + (x - radius);
        
        // Find if there's a location at these coordinates in the original grid
        let location: LocationType | undefined;
        
        if (grid && worldY >= 0 && worldY < grid.length && 
            worldX >= 0 && grid[worldY] && worldX < grid[worldY].length) {
          location = grid[worldY][worldX];
        }
        
        // If location doesn't exist, generate a new one
        if (!location) {
          const types: LocationType['type'][] = ['hospital', 'police', 'mall', 'suburb', 'park', 'street'];
          const locationNames: Record<LocationType['type'], string[]> = {
            hospital: ['Central Hospital', 'Mercy Hospital', 'City Medical'],
            police: ['Police HQ', 'Precinct 99', 'Sheriff Office'],
            mall: ['Mega Mall', 'City Center', 'Shopping Plaza'],
            suburb: ['Green Hills', 'Pleasant View', 'Oak District'],
            park: ['Central Park', 'Rose Garden', 'Lakeside Park'],
            street: ['Main St.', 'Broadway', 'Bay Avenue']
          };
          
          const type = types[Math.floor(Math.random() * types.length)];
          const nameOptions = locationNames[type];
          const name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
          
          location = {
            id: `loc-${worldX}-${worldY}`,
            name,
            type,
            x: worldX,
            y: worldY
          };
        }
        
        row.push(location);
      }
      newGrid.push(row);
    }
    
    setCenteredGrid(newGrid);
  }, [currentLocation, grid]);

  const isLocationReachable = (location: LocationType): boolean => {
    if (!currentLocation) return false;
    
    if (location.x === currentLocation.x && location.y === currentLocation.y) {
      return false; // Current location is not reachable (already there)
    }
    
    // Manhattan distance: |x2 - x1| + |y2 - y1|
    const distance = Math.abs(location.x - currentLocation.x) + Math.abs(location.y - currentLocation.y);
    
    return distance <= heroSpeed && distance <= heroStamina;
  };

  if (!currentLocation || !grid || grid.length === 0) {
    return <div className="p-4 text-center">Loading map...</div>;
  }

  return (
    <div className="grid grid-cols-7 gap-1 p-2 rounded-md border" style={{ background: "#2F2E33", borderColor: "#2F2E33" }}>
      {centeredGrid.map((row, rowIndex) => (
        <React.Fragment key={`row-${rowIndex}`}>
          {row.map((location) => {
            const isCurrent = location.x === currentLocation.x && location.y === currentLocation.y;
            const isReachable = isLocationReachable(location);
            
            return (
              <button
                key={`loc-${location.x}-${location.y}`}
                onClick={() => isReachable && onLocationSelect(location)}
                className={cn(
                  "relative h-12 p-1 rounded flex flex-col items-center justify-center text-xs transition-all",
                  isCurrent ? "bg-[#FE5F55] text-white" : 
                    isReachable ? "bg-[#5B3C80] hover:bg-[#744C9E] text-[#F0EBF4]" : 
                    "bg-[#2F2E33]/70 text-[#A3A1A8]/50 cursor-not-allowed"
                )}
                disabled={!isReachable && !isCurrent}
              >
                <LocationIcon 
                  type={location.type} 
                  className={cn(
                    isCurrent ? "text-white" : 
                      isReachable ? "text-[#BCD8C1]" : "text-[#A3A1A8]/50"
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
