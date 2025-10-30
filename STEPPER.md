# Stepper Scaffold Documentation

## Overview

The Offer Wind Tunnel application features a 4-step guided workflow for analyzing job offers. The stepper provides a seamless, accessible experience with state persistence and smooth animations.

## Architecture

### State Management

The stepper uses **Zustand** for centralized state management. The `useProjectStore` manages:

- Project metadata (ID, title, timestamps, status)
- Current step tracking
- Form data from all steps
- Loading and error states
- Navigation functions (next, previous, set step)

State is automatically synced to Supabase on changes, with graceful degradation if the backend is unavailable.

### Steps

#### 1. Inputs (`StepInputs.tsx`)
- Collects basic offer information
- Fields: Offer Title, Company Name, Offer Details
- Auto-saves on input change
- Validates required fields (future enhancement)

#### 2. Analyze (`StepAnalyze.tsx`)
- Triggers AI analysis of the offer
- Shows analysis progress
- Displays what will be analyzed
- Future: Integration with OpenAI API

#### 3. Results (`StepResults.tsx`)
- Displays analysis findings
- Organized into: Strengths, Concerns, Recommendations
- Uses color-coded badges and icons
- Future: Data visualization charts

#### 4. Exports (`StepExports.tsx`)
- Multiple export format options (PDF, PPTX, JSON)
- Share functionality
- Download management
- Future: Actual export generation with Puppeteer/PptxGenJS

## Components

### StepperContainer

Main container component that orchestrates the workflow:

**Features:**
- Header with hero copy and disclaimer
- Step indicator (using `Stepper` UI component)
- Content area with AnimatePresence for transitions
- Navigation controls (Previous/Next buttons)
- Sidebar with quick actions
- Focus management for accessibility

**Props:** None (uses store internally)

**Key Functions:**
- `renderStep()` - Renders current step component
- `initializeProject()` - Creates new project on mount
- Focus management on step changes

### Individual Step Components

Each step component:
- Receives no props (uses store)
- Implements `fadeInUp` animation variants
- Handles its own form state via store
- Follows consistent layout pattern

## Navigation

### Button States

- **Previous**: Disabled on step 1
- **Next**: Disabled on step 4, labeled "Complete" on last step
- Both buttons use appropriate variants and sizes

### Programmatic Navigation

```tsx
const { nextStep, previousStep, setCurrentStep } = useProjectStore();

// Go to next step
nextStep();

// Go to previous step
previousStep();

// Jump to specific step
setCurrentStep(3);
```

## Animations

All step transitions use Framer Motion:

- **Entry**: Fade in + slide up (20px)
- **Exit**: Implicit fade out via AnimatePresence
- **Duration**: 0.3s with easeOut timing
- **Respect**: `prefers-reduced-motion` via MotionProvider

### Animation Variants

```tsx
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};
```

## Accessibility

### Focus Management

- Content area receives focus on step change
- `tabIndex={-1}` allows programmatic focus
- `role="region"` and `aria-live="polite"` announce changes
- `aria-label` describes current step

### Keyboard Navigation

- Tab through interactive elements
- Enter/Space activate buttons
- Form inputs fully keyboard accessible

### Screen Readers

- Step changes announced via aria-live
- Descriptive labels on all controls
- Semantic HTML structure

## Data Persistence

### Local State

Project state persists in Zustand store during session.

### Supabase Sync

On every state change:
1. Update local store immediately (optimistic)
2. Attempt to save to Supabase `projects` table
3. Log warning if sync fails (non-blocking)

### Database Schema

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Analytics

Analytics events are tracked throughout the workflow:

- `project_created` - New project initialized
- `step_changed` - User navigates to different step
- `project_updated` - Data modified
- `analysis_started` - Analysis triggered
- `analysis_completed` - Analysis finished
- `export_downloaded` - Report exported

Implementation is ready for PostHog integration.

## Future Enhancements

### Short Term
- Form validation on Inputs step
- Disable Next button if required fields empty
- Real-time save indicator
- History/recent projects list

### Medium Term
- OpenAI integration for actual analysis
- Export generation (PDF, PPTX)
- Data visualization in Results
- Collaborative sharing

### Long Term
- Multi-user collaboration
- Version history
- Template library
- Comparison mode (multiple offers)

## Testing

### Unit Tests
- Test store actions (next, previous, updateData)
- Test individual step components
- Test navigation button states

### E2E Tests
- Complete workflow walkthrough
- Form data persistence
- Animation completion
- Accessibility audit

### Manual Testing Checklist
- [ ] Navigate through all steps
- [ ] Fill form and verify auto-save
- [ ] Refresh page and check persistence
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Test with reduced motion preference
- [ ] Verify analytics events fire

## Troubleshooting

### State not persisting
- Check Supabase credentials in `.env.local`
- Verify `projects` table exists
- Check browser console for errors

### Animations janky
- Ensure MotionProvider wraps app
- Check for layout shifts causing reflows
- Verify CSS transitions don't conflict

### Steps not rendering
- Check store initialization
- Verify step number is 1-4
- Ensure components are properly exported

## API Reference

### useProjectStore

```tsx
interface ProjectState {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  
  initializeProject: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  updateProject: (updates: Partial<Project>) => Promise<void>;
  updateProjectData: (data: Partial<ProjectData>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetProject: () => void;
}
```

### analytics

```tsx
analytics.stepChanged(stepNumber, stepName);
analytics.projectCreated(projectId);
analytics.projectUpdated(projectId, updates);
analytics.analysisStarted(projectId);
analytics.analysisCompleted(projectId, duration);
analytics.exportDownloaded(projectId, format);
```
