"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  Button,
  Card,
  Input,
  Label,
  Checkbox,
  useToast,
} from "@/components/ui";
import { signUp } from "@/app/actions/auth-actions";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and privacy policy",
  }),
});

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    acceptTerms?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = signupSchema.safeParse({
      fullName,
      email,
      password,
      acceptTerms,
    });

    if (!validation.success) {
      const fieldErrors: {
        fullName?: string;
        email?: string;
        password?: string;
        acceptTerms?: string;
      } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[
            err.path[0] as "fullName" | "email" | "password" | "acceptTerms"
          ] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(email, password, fullName);

      if (!result.success) {
        addToast({
          title: "Signup failed",
          description: result.error || "An unexpected error occurred",
          variant: "error",
        });
        setIsLoading(false);
        return;
      }

      addToast({
        title: "Account created!",
        description:
          "Welcome to the platform. Please check your email to verify your account.",
        variant: "success",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      addToast({
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-bg via-bg to-panel">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-32 font-semibold mb-2 text-text-primary">
              Create an account
            </h1>
            <p className="text-15 text-text-secondary">
              Get started with your free account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                disabled={isLoading}
                required
              />
              {errors.fullName && (
                <p className="text-13 text-danger mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                disabled={isLoading}
                required
              />
              {errors.email && (
                <p className="text-13 text-danger mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
              {errors.password && (
                <p className="text-13 text-danger mt-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Checkbox
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
                label={
                  <span className="text-13 text-text-secondary">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      target="_blank"
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-accent hover:text-accent/80 transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
              />
              {errors.acceptTerms && (
                <p className="text-13 text-danger mt-1">{errors.acceptTerms}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-15 text-text-secondary">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent hover:text-accent/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
