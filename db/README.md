# Database Utilities

This directory contains database access utilities for interacting with Supabase tables.

## Overview

The database utilities are organized by table and provide both user-level (RLS-enabled) and admin-level (service role) access methods.

### Key Principles

1. **Row Level Security (RLS)**: All user-facing operations respect RLS policies
2. **Service Role Access**: Admin services bypass RLS for background jobs
3. **Type Safety**: Full TypeScript support using generated Supabase types
4. **Error Handling**: Consistent error messages and logging

## Usage

### Client-Side Operations

For operations triggered by user actions in the browser:

```typescript
import { ProjectService } from "@/db/projects";

// These operations respect RLS and only access the current user's data
const projects = await ProjectService.getAll();
const project = await ProjectService.getById(id);
await ProjectService.update(id, { status: "complete" });
```

### Server Actions

For server-side operations in Next.js Server Actions:

```typescript
"use server";

import { ProjectService } from "@/db/projects";
import { handleError, logError } from "@/lib/errors";

export async function createProject(data: ProjectInsert) {
  try {
    const project = await ProjectService.create(data);
    return { success: true, data: project };
  } catch (error) {
    logError(error, { action: "createProject" });
    const errorInfo = handleError(error);
    return { success: false, error: errorInfo.message };
  }
}
```

### Admin Operations

For background jobs, cron tasks, or admin operations that need to access all data:

```typescript
import { AdminProjectService } from "@/db/projects";

// These operations bypass RLS and can access any user's data
const allProjects = await AdminProjectService.getAll();
const stuckProjects = await AdminProjectService.getStuckProjects(30);
await AdminProjectService.bulkUpdate(ids, { status: "draft" });
```

## Services

### ProfileService

User-level profile operations with RLS.

```typescript
import { ProfileService } from "@/db/profiles";

// Get current user's profile
const profile = await ProfileService.getCurrentProfile();

// Get profile by user ID (RLS enforced)
const profile = await ProfileService.getByUserId(userId);

// Update profile
await ProfileService.update(userId, {
  full_name: "John Doe",
  avatar_url: "https://...",
});

// Delete profile
await ProfileService.delete(userId);
```

### AdminProfileService

Admin-level profile operations that bypass RLS.

```typescript
import { AdminProfileService } from "@/db/profiles";

// Get any profile by ID (bypasses RLS)
const profile = await AdminProfileService.getById(profileId);

// Get all profiles
const profiles = await AdminProfileService.getAll();

// Update any profile
await AdminProfileService.update(profileId, updates);

// Delete any profile
await AdminProfileService.delete(profileId);
```

### ProjectService

User-level project operations with RLS.

```typescript
import { ProjectService } from "@/db/projects";

// Get all projects for current user
const projects = await ProjectService.getAll();

// Get with filters
const draftProjects = await ProjectService.getAll({
  status: "draft",
  limit: 10,
  offset: 0,
});

// Get project by ID
const project = await ProjectService.getById(id);

// Create project
const newProject = await ProjectService.create({
  user_id: userId,
  title: "My Offer Analysis",
  data: {},
});

// Update project
await ProjectService.update(id, {
  current_step: 2,
  status: "analyzing",
});

// Delete project
await ProjectService.delete(id);

// Get most recent project
const recent = await ProjectService.getMostRecent();

// Count projects by status
const counts = await ProjectService.countByStatus();
// Returns: { draft: 5, analyzing: 2, complete: 10 }
```

### AdminProjectService

Admin-level project operations that bypass RLS.

```typescript
import { AdminProjectService } from "@/db/projects";

// Get any project by ID (bypasses RLS)
const project = await AdminProjectService.getById(projectId);

// Get all projects across all users
const allProjects = await AdminProjectService.getAll({
  status: "complete",
  limit: 100,
});

// Update any project
await AdminProjectService.update(projectId, updates);

// Bulk update multiple projects
await AdminProjectService.bulkUpdate([id1, id2, id3], { status: "draft" });

// Find stuck projects for cleanup
const stuckProjects = await AdminProjectService.getStuckProjects(30);

// Delete any project
await AdminProjectService.delete(projectId);
```

## Error Handling

All database operations throw errors that should be caught and handled:

```typescript
import { handleError, logError } from "@/lib/errors";

try {
  const project = await ProjectService.getById(id);
} catch (error) {
  // Log the error with context
  logError(error, { projectId: id });

  // Get formatted error info
  const errorInfo = handleError(error);

  // Return user-friendly error
  return {
    success: false,
    error: errorInfo.message,
    code: errorInfo.code,
  };
}
```

## Types

All services use types from the generated Supabase schema:

```typescript
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
```

## Best Practices

1. **Use RLS-enabled services by default**: Only use Admin services when absolutely necessary
2. **Handle errors gracefully**: Always wrap database calls in try-catch blocks
3. **Log operations**: Use the logger for important operations and errors
4. **Validate input**: Validate data before passing to database operations
5. **Use filters**: Use the filter options for pagination and efficient queries
6. **Keep service role key secure**: Never expose the service role key to the client

## Examples

### Creating a project with validation

```typescript
import { ProjectService } from "@/db/projects";
import { ValidationError } from "@/lib/errors";

export async function createProjectAction(data: unknown) {
  // Validate input
  if (!data || typeof data !== "object" || !("title" in data)) {
    throw new ValidationError("Invalid project data");
  }

  const { title, ...rest } = data;

  if (!title || title.length < 3) {
    throw new ValidationError("Title must be at least 3 characters");
  }

  // Create project
  const project = await ProjectService.create({
    title,
    data: rest,
    status: "draft",
  });

  return project;
}
```

### Implementing pagination

```typescript
import { ProjectService } from "@/db/projects";

export async function getProjectsPage(page: number, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;

  const projects = await ProjectService.getAll({
    limit: pageSize,
    offset,
  });

  return {
    projects,
    page,
    pageSize,
    hasMore: projects.length === pageSize,
  };
}
```

### Background cleanup job

```typescript
import { AdminProjectService } from "@/db/projects";
import { logger } from "@/lib/logger";

export async function cleanupStuckProjects() {
  logger.info("Starting cleanup of stuck projects");

  // Find projects stuck in "analyzing" for more than 30 minutes
  const stuckProjects = await AdminProjectService.getStuckProjects(30);

  if (stuckProjects.length === 0) {
    logger.info("No stuck projects found");
    return;
  }

  logger.info(`Found ${stuckProjects.length} stuck projects`);

  // Reset them to draft status
  const ids = stuckProjects.map((p) => p.id);
  await AdminProjectService.bulkUpdate(ids, { status: "draft" });

  logger.info(`Reset ${ids.length} projects to draft status`);
}
```

## Testing

When testing, use the local Supabase instance:

```bash
# Start local Supabase
supabase start

# Run tests
npm test
```

See the [Supabase Setup Guide](../supabase/README.md) for more information on local development.
