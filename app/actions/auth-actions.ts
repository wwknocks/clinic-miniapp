"use server";

import { createClient } from "@/lib/supabase/server";
import { handleError, logError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signUp(
  email: string,
  password: string,
  fullName: string
) {
  try {
    const supabase = await createClient();

    logger.info("Attempting signup", { email });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      logger.error("Signup failed", { error: error.message, email });
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Failed to create user" };
    }

    logger.info("Signup successful", { userId: data.user.id, email });

    return { success: true, data: { user: data.user, session: data.session } };
  } catch (error) {
    logError(error, { action: "signUp", email });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient();

    logger.info("Attempting sign in", { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error("Sign in failed", { error: error.message, email });
      return { success: false, error: error.message };
    }

    logger.info("Sign in successful", { userId: data.user.id, email });

    revalidatePath("/", "layout");

    return { success: true, data: { user: data.user, session: data.session } };
  } catch (error) {
    logError(error, { action: "signIn", email });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();

    logger.info("Attempting sign out");

    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error("Sign out failed", { error: error.message });
      return { success: false, error: error.message };
    }

    logger.info("Sign out successful");

    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    logError(error, { action: "signOut" });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function resetPassword(email: string) {
  try {
    const supabase = await createClient();

    logger.info("Requesting password reset", { email });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
    });

    if (error) {
      logger.error("Password reset request failed", {
        error: error.message,
        email,
      });
      return { success: false, error: error.message };
    }

    logger.info("Password reset email sent", { email });

    return {
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    };
  } catch (error) {
    logError(error, { action: "resetPassword", email });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function updatePassword(newPassword: string) {
  try {
    const supabase = await createClient();

    logger.info("Attempting password update");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      logger.error("Password update failed", { error: error.message });
      return { success: false, error: error.message };
    }

    logger.info("Password updated successfully");

    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    logError(error, { action: "updatePassword" });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: user };
  } catch (error) {
    logError(error, { action: "getUser" });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}
