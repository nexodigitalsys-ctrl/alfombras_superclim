import type {
  MovementType,
  RugPhotoCategory,
  RugStatus,
  ServiceType,
  SizeCategory,
} from "@/types/domain";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          address: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          address?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      storage_locations: {
        Row: {
          id: string;
          zone: string;
          rack: string;
          level: string;
          position: string;
          label: string;
          is_occupied: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          zone: string;
          rack: string;
          level: string;
          position: string;
          label?: string;
          is_occupied?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          zone?: string;
          rack?: string;
          level?: string;
          position?: string;
          label?: string;
          is_occupied?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rugs: {
        Row: {
          id: string;
          client_id: string;
          code: string;
          type: string;
          width_cm: number;
          length_cm: number;
          size_category: SizeCategory;
          primary_color: string | null;
          condition_in: string | null;
          current_status: RugStatus;
          storage_location_id: string | null;
          entry_date: string;
          expected_exit_date: string | null;
          actual_exit_date: string | null;
          service_type: ServiceType;
          includes_cleaning: boolean;
          includes_delivery: boolean;
          base_price: number;
          storage_price: number;
          extra_price: number;
          total_price: number;
          notes: string | null;
          photos: string[];
          photographed_on_entry: boolean;
          condition_reviewed: boolean;
          cleaning_completed: boolean;
          stored_correctly: boolean;
          ready_for_exit: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          code: string;
          type: string;
          width_cm: number;
          length_cm: number;
          size_category: SizeCategory;
          primary_color?: string | null;
          condition_in?: string | null;
          current_status: RugStatus;
          storage_location_id?: string | null;
          entry_date: string;
          expected_exit_date?: string | null;
          actual_exit_date?: string | null;
          service_type: ServiceType;
          includes_cleaning?: boolean;
          includes_delivery?: boolean;
          base_price?: number;
          storage_price?: number;
          extra_price?: number;
          total_price?: number;
          notes?: string | null;
          photos?: string[];
          photographed_on_entry?: boolean;
          condition_reviewed?: boolean;
          cleaning_completed?: boolean;
          stored_correctly?: boolean;
          ready_for_exit?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          code?: string;
          type?: string;
          width_cm?: number;
          length_cm?: number;
          size_category?: SizeCategory;
          primary_color?: string | null;
          condition_in?: string | null;
          current_status?: RugStatus;
          storage_location_id?: string | null;
          entry_date?: string;
          expected_exit_date?: string | null;
          actual_exit_date?: string | null;
          service_type?: ServiceType;
          includes_cleaning?: boolean;
          includes_delivery?: boolean;
          base_price?: number;
          storage_price?: number;
          extra_price?: number;
          total_price?: number;
          notes?: string | null;
          photos?: string[];
          photographed_on_entry?: boolean;
          condition_reviewed?: boolean;
          cleaning_completed?: boolean;
          stored_correctly?: boolean;
          ready_for_exit?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rug_photos: {
        Row: {
          id: string;
          rug_id: string;
          storage_path: string;
          category: RugPhotoCategory;
          caption: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rug_id: string;
          storage_path: string;
          category: RugPhotoCategory;
          caption?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rug_id?: string;
          storage_path?: string;
          category?: RugPhotoCategory;
          caption?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      pricing_rules: {
        Row: {
          id: string;
          service_type: ServiceType;
          size_category: SizeCategory;
          base_price: number;
          price_per_m2: number;
          storage_daily_price: number;
          cleaning_price: number;
          delivery_price: number;
          extra_price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_type: ServiceType;
          size_category: SizeCategory;
          base_price?: number;
          price_per_m2?: number;
          storage_daily_price?: number;
          cleaning_price?: number;
          delivery_price?: number;
          extra_price?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_type?: ServiceType;
          size_category?: SizeCategory;
          base_price?: number;
          price_per_m2?: number;
          storage_daily_price?: number;
          cleaning_price?: number;
          delivery_price?: number;
          extra_price?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rug_movements: {
        Row: {
          id: string;
          rug_id: string;
          movement_type: MovementType;
          from_location_id: string | null;
          to_location_id: string | null;
          moved_at: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rug_id: string;
          movement_type: MovementType;
          from_location_id?: string | null;
          to_location_id?: string | null;
          moved_at?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rug_id?: string;
          movement_type?: MovementType;
          from_location_id?: string | null;
          to_location_id?: string | null;
          moved_at?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      apply_rug_movement: {
        Args: {
          p_rug_id: string;
          p_movement_type: MovementType;
          p_to_location_id?: string | null;
          p_notes?: string | null;
          p_moved_at?: string;
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
