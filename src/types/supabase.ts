
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

