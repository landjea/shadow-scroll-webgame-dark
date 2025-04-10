
import { LocationType } from "@/types/game";

// Location types
export const locationTypes: LocationType['type'][] = [
  'hospital', 'police', 'mall', 'suburb', 'park', 'street'
];

export const locationNames = {
  hospital: ['Central Hospital', 'Mercy Hospital', 'City Medical'],
  police: ['Police HQ', 'Precinct 99', 'Sheriff Office'],
  mall: ['Mega Mall', 'City Center', 'Shopping Plaza'],
  suburb: ['Green Hills', 'Pleasant View', 'Oak District'],
  park: ['Central Park', 'Rose Garden', 'Lakeside Park'],
  street: ['Main St.', 'Broadway', 'Bay Avenue']
};

// Generate a random grid
export const generateCityGrid = (size: number): LocationType[][] => {
  const grid: LocationType[][] = [];

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
