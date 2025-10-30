import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MjcsImV4cCI6MTk2MDc2ODgyN30.placeholder";

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
) {
  if (typeof window !== "undefined") {
    console.warn(
      "Supabase environment variables are not set. Client functionality will be limited."
    );
  }
}

export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = createClient();
