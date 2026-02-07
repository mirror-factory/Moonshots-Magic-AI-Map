/**
 * @module lib/supabase/types
 * Auto-generated TypeScript types for the Supabase database schema.
 * Regenerate with: `supabase gen types typescript --project-id hwppzktsujfeyxullsrm`
 */

/** Recursive JSON-compatible value type for Supabase columns. */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/** Full Supabase database schema with table Row/Insert/Update types. */
export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          ambient_context: Json | null
          created_at: string
          id: string
          messages: Json
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ambient_context?: Json | null
          created_at?: string
          id?: string
          messages?: Json
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ambient_context?: Json | null
          created_at?: string
          id?: string
          messages?: Json
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          address: string
          all_day: boolean | null
          category: string
          city: string
          coordinates: number[]
          created_at: string
          description: string
          end_date: string | null
          expires_at: string | null
          featured: boolean | null
          fts: unknown
          id: string
          image_url: string | null
          is_free: boolean | null
          price_currency: string | null
          price_max: number | null
          price_min: number | null
          region: string
          source_id: string | null
          source_type: string
          start_date: string
          status: string
          subcategory: string | null
          tags: string[] | null
          timezone: string | null
          title: string
          updated_at: string
          url: string | null
          venue: string
        }
        Insert: {
          address?: string
          all_day?: boolean | null
          category: string
          city?: string
          coordinates: number[]
          created_at?: string
          description?: string
          end_date?: string | null
          expires_at?: string | null
          featured?: boolean | null
          fts?: unknown
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          price_currency?: string | null
          price_max?: number | null
          price_min?: number | null
          region?: string
          source_id?: string | null
          source_type?: string
          start_date: string
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          timezone?: string | null
          title: string
          updated_at?: string
          url?: string | null
          venue: string
        }
        Update: {
          address?: string
          all_day?: boolean | null
          category?: string
          city?: string
          coordinates?: number[]
          created_at?: string
          description?: string
          end_date?: string | null
          expires_at?: string | null
          featured?: boolean | null
          fts?: unknown
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          price_currency?: string | null
          price_max?: number | null
          price_min?: number | null
          region?: string
          source_id?: string | null
          source_type?: string
          start_date?: string
          status?: string
          subcategory?: string | null
          tags?: string[] | null
          timezone?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          venue?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          categories: string[] | null
          created_at: string
          goals: string[] | null
          has_kids: boolean | null
          has_pets: boolean | null
          id: string
          name: string | null
          preferred_days: string[] | null
          preferred_times: string[] | null
          price_range: string | null
          travel_radius: number | null
          updated_at: string
          user_id: string
          vibes: string[] | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          goals?: string[] | null
          has_kids?: boolean | null
          has_pets?: boolean | null
          id?: string
          name?: string | null
          preferred_days?: string[] | null
          preferred_times?: string[] | null
          price_range?: string | null
          travel_radius?: number | null
          updated_at?: string
          user_id: string
          vibes?: string[] | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          goals?: string[] | null
          has_kids?: boolean | null
          has_pets?: boolean | null
          id?: string
          name?: string | null
          preferred_days?: string[] | null
          preferred_times?: string[] | null
          price_range?: string | null
          travel_radius?: number | null
          updated_at?: string
          user_id?: string
          vibes?: string[] | null
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          created_at: string
          event_id: string
          id: string
          interaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          interaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          interaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

/** Helper type to extract a table's Row type by name. */
export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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

/** Helper type to extract a table's Insert type by name. */
export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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

/** Helper type to extract a table's Update type by name. */
export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
