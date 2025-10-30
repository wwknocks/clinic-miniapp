# Step 1 Input Forms Implementation

## Overview

This document describes the implementation of the Step 1 data collection UI with validation, file handling, and persistence for the Offer Wind Tunnel application.

## Features Implemented

### 1. Form Fields

- **Source Type Selection**: Radio group to choose between URL or PDF upload
- **URL Input**: Conditional text input for entering a sales page URL
- **PDF Upload**: Conditional file upload with drag & drop support
- **ICP Details**: Textarea for Ideal Customer Profile description
- **Price & Terms**: Textarea for pricing structure and payment terms
- **Proof Links**: Repeatable URL inputs for testimonials, case studies, etc.
- **Mechanism Description**: Textarea describing how the product/service works
- **Primary Objection**: Textarea for the main prospect concern/objection
- **Goal**: Textarea for the analysis goal

### 2. Validation

#### Client-Side Validation (Zod)
- Schema defined in `/lib/validation/input-schemas.ts`
- Real-time field validation on blur/change
- Inline error messages with icons
- Type-safe validation with TypeScript

#### Validation Rules
- Source type is required
- URL is required when source type is "url" (with URL format validation)
- PDF is required when source type is "pdf" (with file type and size validation)
- Optional fields have minimum length requirements when provided
- Proof links must be valid URLs

### 3. File Handling

#### PDF Upload
- Maximum file size: 50MB
- Allowed MIME type: `application/pdf`
- Organized by user ID in Supabase storage: `{userId}/{fileName}`
- Upload progress indicator
- File preview with remove option
- Automatic cleanup of old PDFs on replacement

#### Storage Structure
- Bucket name: `pdf-uploads`
- Path format: `{userId}/{timestamp}-{random}.pdf`
- Signed URLs with 30-day expiration
- Row Level Security (RLS) policies enforced

#### TTL Policy
- Database function: `cleanup_old_pdfs()`
- Automatically deletes files older than 30 days
- Should be scheduled via pg_cron or Supabase Edge Functions
- Function is already created in migration `20240101000002_create_storage.sql`

### 4. Auto-Save

- Debounced auto-save with 1-second delay
- Saves to Supabase `projects` table via Zustand store
- Visual "Saving..." indicator
- Non-blocking saves (optimistic UI)
- Syncs all form data to `projects.data` JSONB column

### 5. Analytics Tracking

Events tracked via PostHog:
- `project_created`: When a new project is initialized
- `pdf_uploaded`: When a PDF is successfully uploaded (includes file size)
- `inputs_completed`: When all required and optional fields are filled
  - Includes flags for each field type
  - Provides insights into completion rates

### 6. Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML structure
- Disabled states with visual feedback

### 7. UX/UI Features

- **Tooltips**: Helpful information icons next to field labels
- **Inline Help Text**: Additional context below inputs
- **Validation States**: Visual feedback for errors and success
- **Progress Indicators**: Upload progress bar and saving status
- **Responsive Layout**: Mobile-friendly card-based design
- **Dark Mode**: Liquid glass aesthetic with backdrop blur
- **Smooth Animations**: Framer Motion transitions

## File Structure

```
/app/actions/
  upload-actions.ts          # Server actions for PDF upload/delete

/components/stepper/
  StepInputsNew.tsx          # Main Step 1 component
  StepperContainer.tsx       # Updated to use new input component

/components/ui/
  RadioGroup.tsx             # New radio group component

/lib/validation/
  input-schemas.ts           # Zod validation schemas

/lib/hooks/
  useAutoSave.ts            # Custom hook for debounced auto-save

/lib/analytics.ts           # Updated with new events
/types/project.ts           # Updated with new data fields
```

## Data Structure

### ProjectData Interface (Updated)

```typescript
interface ProjectData {
  // Source type and content
  sourceType?: "url" | "pdf";
  url?: string;
  pdfId?: string;
  pdfPath?: string;
  pdfUrl?: string;
  
  // Analysis inputs
  icp?: string;
  priceTerms?: string;
  proofLinks?: string[];
  mechanism?: string;
  primaryObjection?: string;
  goal?: string;
  
  // ... other fields
}
```

## Server Actions

### uploadPDF(formData: FormData)
- Validates file type and size
- Uploads to Supabase storage
- Generates signed URL
- Returns file metadata

### deletePDF(pdfPath: string)
- Removes file from storage
- Called when replacing PDF or removing upload

### refreshSignedUrl(pdfPath: string)
- Regenerates signed URL for existing PDF
- Useful for expired URLs

## Validation Flow

1. User enters/changes field value
2. Debounced validation runs (on blur or after typing stops)
3. Error state updates in real-time
4. Inline error message displays if invalid
5. Next button enables/disables based on form validity
6. Auto-save triggers after 1 second if valid

## Form Submission Flow

1. User fills required fields (source type + URL/PDF)
2. Form validity checked in `isFormValid()`
3. Next button enabled when valid
4. Step validation in `StepperContainer` prevents navigation if invalid
5. Project data persisted to Supabase via Zustand store
6. Analytics event tracked when complete

## Testing Checklist

- [ ] URL source type with valid URL
- [ ] PDF source type with valid PDF file
- [ ] PDF file size validation (>50MB rejection)
- [ ] PDF file type validation (non-PDF rejection)
- [ ] Upload progress indicator
- [ ] PDF removal functionality
- [ ] All optional fields with validation
- [ ] Proof links add/remove functionality
- [ ] Auto-save behavior (1 second debounce)
- [ ] Form validation prevents Next button
- [ ] Tooltip and help text visibility
- [ ] Responsive layout on mobile
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Analytics events firing

## Future Enhancements

1. **Batch PDF Processing**: Support multiple PDFs
2. **OCR Integration**: Extract text from PDFs automatically
3. **URL Scraping**: Auto-fetch content from URLs
4. **Smart Defaults**: AI-powered field suggestions
5. **Draft Auto-Save**: Save incomplete forms as drafts
6. **Validation Improvements**: More granular validation rules
7. **Field Dependencies**: Conditional required fields
8. **Import/Export**: Save/load form templates

## Troubleshooting

### PDF Upload Fails
- Check Supabase storage bucket is created
- Verify RLS policies are in place
- Confirm file size < 50MB
- Ensure correct MIME type

### Auto-Save Not Working
- Check Supabase connection
- Verify project store initialization
- Check browser console for errors
- Confirm debounce timing

### Validation Not Showing
- Verify Zod schema is correct
- Check error state updates
- Ensure validation functions are called
- Debug with console logs

## Dependencies

- `zod`: ^4.1.12 - Schema validation
- `framer-motion`: ^12.23.24 - Animations
- `lucide-react`: ^0.548.0 - Icons
- `zustand`: ^5.0.8 - State management
- `@supabase/supabase-js`: ^2.78.0 - Supabase client

## Environment Variables

Required for full functionality:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Notes

- PDF signed URLs expire after 30 days (configurable)
- Auto-save delay is 1 second (configurable)
- Maximum file size is 50MB (configurable)
- Only PDF MIME type allowed (configurable)
- Form data stored in `projects.data` JSONB column
- All validations run client-side first, then server-side
