export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const isServiceRoleConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const isConnectLaterMode = Boolean(
  process.env.NEXT_PUBLIC_CONNECT_LATER === "true" || !isSupabaseConfigured
);
