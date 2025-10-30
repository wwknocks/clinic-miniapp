import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export interface ProjectFilters {
  status?: "draft" | "analyzing" | "complete";
  limit?: number;
  offset?: number;
}

export class ProjectService {
  /**
   * Get a project by ID (uses RLS)
   */
  static async getById(id: string): Promise<Project | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all projects for the current user
   */
  static async getAll(filters?: ProjectFilters): Promise<Project[]> {
    const supabase = await createClient();

    let query = supabase.from("projects").select("*").order("created_at", {
      ascending: false,
    });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data;
  }

  /**
   * Get projects by user ID (uses RLS)
   */
  static async getByUserId(
    userId: string,
    filters?: ProjectFilters
  ): Promise<Project[]> {
    const supabase = await createClient();

    let query = supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data;
  }

  /**
   * Create a new project
   */
  static async create(project: ProjectInsert): Promise<Project> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .insert(project)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }

    return data;
  }

  /**
   * Update a project
   */
  static async update(id: string, updates: ProjectUpdate): Promise<Project> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete a project
   */
  static async delete(id: string): Promise<void> {
    const supabase = await createClient();

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  /**
   * Get the most recent project for the current user
   */
  static async getMostRecent(): Promise<Project | null> {
    const projects = await this.getAll({ limit: 1 });
    return projects[0] || null;
  }

  /**
   * Count projects by status for the current user
   */
  static async countByStatus(): Promise<
    Record<"draft" | "analyzing" | "complete", number>
  > {
    const supabase = await createClient();

    const { count: draftCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft");

    const { count: analyzingCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "analyzing");

    const { count: completeCount } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "complete");

    return {
      draft: draftCount || 0,
      analyzing: analyzingCount || 0,
      complete: completeCount || 0,
    };
  }
}

/**
 * Admin project service with service role access
 * Used for background jobs and admin operations
 */
export class AdminProjectService {
  /**
   * Get any project by ID (bypasses RLS)
   */
  static async getById(id: string): Promise<Project | null> {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch project: ${error.message}`);
    }

    return data;
  }

  /**
   * Get all projects (bypasses RLS)
   */
  static async getAll(filters?: ProjectFilters): Promise<Project[]> {
    const supabase = await createServiceRoleClient();

    let query = supabase.from("projects").select("*").order("created_at", {
      ascending: false,
    });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch projects: ${error.message}`);
    }

    return data;
  }

  /**
   * Update any project (bypasses RLS)
   */
  static async update(id: string, updates: ProjectUpdate): Promise<Project> {
    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete any project (bypasses RLS)
   */
  static async delete(id: string): Promise<void> {
    const supabase = await createServiceRoleClient();

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  }

  /**
   * Bulk update projects (bypasses RLS)
   */
  static async bulkUpdate(
    ids: string[],
    updates: ProjectUpdate
  ): Promise<void> {
    const supabase = await createServiceRoleClient();

    const { error } = await supabase
      .from("projects")
      .update(updates)
      .in("id", ids);

    if (error) {
      throw new Error(`Failed to bulk update projects: ${error.message}`);
    }
  }

  /**
   * Get projects that are stuck in "analyzing" status
   * (useful for background cleanup jobs)
   */
  static async getStuckProjects(olderThanMinutes: number = 30): Promise<Project[]> {
    const supabase = await createServiceRoleClient();

    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - olderThanMinutes);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "analyzing")
      .lt("updated_at", cutoffTime.toISOString());

    if (error) {
      throw new Error(`Failed to fetch stuck projects: ${error.message}`);
    }

    return data;
  }
}
