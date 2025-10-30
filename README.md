# Offer Wind Tunnel

An AI-powered offer analysis tool featuring a 4-step guided workflow with an iOS-inspired liquid-glass design system.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Liquid Glass Design** - iOS-dark inspired aesthetic
- 🔷 **TypeScript** - Full type safety
- 💨 **TailwindCSS** - Custom design tokens
- 🎭 **Framer Motion** - Smooth animations
- 📦 **Component Library** - Pre-built UI components
- 🔄 **State Management** - Zustand for project state
- 💾 **Data Persistence** - Supabase integration
- 📊 **Multi-step Workflow** - Guided offer analysis process

## Design Tokens

### Colors
- **Background**: `#0B0F14` - Deep dark background
- **Panel**: `#0F141B` - Card/panel background
- **Glass**: `rgba(255, 255, 255, 0.06)` - Frosted glass effect
- **Text Primary**: `#E6EDF3` - High contrast text
- **Text Secondary**: `#9FB0C3` - Muted text
- **Accent**: `#8AB4FF` - Primary action color
- **Success**: `#3DDC97` - Success states
- **Warning**: `#FFD166` - Warning states
- **Danger**: `#FF6B6B` - Error/danger states

### Typography
- **Font**: Inter (400, 500, 600, 700)
- **Scale**: 11px, 13px, 15px, 18px, 24px, 32px, 40px

### Spacing & Borders
- **Card Radius**: `rounded-2xl` (1rem)
- **Input/Button Radius**: `rounded-xl` (0.75rem)
- **Shadow**: Custom glass shadow with inset highlight

## Components

### Button
```tsx
import { Button } from "@/components/ui/Button";

<Button variant="solid">Default</Button>
<Button variant="accent">Accent</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>
```

**Sizes**: `sm`, `md`, `lg`

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

**Variants**: `glass` (default), `solid`

### Input & Label
```tsx
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

## Stepper Workflow

The application features a 4-step guided workflow for offer analysis:

1. **Inputs** - Collect offer details (title, company, compensation, benefits)
2. **Analyze** - Run AI-powered analysis on the offer
3. **Results** - Review comprehensive findings and recommendations
4. **Exports** - Download reports in multiple formats (PDF, PPTX, JSON)

Each step includes:
- Smooth Framer Motion transitions
- Accessible focus management
- Progress tracking
- Auto-save to Supabase
- Analytics event tracking

## Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Add your Supabase credentials (optional for development):
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the offer analysis tool.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with dark mode
│   ├── page.tsx            # Main stepper container
│   └── globals.css         # Global styles and Inter font
├── components/
│   ├── stepper/            # Stepper workflow components
│   │   ├── StepperContainer.tsx  # Main container with navigation
│   │   ├── StepInputs.tsx        # Step 1: Offer details form
│   │   ├── StepAnalyze.tsx       # Step 2: Analysis trigger
│   │   ├── StepResults.tsx       # Step 3: Results display
│   │   └── StepExports.tsx       # Step 4: Export options
│   ├── ui/                 # UI component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Stepper.tsx
│   │   └── ...
│   └── providers/
│       └── motion-provider.tsx  # Framer Motion setup
├── lib/
│   ├── stores/
│   │   └── useProjectStore.ts  # Zustand project state
│   ├── supabase.ts        # Supabase client setup
│   ├── analytics.ts       # Analytics event tracking
│   ├── motion.ts          # Animation variants
│   └── utils.ts           # Utility functions
├── types/
│   └── project.ts         # TypeScript types
└── tailwind.config.ts     # Design tokens configuration
```

## Customization

### Tailwind Config
All design tokens are defined in `tailwind.config.ts`. Modify colors, typography, and other tokens there.

### Component Variants
Components use `class-variance-authority` for variant management. Extend variants in the component files.

## State Management

The application uses Zustand for client-side state management with the following features:

- **Project State**: Current project data, step tracking, and form inputs
- **Persistence**: Auto-save to Supabase on changes
- **Session Storage**: State persists within browser session
- **Error Handling**: Graceful degradation if Supabase is unavailable

### Usage Example

```tsx
import { useProjectStore } from "@/lib/stores/useProjectStore";

function MyComponent() {
  const { project, updateProjectData, nextStep } = useProjectStore();
  
  return (
    <input 
      value={project?.data.offerTitle || ""}
      onChange={(e) => updateProjectData({ offerTitle: e.target.value })}
    />
  );
}
```

## Technologies

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Supabase](https://supabase.com/)
- [class-variance-authority](https://cva.style/)
- [Inter Font](https://fonts.google.com/specimen/Inter)

## License

MIT
