
// This file helps type-safe Supabase table operations
import { Database } from '@/types/database';

// Define known table names as a union type
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
}
