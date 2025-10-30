"use server";

import { ProjectService } from "@/db/projects";
import { handleError, logError } from "@/lib/errors";
import { logger } from "@/lib/logger";
import { Database } from "@/types/supabase";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

/**
 * Create a new project
 */
export async function createProject(data: ProjectInsert) {
  try {
    logger.info("Creating new project", { title: data.title });
    const project = await ProjectService.create(data);
    logger.info("Project created successfully", { id: project.id });
    return { success: true, data: project };
  } catch (error) {
    logError(error, { action: "createProject", data });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, updates: ProjectUpdate) {
  try {
    logger.info("Updating project", { id });
    const project = await ProjectService.update(id, updates);
    logger.info("Project updated successfully", { id: project.id });
    return { success: true, data: project };
  } catch (error) {
    logError(error, { action: "updateProject", id, updates });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string) {
  try {
    logger.info("Deleting project", { id });
    await ProjectService.delete(id);
    logger.info("Project deleted successfully", { id });
    return { success: true };
  } catch (error) {
    logError(error, { action: "deleteProject", id });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Get all projects for the current user
 */
export async function getUserProjects() {
  try {
    logger.debug("Fetching user projects");
    const projects = await ProjectService.getAll();
    logger.debug("Fetched user projects", { count: projects.length });
    return { success: true, data: projects };
  } catch (error) {
    logError(error, { action: "getUserProjects" });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}

/**
 * Get a project by ID
 */
export async function getProject(id: string) {
  try {
    logger.debug("Fetching project", { id });
    const project = await ProjectService.getById(id);
    
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    
    return { success: true, data: project };
  } catch (error) {
    logError(error, { action: "getProject", id });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}
