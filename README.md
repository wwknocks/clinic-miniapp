# Next.js 14 Liquid Glass Design System

A modern Next.js 14 application featuring an iOS-inspired liquid-glass design system with TypeScript and TailwindCSS.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Liquid Glass Design** - iOS-dark inspired aesthetic
- 🔷 **TypeScript** - Full type safety
- 💨 **TailwindCSS** - Custom design tokens
- 🎭 **Framer Motion** - Smooth animations
- 📦 **Component Library** - Pre-built UI components

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

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the design system showcase.

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
│   ├── page.tsx            # Demo page showcasing components
│   └── globals.css         # Global styles and Inter font
├── components/
│   ├── ui/                 # UI component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Label.tsx
│   └── providers/
│       └── motion-provider.tsx  # Framer Motion setup
├── lib/
│   └── utils.ts            # Utility functions (cn)
└── tailwind.config.ts      # Design tokens configuration
```

## Customization

### Tailwind Config
All design tokens are defined in `tailwind.config.ts`. Modify colors, typography, and other tokens there.

### Component Variants
Components use `class-variance-authority` for variant management. Extend variants in the component files.

## Technologies

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [class-variance-authority](https://cva.style/)
- [Inter Font](https://fonts.google.com/specimen/Inter)

## License

MIT
