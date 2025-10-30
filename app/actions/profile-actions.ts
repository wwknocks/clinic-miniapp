"use server";

import { ProfileService } from "@/db/profiles";
import { handleError, logError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { Database } from "@/types/supabase";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

/**
 * Get the current user's profile
 */
export async function getCurrentProfile() {
  try {
    logger.debug("Fetching current profile");
    const profile = await ProfileService.getCurrentProfile();
    
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }
    
    return { success: true, data: profile };
  } catch (error) {
    logError(error, { action: "getCurrentProfile" });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(userId: string, updates: ProfileUpdate) {
  try {
    logger.info("Updating profile", { userId });
    const profile = await ProfileService.update(userId, updates);
    logger.info("Profile updated successfully", { userId });
    return { success: true, data: profile };
  } catch (error) {
    logError(error, { action: "updateProfile", userId, updates });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}
