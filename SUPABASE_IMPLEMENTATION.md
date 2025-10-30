# Supabase Backend Implementation

This document provides an overview of the Supabase backend setup for the Offer Wind Tunnel application.

## 📋 Overview

The application now has a complete Supabase backend integration with:

- ✅ Database schema with migrations
- ✅ Row Level Security (RLS) policies
- ✅ Storage bucket configuration with 30-day TTL
- ✅ TypeScript types generated from schema
- ✅ Client and server-side utilities
- ✅ Service role access for background jobs
- ✅ Error handling and logging
- ✅ Sample server actions
- ✅ Comprehensive documentation

## 🗂️ Project Structure

```
├── db/                          # Database access utilities
│   ├── profiles.ts             # Profile operations
│   ├── projects.ts             # Project operations
│   ├── index.ts                # Exports
│   └── README.md               # Database utilities guide
│
├── lib/
│   ├── supabase/               # Supabase clients
│   │   ├── client.ts           # Browser client (RLS-enabled)
│   │   ├── server.ts           # Server client + service role
│   │   ├── storage.ts          # Storage utilities
│   │   └── index.ts            # Exports
│   ├── errors.ts               # Error handling utilities
│   ├── logger.ts               # Logging utilities
│   └── supabase.ts             # Backward compatibility
│
├── app/actions/                # Server actions (examples)
│   ├── project-actions.ts      # Project CRUD operations
│   └── profile-actions.ts      # Profile operations
│
├── supabase/                   # Supabase configuration
│   ├── migrations/             # SQL migrations
│   │   ├── 20240101000000_create_profiles.sql
│   │   ├── 20240101000001_create_projects.sql
│   │   └── 20240101000002_create_storage.sql
│   ├── config.toml             # Local Supabase config
│   └── README.md               # Setup guide
│
└── types/
    └── supabase.ts             # Generated TypeScript types
```

## 🗄️ Database Schema

### Tables

#### `profiles`

User profile information with automatic creation on signup.

**Columns:**

- `id` (UUID, PK): Profile ID
- `user_id` (UUID, FK → auth.users): User reference
- `email` (TEXT): User email
- `full_name` (TEXT): User's full name
- `avatar_url` (TEXT): Avatar URL
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp (auto-updated)

**Features:**

- Auto-creates profile when user signs up
- Auto-updates `updated_at` on changes
- Unique constraint on `user_id`
- Index on `user_id` for fast lookups

#### `projects`

Offer analysis projects with JSONB data storage.

**Columns:**

- `id` (UUID, PK): Project ID
- `user_id` (UUID, FK → auth.users): User reference
- `title` (TEXT): Project title (default: "Untitled Project")
- `current_step` (INTEGER): Current workflow step (0-3)
- `data` (JSONB): Project data (flexible schema)
- `status` (TEXT): Status (draft | analyzing | complete)
- `created_at` (TIMESTAMPTZ): Creation timestamp
- `updated_at` (TIMESTAMPTZ): Last update timestamp (auto-updated)

**Features:**

- JSONB storage for flexible data structure
- Auto-updates `updated_at` on changes
- Multiple indexes for query optimization
- Status constraint validation

### Storage

#### `pdf-uploads` Bucket

Private storage bucket for PDF file uploads.

**Configuration:**

- Private bucket (requires authentication)
- 50MB file size limit
- Allowed mime types: `application/pdf`
- 30-day TTL (enforced by cleanup function)
- Files organized by user: `{userId}/{fileName}`

**Features:**

- Signed URL generation (1-hour validity)
- Automatic cleanup of files older than 30 days
- User-isolated storage paths

## 🔒 Row Level Security (RLS)

All tables have RLS enabled with the following policies:

### User Policies

- Users can only SELECT, INSERT, UPDATE, DELETE their own records
- Enforced through `auth.uid() = user_id` condition

### Service Role Policy

- Service role can perform ALL operations on any record
- Used for background jobs and admin operations
- Bypasses RLS when using `createServiceRoleClient()`

## 🔌 API Usage

### Client-Side (Browser)

```typescript
import { supabase } from "@/lib/supabase/client";

// Queries automatically filtered by RLS
const { data } = await supabase.from("projects").select("*");
```

### Server-Side (Server Actions)

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export async function myServerAction() {
  const supabase = await createClient();
  // RLS enforced based on authenticated user
  const { data } = await supabase.from("projects").select("*");
}
```

### Admin Operations (Background Jobs)

```typescript
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function backgroundJob() {
  const supabase = await createServiceRoleClient();
  // Bypasses RLS - use with caution!
  const { data } = await supabase.from("projects").select("*");
}
```

### Database Services

```typescript
import { ProjectService, ProfileService } from "@/db";

// User-level operations (RLS enabled)
const projects = await ProjectService.getAll({ limit: 10 });
const profile = await ProfileService.getCurrentProfile();

// Admin operations (bypasses RLS)
import { AdminProjectService } from "@/db";
const stuckProjects = await AdminProjectService.getStuckProjects(30);
```

## 🔧 Environment Variables

Required environment variables:

```env
# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-only, keep secret!
```

## 🚀 Getting Started

### Local Development

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Start local Supabase:

   ```bash
   supabase start
   ```

3. Copy credentials to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
   SUPABASE_SERVICE_ROLE_KEY=eyJh...
   ```

4. Access Supabase Studio at http://localhost:54323

### Production Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Link your local project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
3. Push migrations:
   ```bash
   supabase db push
   ```
4. Configure production environment variables

See [supabase/README.md](./supabase/README.md) for detailed instructions.

## 📝 Database Operations

### Profiles

```typescript
import { ProfileService } from "@/db/profiles";

// Get current user's profile
const profile = await ProfileService.getCurrentProfile();

// Update profile
await ProfileService.update(userId, {
  full_name: "John Doe",
  avatar_url: "https://...",
});
```

### Projects

```typescript
import { ProjectService } from "@/db/projects";

// Get all projects
const projects = await ProjectService.getAll();

// Get with filters
const draftProjects = await ProjectService.getAll({
  status: "draft",
  limit: 10,
});

// Create project
const project = await ProjectService.create({
  user_id: userId,
  title: "My Analysis",
  data: { offerTitle: "Senior Developer" },
});

// Update project
await ProjectService.update(id, {
  current_step: 2,
  status: "analyzing",
});

// Get counts by status
const counts = await ProjectService.countByStatus();
// Returns: { draft: 5, analyzing: 2, complete: 10 }
```

### Storage

```typescript
import { storageService } from "@/lib/supabase/storage";

// Upload PDF
const { path, url } = await storageService.uploadPDF({
  userId: "user-uuid",
  fileName: "offer-analysis.pdf",
  file: pdfFile,
});

// Get signed URL (1 hour validity)
const signedUrl = await storageService.getSignedUrl(path);

// Delete file
await storageService.deleteFile(path);

// List user's files
const files = await storageService.listUserFiles(userId);
```

## 🛠️ Error Handling

```typescript
import { handleError, logError } from "@/lib/errors";

try {
  await ProjectService.create(data);
} catch (error) {
  logError(error, { action: "createProject", data });
  const errorInfo = handleError(error);
  return {
    success: false,
    error: errorInfo.message,
    code: errorInfo.code,
  };
}
```

## 📊 Logging

```typescript
import { logger } from "@/lib/logger";

logger.debug("Debug message", { context: "value" });
logger.info("Info message");
logger.warn("Warning message");
logger.error("Error message", { error });
```

## 🔄 Migrations

### Create a new migration

```bash
supabase migration new migration_name
```

### Apply migrations

```bash
# Local
supabase db reset

# Production
supabase db push
```

### Generate types from schema

```bash
# From local database
supabase gen types typescript --local > types/supabase.ts

# From production
supabase gen types typescript --project-ref your-ref > types/supabase.ts
```

## 📚 Documentation

- [Supabase Setup Guide](./supabase/README.md) - Detailed setup instructions
- [Database Utilities Guide](./db/README.md) - Database service usage
- [Main README](./README.md) - Project overview

## 🧪 Testing

All database operations can be tested against the local Supabase instance:

```bash
# Start local Supabase
supabase start

# Run your tests
npm test

# Stop local Supabase
supabase stop
```

## 🔐 Security Best Practices

1. **Never expose service role key** - Only use on server-side
2. **Use RLS policies** - Default to user-level services
3. **Validate input** - Always validate data before database operations
4. **Handle errors** - Use proper error handling and logging
5. **Audit admin operations** - Log all service role operations
6. **Rotate keys** - Regularly rotate API keys in production

## 📈 Performance

- Indexes on frequently queried columns
- Pagination support in all list operations
- Efficient JSONB queries
- Connection pooling via Supabase

## 🎯 Next Steps

1. Set up authentication flows (login, signup, logout)
2. Implement project CRUD UI using the server actions
3. Add file upload functionality using storage utilities
4. Set up background job for PDF cleanup
5. Configure monitoring and error tracking
6. Add comprehensive tests for database operations

## 🐛 Troubleshooting

See the [Supabase Setup Guide](./supabase/README.md#troubleshooting) for common issues and solutions.

## 📞 Support

For Supabase-specific issues:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)
