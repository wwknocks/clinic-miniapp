# Design System

Dark iOS liquid-glass design system built with Tailwind CSS, shadcn/ui, and Framer Motion.

## 🎨 Theme Tokens

### Colors

| Token            | Value                       | Usage                     |
| ---------------- | --------------------------- | ------------------------- |
| `bg`             | `#0B0F14`                   | Page background           |
| `panel`          | `#0F141B`                   | Card/panel backgrounds    |
| `glass`          | `rgba(255, 255, 255, 0.06)` | Glassmorphism overlays    |
| `accent`         | `#8AB4FF`                   | Primary actions, links    |
| `success`        | `#3DDC97`                   | Success states            |
| `warning`        | `#FFD166`                   | Warning states            |
| `danger`         | `#FF6B6B`                   | Error/destructive actions |
| `text-primary`   | `#E6EDF3`                   | Primary text              |
| `text-secondary` | `#9FB0C3`                   | Secondary text            |
| `text-tertiary`  | `#6B7886`                   | Tertiary text             |

### Typography Scale

- **40px** - Hero headings
- **32px** - Page titles
- **24px** - Section headings
- **18px** - Subtitles
- **15px** - Body text (default)
- **13px** - Small text
- **11px** - Captions, labels

Usage: `text-40`, `text-32`, `text-24`, `text-18`, `text-15`, `text-13`, `text-11`

### Spacing

Standard Tailwind spacing scale + custom tokens:

- `spacing-18` (4.5rem)
- `spacing-22` (5.5rem)

### Border Radius

- `rounded-2xl` (1rem) - Cards, panels
- `rounded-xl` (0.75rem) - Inputs, buttons
- `rounded-lg` - Small elements
- `rounded-full` - Pills, avatars

### Shadows

- `shadow-glass` - Standard glassmorphism shadow
- `shadow-glass-lg` - Enhanced glass shadow for elevated elements
- `shadow-glow` - Accent glow effect
- `shadow-glow-accent` - Accent color glow
- `shadow-glow-success` - Success color glow
- `shadow-glow-danger` - Danger color glow

### Backdrop Blur

- `backdrop-blur-xs` (4px)
- `backdrop-blur-sm` (8px)
- `backdrop-blur-md` (12px) - Default for glass elements
- `backdrop-blur-lg` (16px)
- `backdrop-blur-xl` (24px)

## 🧩 Components

### Button

**Variants**: `solid`, `accent`, `danger`, `ghost`  
**Sizes**: `sm`, `md`, `lg`

```tsx
import { Button } from "@/components/ui";

<Button variant="accent" size="md">
  Click me
</Button>;
```

### Card

Glassmorphism card component with header, content, footer sections.

**Variants**: `glass`, `solid`  
**Padding**: `none`, `sm`, `md`, `lg`

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";

<Card variant="glass">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>;
```

### Form Inputs

#### Input

```tsx
import { Input, Label } from "@/components/ui";

<Label>Email</Label>
<Input type="email" placeholder="Enter email" />
```

#### Select

```tsx
import { Select } from "@/components/ui";

<Select
  options={[
    { value: "1", label: "Option 1" },
    { value: "2", label: "Option 2" },
  ]}
  placeholder="Choose..."
  onValueChange={(value) => console.log(value)}
/>;
```

#### Textarea

```tsx
import { Textarea } from "@/components/ui";

<Textarea placeholder="Enter message..." rows={4} />;
```

### Badge

**Variants**: `default`, `accent`, `success`, `warning`, `danger`, `outline`

```tsx
import { Badge } from "@/components/ui";

<Badge variant="accent">New</Badge>;
```

### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>;
```

### Progress

**Variants**: `default`, `accent`, `success`, `warning`, `danger`

```tsx
import { Progress } from "@/components/ui";

<Progress value={75} max={100} showLabel />;
```

### MeterBar

Data visualization component for showing metrics.

**Variants**: `default`, `accent`, `success`, `warning`, `danger`  
**Sizes**: `sm`, `md`, `lg`

```tsx
import { MeterBar } from "@/components/ui";

<MeterBar label="CPU Usage" value={75} max={100} variant="accent" />;
```

### Stepper

Multi-step indicator component.

```tsx
import { Stepper } from "@/components/ui";

<Stepper
  steps={[
    { label: "Step 1", description: "Description" },
    { label: "Step 2", description: "Description" },
    { label: "Step 3", description: "Description" },
  ]}
  currentStep={2}
/>;
```

### Tooltip

**Sides**: `top`, `right`, `bottom`, `left`

```tsx
import { Tooltip } from "@/components/ui";

<Tooltip content="Tooltip text" side="top">
  <Button>Hover me</Button>
</Tooltip>;
```

### Dialog (Modal)

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui";

<Dialog>
  <DialogTrigger>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="ghost">Cancel</Button>
      <Button variant="accent">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

### Toast

Global toast notification system.

**Variants**: `default`, `success`, `error`, `warning`, `info`

```tsx
import { useToast } from "@/components/ui";

const { addToast } = useToast();

addToast({
  title: "Success!",
  description: "Action completed",
  variant: "success",
  duration: 3000,
});
```

### Skeleton

Loading placeholder component.

```tsx
import { Skeleton } from "@/components/ui";

<Skeleton className="h-12 w-full" />;
```

### CTA Banner

Call-to-action banner component.

**Variants**: `default`, `accent`, `success`, `gradient`

```tsx
import { CTABanner } from "@/components/ui";

<CTABanner
  title="Upgrade to Pro"
  description="Get access to premium features"
  variant="gradient"
  primaryAction={{
    label: "Upgrade Now",
    onClick: () => console.log("Upgrade"),
  }}
  secondaryAction={{
    label: "Learn More",
    onClick: () => console.log("Learn"),
  }}
  onClose={() => console.log("Closed")}
/>;
```

### Paywall Dialog

Pricing/paywall modal component.

```tsx
import { PaywallDialog } from "@/components/ui";

<PaywallDialog
  open={open}
  onOpenChange={setOpen}
  title="Upgrade to Premium"
  description="Choose the plan that's right for you"
  plans={[
    {
      name: "Pro",
      description: "Perfect for individuals",
      price: "$19",
      period: "/month",
      features: ["Feature 1", "Feature 2"],
      highlighted: true,
      badge: "Most Popular",
    },
  ]}
  onSelectPlan={(planName) => console.log(planName)}
/>;
```

## 🎭 Motion System

All animations respect `prefers-reduced-motion` for accessibility.

### Animation Variants

Located in `/lib/motion.ts`:

- **fadeInUp** - Fade in with upward motion
- **fadeIn** - Simple fade in
- **scaleIn** - Scale and fade in
- **slideInFromBottom** - Slide up from bottom (sheets)
- **slideInFromTop** - Slide down from top (toasts)
- **overlayVariants** - Backdrop/overlay animations
- **cardHover** - Interactive card hover states
- **progressVariants** - Animated progress bars
- **staggerChildren** - Stagger child animations
- **listItemVariants** - List item entrance

### Usage

```tsx
import { m } from "framer-motion";
import { fadeInUp, staggerChildren } from "@/lib/motion";

<m.div variants={staggerChildren} initial="hidden" animate="visible">
  <m.div variants={fadeInUp}>Child 1</m.div>
  <m.div variants={fadeInUp}>Child 2</m.div>
</m.div>;
```

## 🎨 Utility Classes

### Glass Effects

```tsx
className = "glass-panel"; // Standard glass panel
className = "glass-card"; // Glass card with hover effect
```

### Gradients

```tsx
className = "gradient-bg"; // Static gradient background
className = "animated-gradient"; // Animated gradient
```

### Scrollbars

```tsx
className = "scrollbar-thin"; // Styled thin scrollbars
```

### Focus Ring

```tsx
className = "focus-ring"; // Standard focus ring for accessibility
```

## 📱 Responsive Design

All components are mobile-first and responsive:

- Use standard Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Components adapt to container width
- Touch-friendly sizes on mobile

## ♿ Accessibility

- **Keyboard Navigation**: All interactive elements support keyboard navigation
- **Focus Indicators**: Visible focus rings on all focusable elements
- **ARIA Labels**: Proper ARIA labels on complex components
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Reduced Motion**: All animations respect `prefers-reduced-motion`
- **Screen Readers**: Semantic HTML and ARIA attributes

## 🎨 Preview Page

Visit `/design-system` in development to see all components and tokens in action.

```bash
npm run dev
# Navigate to http://localhost:3000/design-system
```

## 🛠️ Customization

### Extending Theme

Edit `tailwind.config.ts` to add custom tokens:

```ts
theme: {
  extend: {
    colors: {
      custom: "#123456",
    },
  },
}
```

### Custom Components

Create new components following the same patterns:

1. Use `forwardRef` for ref support
2. Accept `className` prop for customization
3. Use `cn()` utility for className merging
4. Support variants with `class-variance-authority`
5. Add Framer Motion for animations
6. Include proper TypeScript types

## 📦 Dependencies

- **tailwindcss** - Utility-first CSS
- **framer-motion** - Animation library
- **lucide-react** - Icon library
- **class-variance-authority** - Variant management
- **clsx** + **tailwind-merge** - ClassName utilities
