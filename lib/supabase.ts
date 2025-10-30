/**
 * @deprecated Use the new Supabase utilities instead:
 * - Client-side: import { supabase } from "@/lib/supabase/client"
 * - Server-side: import { createClient } from "@/lib/supabase/server"
 * - Admin: import { createServiceRoleClient } from "@/lib/supabase/server"
 */

import { supabase as clientSupabase } from "./supabase/client";

export const supabase = clientSupabase;

// Re-export Database type from the new location
export type { Database } from "@/types/supabase";
