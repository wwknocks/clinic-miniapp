# Vercel Deployment Guide

## Overview

This application has been configured to deploy successfully on Vercel even when environment variables are not fully configured. All external services (Supabase, OpenAI, PostHog) have graceful fallbacks to prevent build and runtime failures.

## Key Changes for Deployment Success

### 1. Environment Variable Handling

All critical environment variables now have safe fallbacks:

#### Supabase

- **Files Updated**: `middleware.ts`, `lib/supabase/server.ts`, `lib/supabase/client.ts`
- **Behavior**: If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing:
  - Middleware skips authentication checks (logs warning)
  - Client uses placeholder values with console warnings
  - Server components use placeholder values with console warnings
  - App remains functional for public pages

#### OpenAI

- **Files Updated**: `lib/llm/client.ts`
- **Behavior**: If `OPENAI_API_KEY` is missing:
  - Clear error message when LLM features are attempted
  - App builds successfully
  - Other features remain functional

### 2. TypeScript Fixes

Fixed type errors in `lib/scoring/parsers/pdf-parser.ts` to ensure clean compilation.

### 3. Module Import Fixes

Corrected pdf-parse module import to handle both CommonJS and ES module exports properly.

## Required Environment Variables for Full Functionality

Set these in Vercel dashboard under Project Settings > Environment Variables:

### Essential (for core features)

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Authentication & Admin Features

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### AI Features

```bash
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
OPENAI_ENDPOINT=https://api.openai.com/v1
```

### Analytics (Optional)

```bash
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Storage

```bash
NEXT_PUBLIC_STORAGE_BUCKET=pdf-uploads
```

### LLM Configuration (Optional - has defaults)

```bash
LLM_MAX_REQUESTS_PER_MINUTE=60
LLM_MAX_CONCURRENT_REQUESTS=5
LLM_MAX_TOKENS_PER_REQUEST=4000
LLM_MAX_PROMPT_TOKENS=12000
LLM_REQUEST_TIMEOUT=60000
LLM_RETRY_ATTEMPTS=3
LLM_RETRY_DELAY=1000
LLM_USE_MOCKS=false
LLM_LOG_USAGE=true
```

## Deployment Steps

1. **Push to Git Repository**

   ```bash
   git add .
   git commit -m "Fix Vercel deployment with env var fallbacks"
   git push
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables** (Optional but recommended)
   - Go to Project Settings > Environment Variables
   - Add the variables listed above
   - Deploy or redeploy to apply changes

4. **Verify Deployment**
   - Check build logs for any warnings
   - Visit the deployed URL
   - Confirm homepage loads without errors
   - Test authentication (if Supabase configured)
   - Test analysis features (if OpenAI configured)

## Troubleshooting

### Build Fails with TypeScript Errors

- Ensure you've committed all changes from this fix
- Check that `npm run build` succeeds locally
- Review build logs for specific error messages

### App Loads but Features Don't Work

- Check browser console for warning messages
- Verify environment variables are set correctly in Vercel
- Redeploy after adding environment variables

### Middleware/Authentication Issues

- Check server logs for "Supabase not configured" warning
- Verify Supabase environment variables are set
- Ensure variables are set for the correct environment (Production/Preview/Development)

### Console Warnings

If you see warnings like "Supabase environment variables are not set", this is expected behavior when environment variables are missing. The app will still function but with limited features.

## Local Development

For local development, copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

## Production Readiness Checklist

- [x] App builds successfully without environment variables
- [x] App runs without crashing when env vars are missing
- [x] Homepage is accessible without authentication
- [x] Middleware handles missing Supabase credentials gracefully
- [x] LLM client provides clear error messages when unconfigured
- [ ] All required environment variables set in Vercel (do this when ready)
- [ ] SSL/HTTPS configured (automatic with Vercel)
- [ ] Custom domain configured (optional)
- [ ] Analytics tracking verified (requires PostHog config)

## Notes

- The app will build and deploy even without any environment variables configured
- Missing environment variables will result in limited functionality with console warnings
- All external service integrations have fail-safe mechanisms
- Public pages (/, /terms, /privacy, /design-system) are always accessible
