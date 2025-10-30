import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export class ProfileService {
  /**
   * Get a profile by user ID (uses RLS)
   */
  static async getByUserId(userId: string): Promise<Profile | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Get current user's profile
   */
  static async getCurrentProfile(): Promise<Profile | null> {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return this.getByUserId(user.id);
  }

  /**
   * Create a new profile
   */
  static async create(profile: ProfileInsert): Promise<Profile> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Update a profile
   */
  static async update(
    userId: string,
    updates: ProfileUpdate
  ): Promise<Profile> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a profile
   */
  static async delete(userId: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }
}

/**
 * Admin profile service with service role access
 * Used for background jobs and admin operations
 */
export class AdminProfileService {
  /**
   * Get any profile by ID (bypasses RLS)
   */
  static async getById(id: string): Promise<Profile | null> {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all profiles (bypasses RLS)
   */
  static async getAll(): Promise<Profile[]> {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      throw new Error(`Failed to fetch profiles: ${error.message}`);
    }

    return data;
  }

  /**
   * Update any profile (bypasses RLS)
   */
  static async update(id: string, updates: ProfileUpdate): Promise<Profile> {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete any profile (bypasses RLS)
   */
  static async delete(id: string): Promise<void> {
    const supabase = await createServiceRoleClient();

    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
  }
}
