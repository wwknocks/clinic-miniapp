# Offer Wind Tunnel

A modern Next.js 14 application featuring an iOS-inspired liquid-glass design system for analyzing and optimizing business offers.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Liquid Glass Design** - iOS-dark inspired aesthetic
- 🔷 **TypeScript** - Full type safety
- 💨 **TailwindCSS** - Custom design tokens
- 🎭 **Framer Motion** - Smooth animations
- 🔐 **Supabase** - Authentication, database, and storage
- 💳 **Stripe** - Payment processing
- 📊 **PostHog** - Product analytics
- 🤖 **OpenAI** - AI-powered analysis
- 📦 **shadcn/ui** - Accessible component library

## Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- A Stripe account (for payments)
- A PostHog account (for analytics)
- An OpenAI API key (for AI features)

## Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Copy the `.env.example` file to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

#### Supabase

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

#### Stripe

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook secret

#### PostHog

- `NEXT_PUBLIC_POSTHOG_KEY` - Your PostHog project key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host (default: https://app.posthog.com)

#### OpenAI

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_MODEL` - Model to use (default: gpt-4o-mini)
- `OPENAI_ENDPOINT` - OpenAI endpoint (default: https://api.openai.com/v1)

#### Storage

- `NEXT_PUBLIC_STORAGE_BUCKET` - Supabase storage bucket name

#### Application

- `NEXT_PUBLIC_APP_URL` - Your application URL (default: http://localhost:3000)

### 3. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build

Build the application for production:

```bash
npm run build
```

### 5. Start Production Server

```bash
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run Jest unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run Playwright E2E tests

## Project Structure

```
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── billing/                # Billing management
│   ├── terms/                  # Terms of Service
│   ├── privacy/                # Privacy Policy
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # UI component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Label.tsx
│   └── providers/
│       └── motion-provider.tsx # Framer Motion provider
├── lib/
│   └── utils.ts                # Utility functions
├── e2e/                        # Playwright E2E tests
├── __tests__/                  # Jest unit tests
├── .env.example                # Environment variables template
├── .prettierrc                 # Prettier configuration
├── jest.config.js              # Jest configuration
├── playwright.config.ts        # Playwright configuration
└── tailwind.config.ts          # Tailwind & design tokens
```

## Design System

### Colors

- **Background**: `#0B0F14` - Deep dark background
- **Panel**: `#0F141B` - Card/panel background
- **Glass**: `rgba(255, 255, 255, 0.06)` - Frosted glass effect
- **Text Primary**: `#E6EDF3` - High contrast text
- **Text Secondary**: `#9FB0C3` - Muted text
- **Text Tertiary**: `#6B7886` - De-emphasized text
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

**Variants**: `solid`, `accent`, `danger`, `ghost`  
**Sizes**: `sm`, `md`, `lg`

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content goes here</CardContent>
</Card>;
```

**Variants**: `glass` (default), `solid`

### Input & Label

```tsx
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>;
```

## Routes

- `/` - Home page with design system showcase
- `/login` - User login
- `/signup` - User registration
- `/billing` - Billing and subscription management
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy

## Code Quality

### Linting

ESLint is configured with Next.js and Prettier integration:

```bash
npm run lint
```

### Formatting

Prettier is configured for consistent code style:

```bash
npm run format
```

### Git Hooks

Husky and lint-staged are set up to run linting and formatting on pre-commit:

- Automatic code formatting
- ESLint checks
- Type checking

### Testing

#### Unit Tests (Jest)

```bash
npm test
npm run test:watch
```

#### E2E Tests (Playwright)

```bash
npm run test:e2e
```

## Technologies

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Supabase](https://supabase.com/) - Backend as a service
- [Stripe](https://stripe.com/) - Payment processing
- [PostHog](https://posthog.com/) - Product analytics
- [OpenAI](https://openai.com/) - AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Puppeteer](https://pptr.dev/) - Browser automation
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) - PowerPoint generation
- [Zod](https://zod.dev/) - Schema validation
- [date-fns](https://date-fns.org/) - Date utilities
- [Jest](https://jestjs.io/) - Unit testing
- [Playwright](https://playwright.dev/) - E2E testing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
