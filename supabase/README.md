# Supabase Setup Guide

This guide covers setting up Supabase for local development and production deployment.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- [Docker](https://docs.docker.com/get-docker/) installed (for local development)

## Local Development Setup

### 1. Install Supabase CLI

```bash
# macOS/Linux
brew install supabase/tap/supabase

# Windows (with Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or use npm
npm install -g supabase
```

### 2. Initialize Supabase (if starting fresh)

```bash
# This will create the supabase/ directory structure
supabase init
```

The project already includes the `supabase/` directory with migrations and configuration.

### 3. Start Local Supabase

```bash
# Start local Supabase (requires Docker)
supabase start
```

This will start:

- PostgreSQL database on `localhost:54322`
- API server on `localhost:54321`
- Studio (web UI) on `localhost:54323`
- Inbucket (email testing) on `localhost:54324`

After starting, you'll see output with credentials:

```
API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
anon key: eyJh...
service_role key: eyJh...
```

### 4. Configure Environment Variables

Copy the `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update with your local Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJh...your-local-service-role-key
```

### 5. Run Migrations

Migrations are automatically applied when you run `supabase start`. To manually apply or reset:

```bash
# Apply all migrations
supabase db reset

# Create a new migration
supabase migration new your_migration_name

# View migration status
supabase migration list
```

### 6. Access Supabase Studio

Open [http://localhost:54323](http://localhost:54323) to access the Supabase Studio web interface where you can:

- Browse tables and data
- Run SQL queries
- Manage storage buckets
- View API documentation
- Test RLS policies

## Production Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to provision

### 2. Link Local Project to Production

```bash
# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref
```

### 3. Push Migrations

```bash
# Push all migrations to production
supabase db push
```

### 4. Configure Production Environment Variables

In your production environment (Vercel, Netlify, etc.), set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
```

⚠️ **Important**: Keep the `SUPABASE_SERVICE_ROLE_KEY` secret! It bypasses Row Level Security.

### 5. Set Up Storage Bucket (if not auto-created)

The `pdf-uploads` bucket should be created by the migration. If you need to create it manually:

1. Go to Storage in Supabase Studio
2. Create a new bucket named `pdf-uploads`
3. Set as private (not public)
4. Set file size limit to 50MB
5. Allow only `application/pdf` mime type

### 6. Set Up Automated Cleanup (Optional)

To enforce the 30-day TTL for PDFs, set up a cron job or Edge Function:

#### Option A: Using pg_cron (if available)

```sql
SELECT cron.schedule(
  'cleanup-old-pdfs',
  '0 2 * * *', -- Run daily at 2 AM
  $$SELECT public.cleanup_old_pdfs()$$
);
```

#### Option B: Using Supabase Edge Function

Create an Edge Function that calls the cleanup function and schedule it with a cron service.

## Database Schema

### Tables

#### `profiles`

- Stores user profile information
- Automatically created when a user signs up
- One-to-one relationship with `auth.users`

#### `projects`

- Stores offer analysis projects
- Linked to users via `user_id`
- Contains project data as JSONB

### Storage

#### `pdf-uploads` Bucket

- Private bucket for PDF uploads
- Files organized by user ID: `{userId}/{fileName}`
- 50MB file size limit
- 30-day TTL (enforced by cleanup function)

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **User Policies**: Users can only access their own records
- **Service Role**: Service role can access all records (for background jobs)

## Database Access Patterns

### Client-Side (Browser)

```typescript
import { supabase } from "@/lib/supabase/client";

// RLS automatically enforces user access
const { data } = await supabase.from("projects").select("*");
```

### Server-Side (Server Actions, API Routes)

```typescript
import { createClient } from "@/lib/supabase/server";

export async function myServerAction() {
  const supabase = await createClient();

  // RLS enforces access based on authenticated user
  const { data } = await supabase.from("projects").select("*");
}
```

### Admin Operations (Background Jobs)

```typescript
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function adminTask() {
  const supabase = await createServiceRoleClient();

  // Bypasses RLS - use with caution!
  const { data } = await supabase.from("projects").select("*");
}
```

## Type Generation

Supabase types are manually defined in `types/supabase.ts`. To regenerate types from your schema:

```bash
# Generate types from local database
supabase gen types typescript --local > types/supabase.ts

# Generate types from production
supabase gen types typescript --project-ref your-project-ref > types/supabase.ts
```

## Troubleshooting

### Local Supabase won't start

```bash
# Stop all services
supabase stop

# Clean up Docker volumes
docker volume prune

# Start again
supabase start
```

### Migration errors

```bash
# Reset database and reapply all migrations
supabase db reset

# Check migration status
supabase migration list
```

### RLS policies not working

- Check that RLS is enabled on the table
- Verify the policy conditions
- Test policies in Supabase Studio's SQL editor
- Use `auth.uid()` to get the current user's ID

### Storage bucket issues

- Verify bucket exists in Storage
- Check RLS policies on `storage.objects`
- Ensure file paths follow the pattern: `{userId}/{fileName}`
- Verify file mime type matches allowed types

## Useful Commands

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > types/supabase.ts

# View logs
supabase logs

# Access psql
supabase db shell

# Create a new migration
supabase migration new migration_name

# Push migrations to production
supabase db push

# Pull production schema to local
supabase db pull
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
