"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { m } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-24">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-40 font-bold">Liquid Glass Design System</h1>
          <p className="text-18 text-text-secondary">
            Next.js 14 with iOS-inspired liquid glass aesthetic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Welcome</CardTitle>
                <CardDescription>
                  Experience the iOS-dark liquid glass design
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
              </CardContent>
              <CardFooter className="gap-3">
                <Button variant="accent" className="flex-1">Sign In</Button>
                <Button variant="ghost">Cancel</Button>
              </CardFooter>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
                <CardDescription>
                  Explore the design system components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-13 text-text-secondary">Button Variants</p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="solid" size="sm">Solid</Button>
                      <Button variant="accent" size="sm">Accent</Button>
                      <Button variant="danger" size="sm">Danger</Button>
                      <Button variant="ghost" size="sm">Ghost</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-13 text-text-secondary">Button Sizes</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card variant="solid" padding="lg">
              <CardHeader>
                <CardTitle>Typography Scale</CardTitle>
                <CardDescription>
                  Inter font with custom size scale
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <p className="text-11">11px - Small text for captions</p>
                <p className="text-13">13px - Label and secondary text</p>
                <p className="text-15">15px - Body text and descriptions</p>
                <p className="text-18">18px - Emphasis and larger body</p>
                <p className="text-24">24px - Section headings</p>
                <p className="text-32">32px - Page headings</p>
                <p className="text-40">40px - Hero headings</p>
              </CardContent>
            </Card>
          </m.div>

          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 100, delay: 0.4 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Color Palette</CardTitle>
                <CardDescription>
                  Design tokens and color system
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <div className="h-20 rounded-xl bg-accent"></div>
                    <p className="text-13">Accent</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-xl bg-success"></div>
                    <p className="text-13">Success</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-xl bg-warning"></div>
                    <p className="text-13">Warning</p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-20 rounded-xl bg-danger"></div>
                    <p className="text-13">Danger</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </m.div>
        </div>
      </m.div>
    </main>
  );
}
