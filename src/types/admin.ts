
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  quantity: number;
  created_at?: string;
  updated_at?: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  backstory: string;
  abilities: string[];
  is_playable: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  rewards: string;
  location_id: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  sequence: number;
  is_published: boolean;
  requirements: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  type: string;
  x_coord: number;
  y_coord: number;
  is_unlocked: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'player';
  user_email?: string;
  created_at?: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: string;
  energy_cost: number;
  effect?: string;
  power_level: number;
  cooldown: number;
  is_active: boolean;
  created_at?: string;
}
