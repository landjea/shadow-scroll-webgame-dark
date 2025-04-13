
export interface Database {
  public: {
    Tables: {
      character_stats: {
        Row: {
          id: string;
          user_id: string;
          hero_name: string;
          energy: number;
          health: number;
          speed: number;
          strength: number;
          intelligence: number;
          charisma: number;
          missions_completed: number;
          level: number;
          experience: number;
          created_at: string;
          updated_at: string;
        };
      };
      characters: {
        Row: {
          id: string;
          name: string;
          role: string;
          backstory: string | null;
          abilities: string[];
          is_playable: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      game_actions: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          payload: any;
          timestamp: string;
          processed: boolean;
        };
      };
      game_saves: {
        Row: {
          id: string;
          user_id: string;
          game_state: any;
          player_data: any;
          created_at: string;
          last_updated: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: string;
          rarity: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
      };
      map_locations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: string;
          x_coord: number;
          y_coord: number;
          is_unlocked: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      missions: {
        Row: {
          id: string;
          title: string;
          description: string;
          difficulty: string;
          rewards: string;
          location_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      stories: {
        Row: {
          id: string;
          title: string;
          content: string;
          sequence: number;
          is_published: boolean;
          requirements: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'moderator' | 'player';
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
