export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      character_stats: {
        Row: {
          charisma: number
          created_at: string
          energy: number
          experience: number
          health: number
          hero_name: string
          id: string
          intelligence: number
          level: number
          missions_completed: number
          speed: number
          strength: number
          updated_at: string
          user_id: string
        }
        Insert: {
          charisma?: number
          created_at?: string
          energy?: number
          experience?: number
          health?: number
          hero_name?: string
          id?: string
          intelligence?: number
          level?: number
          missions_completed?: number
          speed?: number
          strength?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          charisma?: number
          created_at?: string
          energy?: number
          experience?: number
          health?: number
          hero_name?: string
          id?: string
          intelligence?: number
          level?: number
          missions_completed?: number
          speed?: number
          strength?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      characters: {
        Row: {
          abilities: string[] | null
          backstory: string | null
          created_at: string
          id: string
          is_playable: boolean
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          abilities?: string[] | null
          backstory?: string | null
          created_at?: string
          id?: string
          is_playable?: boolean
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          abilities?: string[] | null
          backstory?: string | null
          created_at?: string
          id?: string
          is_playable?: boolean
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_actions: {
        Row: {
          action_type: string
          id: string
          payload: Json
          processed: boolean
          timestamp: string
          user_id: string
        }
        Insert: {
          action_type: string
          id?: string
          payload: Json
          processed?: boolean
          timestamp?: string
          user_id: string
        }
        Update: {
          action_type?: string
          id?: string
          payload?: Json
          processed?: boolean
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      game_saves: {
        Row: {
          created_at: string
          game_state: Json
          id: string
          last_updated: string
          player_data: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          game_state: Json
          id?: string
          last_updated?: string
          player_data: Json
          user_id: string
        }
        Update: {
          created_at?: string
          game_state?: Json
          id?: string
          last_updated?: string
          player_data?: Json
          user_id?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          quantity: number
          rarity: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          quantity?: number
          rarity?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          quantity?: number
          rarity?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      map_locations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_unlocked: boolean
          name: string
          type: string
          updated_at: string
          x_coord: number
          y_coord: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_unlocked?: boolean
          name: string
          type: string
          updated_at?: string
          x_coord?: number
          y_coord?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_unlocked?: boolean
          name?: string
          type?: string
          updated_at?: string
          x_coord?: number
          y_coord?: number
        }
        Relationships: []
      }
      missions: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          id: string
          is_active: boolean
          location_id: string | null
          rewards: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          rewards: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          rewards?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          content: string
          created_at: string
          id: string
          is_published: boolean
          requirements: string | null
          sequence: number
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_published?: boolean
          requirements?: string | null
          sequence?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_published?: boolean
          requirements?: string | null
          sequence?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_email: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_id_by_email: {
        Args: { email: string }
        Returns: string
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "player"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "player"],
    },
  },
} as const
