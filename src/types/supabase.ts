
// This file helps type-safe Supabase table operations
import { Database } from '@/types/database';

// Define known table names as a union type
<<<<<<< HEAD
export type TableName = 
  | 'characters' 
  | 'character_stats' 
  | 'game_actions' 
  | 'game_saves' 
  | 'inventory_items' 
  | 'map_locations' 
  | 'missions' 
  | 'stories' 
  | 'user_roles'
  | 'abilities';

// Create a type that maps a TableName to its actual type
export type TableTypes = {
<<<<<<< HEAD
  characters: Database['public']['Tables']['characters']['Row'];
  character_stats: Database['public']['Tables']['character_stats']['Row'];
  game_actions: Database['public']['Tables']['game_actions']['Row'];
  game_saves: Database['public']['Tables']['game_saves']['Row'];
  inventory_items: Database['public']['Tables']['inventory_items']['Row'];
  map_locations: Database['public']['Tables']['map_locations']['Row'];
  missions: Database['public']['Tables']['missions']['Row'];
  stories: Database['public']['Tables']['stories']['Row'];
  user_roles: Database['public']['Tables']['user_roles']['Row'];
  abilities: any; // Temporary solution until proper type is available
=======
  characters: any;
  character_stats: any;
  game_actions: any;
  game_saves: any;
  inventory_items: any;
  map_locations: any;
  missions: any;
  stories: any;
  user_roles: any;
  abilities: any;
>>>>>>> parent of 26dfbe8 (Fix: RequireAuth default export)
}

// Type guard to check if a string is a valid TableName
export function isValidTableName(name: string): name is TableName {
  return ['characters', 'character_stats', 'game_actions', 'game_saves', 
          'inventory_items', 'map_locations', 'missions', 'stories', 
          'user_roles', 'abilities'].includes(name);
}
=======
export type TableName = keyof Database['public']['Tables'];
>>>>>>> parent of 2172bce (Fix: Build errors)
