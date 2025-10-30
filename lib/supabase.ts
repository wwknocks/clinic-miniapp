import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          current_step: number;
          data: Record<string, any>;
          created_at: string;
          updated_at: string;
          status: "draft" | "analyzing" | "complete";
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          current_step?: number;
          data?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          status?: "draft" | "analyzing" | "complete";
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          current_step?: number;
          data?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
          status?: "draft" | "analyzing" | "complete";
        };
      };
    };
  };
};
