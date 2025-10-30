"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { Button, Card, Input, Label, useToast } from "@/components/ui";
import { resetPassword } from "@/app/actions/auth-actions";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import { ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const validation = forgotPasswordSchema.safeParse({ email });

    if (!validation.success) {
      const fieldErrors: { email?: string } = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as "email"] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email);

      if (!result.success) {
        toast({
          title: "Request failed",
          description: result.error || "An unexpected error occurred",
          variant: "error",
        });
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      toast({
        title: "Email sent",
        description: result.message || "Password reset email sent successfully",
        variant: "success",
      });
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Request failed",
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
          <div className="mb-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-15 text-text-secondary hover:text-text-primary transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
            <h1 className="text-32 font-semibold mb-2 text-text-primary">
              Forgot password?
            </h1>
            <p className="text-15 text-text-secondary">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {emailSent ? (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                <p className="text-15 text-text-primary">
                  Password reset email sent! Please check your inbox and follow
                  the instructions to reset your password.
                </p>
              </div>
              <Button
                variant="ghost"
                size="lg"
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Send again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
