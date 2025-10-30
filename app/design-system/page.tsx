"use client";

import * as React from "react";
import { m } from "framer-motion";
import { fadeInUp, staggerChildren } from "@/lib/motion";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Label,
  Select,
  Textarea,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
  Skeleton,
  Tooltip,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  useToast,
  Stepper,
  MeterBar,
  CTABanner,
  PaywallDialog,
} from "@/components/ui";
import { Sparkles } from "lucide-react";

export default function DesignSystemPage() {
  const { addToast } = useToast();
  const [progress, setProgress] = React.useState(45);
  const [paywallOpen, setPaywallOpen] = React.useState(false);

  const handleToast = (
    variant: "default" | "success" | "error" | "warning" | "info"
  ) => {
    addToast({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: "This is a test notification message",
      variant,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <m.div
        className="max-w-7xl mx-auto space-y-16"
        variants={staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <m.div variants={fadeInUp}>
          <h1 className="text-40 font-bold text-text-primary mb-4">
            Design System
          </h1>
          <p className="text-18 text-text-secondary">
            Dark iOS liquid-glass design system with Tailwind, shadcn/ui, and
            Framer Motion
          </p>
        </m.div>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">
            Theme Tokens
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-24 font-semibold text-text-primary mb-4">
                Colors
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-bg border border-white/10" />
                  <p className="text-13 text-text-secondary">Background</p>
                  <code className="text-11 text-accent">#0B0F14</code>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-panel border border-white/10" />
                  <p className="text-13 text-text-secondary">Panel</p>
                  <code className="text-11 text-accent">#0F141B</code>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-accent" />
                  <p className="text-13 text-text-secondary">Accent</p>
                  <code className="text-11 text-accent">#8AB4FF</code>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-success" />
                  <p className="text-13 text-text-secondary">Success</p>
                  <code className="text-11 text-accent">#3DDC97</code>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-warning" />
                  <p className="text-13 text-text-secondary">Warning</p>
                  <code className="text-11 text-accent">#FFD166</code>
                </div>
                <div className="space-y-2">
                  <div className="h-20 rounded-xl bg-danger" />
                  <p className="text-13 text-text-secondary">Danger</p>
                  <code className="text-11 text-accent">#FF6B6B</code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-24 font-semibold text-text-primary mb-4">
                Typography Scale
              </h3>
              <div className="space-y-4">
                <div className="text-40 text-text-primary">
                  40px - Hero Heading
                </div>
                <div className="text-32 text-text-primary">
                  32px - Page Title
                </div>
                <div className="text-24 text-text-primary">
                  24px - Section Heading
                </div>
                <div className="text-18 text-text-primary">18px - Subtitle</div>
                <div className="text-15 text-text-primary">
                  15px - Body Text
                </div>
                <div className="text-13 text-text-secondary">
                  13px - Small Text
                </div>
                <div className="text-11 text-text-tertiary">11px - Caption</div>
              </div>
            </div>
          </div>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Buttons</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="solid" size="sm">
                  Small Solid
                </Button>
                <Button variant="solid" size="md">
                  Medium Solid
                </Button>
                <Button variant="solid" size="lg">
                  Large Solid
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button variant="accent">Accent</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="solid" disabled>
                  Disabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Glass Card</CardTitle>
                <CardDescription>
                  A card with glassmorphism effect and backdrop blur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-15 text-text-secondary">
                  This card has a semi-transparent background with blur effect.
                </p>
              </CardContent>
            </Card>

            <Card variant="solid">
              <CardHeader>
                <CardTitle>Solid Card</CardTitle>
                <CardDescription>
                  A card with a solid background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-15 text-text-secondary">
                  This card has a solid panel background.
                </p>
              </CardContent>
            </Card>
          </div>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">
            Form Inputs
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter your email" />
              </div>

              <div className="space-y-2">
                <Label>Select</Label>
                <Select
                  options={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                    { value: "3", label: "Option 3" },
                  ]}
                  placeholder="Choose an option"
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Enter your message" />
              </div>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Badges</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="accent">Accent</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Tabs</h2>
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="tab1">
                <TabsList>
                  <TabsTrigger value="tab1">Overview</TabsTrigger>
                  <TabsTrigger value="tab2">Analytics</TabsTrigger>
                  <TabsTrigger value="tab3">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">
                  <p className="text-15 text-text-secondary">
                    Overview content goes here
                  </p>
                </TabsContent>
                <TabsContent value="tab2">
                  <p className="text-15 text-text-secondary">
                    Analytics content goes here
                  </p>
                </TabsContent>
                <TabsContent value="tab3">
                  <p className="text-15 text-text-secondary">
                    Settings content goes here
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">
            Progress & Meters
          </h2>
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-15 text-text-primary mb-4">Progress Bar</p>
                <Progress value={progress} showLabel />
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => setProgress(Math.max(0, progress - 10))}
                  >
                    Decrease
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setProgress(Math.min(100, progress + 10))}
                  >
                    Increase
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-15 text-text-primary mb-4">Meter Bars</p>
                <div className="space-y-4">
                  <MeterBar label="CPU Usage" value={75} variant="accent" />
                  <MeterBar
                    label="Memory"
                    value={60}
                    max={100}
                    variant="success"
                  />
                  <MeterBar
                    label="Storage"
                    value={85}
                    max={100}
                    variant="warning"
                  />
                  <MeterBar
                    label="Network"
                    value={95}
                    max={100}
                    variant="danger"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Stepper</h2>
          <Card>
            <CardContent className="pt-6">
              <Stepper
                steps={[
                  { label: "Account", description: "Create account" },
                  { label: "Profile", description: "Setup profile" },
                  { label: "Preferences", description: "Choose settings" },
                  { label: "Complete", description: "All done!" },
                ]}
                currentStep={2}
              />
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Tooltips</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Tooltip content="Top tooltip" side="top">
                  <Button variant="solid">Hover me (Top)</Button>
                </Tooltip>
                <Tooltip content="Right tooltip" side="right">
                  <Button variant="solid">Hover me (Right)</Button>
                </Tooltip>
                <Tooltip content="Bottom tooltip" side="bottom">
                  <Button variant="solid">Hover me (Bottom)</Button>
                </Tooltip>
                <Tooltip content="Left tooltip" side="left">
                  <Button variant="solid">Hover me (Left)</Button>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Toasts</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => handleToast("default")}>
                  Default Toast
                </Button>
                <Button onClick={() => handleToast("success")}>
                  Success Toast
                </Button>
                <Button onClick={() => handleToast("error")}>
                  Error Toast
                </Button>
                <Button onClick={() => handleToast("warning")}>
                  Warning Toast
                </Button>
                <Button onClick={() => handleToast("info")}>Info Toast</Button>
              </div>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">Dialogs</h2>
          <Card>
            <CardContent className="pt-6">
              <Dialog>
                <DialogTrigger>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to proceed with this action?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="accent">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">
            Skeleton Loading
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">
            CTA Banner
          </h2>
          <CTABanner
            title="Upgrade to Pro"
            description="Get access to premium features and unlock your full potential"
            primaryAction={{
              label: "Upgrade Now",
              onClick: () => setPaywallOpen(true),
            }}
            secondaryAction={{
              label: "Learn More",
              onClick: () => console.log("Learn more"),
            }}
            variant="gradient"
          />
        </m.section>

        <m.section variants={fadeInUp}>
          <h2 className="text-32 font-bold text-text-primary mb-6">
            Paywall Dialog
          </h2>
          <Card>
            <CardContent className="pt-6">
              <Button onClick={() => setPaywallOpen(true)}>Show Paywall</Button>
            </CardContent>
          </Card>
        </m.section>

        <PaywallDialog
          open={paywallOpen}
          onOpenChange={setPaywallOpen}
          plans={[
            {
              name: "Pro",
              description: "Perfect for individuals",
              price: "$19",
              period: "/month",
              features: [
                "Unlimited projects",
                "Advanced analytics",
                "Priority support",
                "Custom domain",
              ],
              highlighted: true,
              badge: "Most Popular",
            },
            {
              name: "Enterprise",
              description: "For large teams",
              price: "$99",
              period: "/month",
              features: [
                "Everything in Pro",
                "Dedicated account manager",
                "Custom integrations",
                "SLA guarantee",
                "Advanced security",
              ],
            },
          ]}
          onSelectPlan={(planName) => {
            console.log("Selected plan:", planName);
            setPaywallOpen(false);
            addToast({
              title: "Plan Selected",
              description: `You selected the ${planName} plan`,
              variant: "success",
            });
          }}
        />

        <m.div variants={fadeInUp} className="pb-12">
          <Card variant="glass" className="p-8 text-center">
            <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-24 font-semibold text-text-primary mb-2">
              Design System Complete
            </h3>
            <p className="text-15 text-text-secondary">
              All components are accessible, responsive, and support
              prefers-reduced-motion
            </p>
          </Card>
        </m.div>
      </m.div>
    </div>
  );
}
