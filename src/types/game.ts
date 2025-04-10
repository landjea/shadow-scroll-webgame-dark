
export interface LocationType {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'mall' | 'suburb' | 'park' | 'street';
  x: number;
  y: number;
}

export interface GameAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}
