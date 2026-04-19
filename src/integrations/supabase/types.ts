export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          blockchain_tx: string | null
          created_at: string
          document_url: string | null
          expiry_date: string | null
          hash: string
          id: string
          issue_date: string
          metadata: Json | null
          type: Database["public"]["Enums"]["certificate_type"]
          user_id: string
          vehicle_id: string
          verified: boolean
        }
        Insert: {
          blockchain_tx?: string | null
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          hash: string
          id?: string
          issue_date?: string
          metadata?: Json | null
          type: Database["public"]["Enums"]["certificate_type"]
          user_id: string
          vehicle_id: string
          verified?: boolean
        }
        Update: {
          blockchain_tx?: string | null
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          hash?: string
          id?: string
          issue_date?: string
          metadata?: Json | null
          type?: Database["public"]["Enums"]["certificate_type"]
          user_id?: string
          vehicle_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "certificates_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_logs: {
        Row: {
          cost: number
          created_at: string
          date: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          gallons: number
          id: string
          mileage: number
          notes: string | null
          odometer: number
          user_id: string
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          date?: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          gallons: number
          id?: string
          mileage: number
          notes?: string | null
          odometer: number
          user_id: string
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          gallons?: number
          id?: string
          mileage?: number
          notes?: string | null
          odometer?: number
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_logs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance: {
        Row: {
          cost: number
          created_at: string
          date: string
          description: string
          id: string
          next_due_date: string | null
          notes: string | null
          provider: string | null
          status: Database["public"]["Enums"]["maintenance_status"]
          type: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          cost: number
          created_at?: string
          date?: string
          description: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          type: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          date?: string
          description?: string
          id?: string
          next_due_date?: string | null
          notes?: string | null
          provider?: string | null
          status?: Database["public"]["Enums"]["maintenance_status"]
          type?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recalls: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          manufacturer: string
          recall_id: string
          remedy: string | null
          status: Database["public"]["Enums"]["recall_status"]
          title: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          description: string
          id?: string
          manufacturer: string
          recall_id: string
          remedy?: string | null
          status?: Database["public"]["Enums"]["recall_status"]
          title: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          manufacturer?: string
          recall_id?: string
          remedy?: string | null
          status?: Database["public"]["Enums"]["recall_status"]
          title?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recalls_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["priority"]
          scheduled_date: string
          status: Database["public"]["Enums"]["schedule_status"]
          title: string
          vehicle_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: Database["public"]["Enums"]["priority"]
          scheduled_date: string
          status?: Database["public"]["Enums"]["schedule_status"]
          title: string
          vehicle_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["priority"]
          scheduled_date?: string
          status?: Database["public"]["Enums"]["schedule_status"]
          title?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          id: string
          license_plate: string
          make: string
          mileage: number
          model: string
          status: Database["public"]["Enums"]["vehicle_status"]
          updated_at: string
          user_id: string | null
          vin: string
          year: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          license_plate: string
          make: string
          mileage?: number
          model: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          user_id?: string | null
          vin: string
          year: number
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          license_plate?: string
          make?: string
          mileage?: number
          model?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          user_id?: string | null
          vin?: string
          year?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_manager: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "driver"
      certificate_type:
        | "REGISTRATION"
        | "INSURANCE"
        | "EMISSION"
        | "INSPECTION"
        | "MAINTENANCE"
        | "OWNERSHIP"
      fuel_type: "REGULAR" | "MIDGRADE" | "PREMIUM" | "DIESEL" | "ELECTRIC"
      maintenance_status:
        | "SCHEDULED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
      priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
      recall_status: "OPEN" | "INSPECTED" | "REPAIRED" | "CLOSED"
      schedule_status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE"
      vehicle_status: "ACTIVE" | "MAINTENANCE" | "RETIRED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "driver"],
      certificate_type: [
        "REGISTRATION",
        "INSURANCE",
        "EMISSION",
        "INSPECTION",
        "MAINTENANCE",
        "OWNERSHIP",
      ],
      fuel_type: ["REGULAR", "MIDGRADE", "PREMIUM", "DIESEL", "ELECTRIC"],
      maintenance_status: [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      priority: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      recall_status: ["OPEN", "INSPECTED", "REPAIRED", "CLOSED"],
      schedule_status: ["PENDING", "IN_PROGRESS", "COMPLETED", "OVERDUE"],
      vehicle_status: ["ACTIVE", "MAINTENANCE", "RETIRED"],
    },
  },
} as const
