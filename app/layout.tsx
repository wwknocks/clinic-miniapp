import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ToastProvider, UserDropdown } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import { ProfileService } from "@/db/profiles";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Next.js 14 Liquid Glass",
  description: "Next.js 14 with iOS-dark liquid-glass design system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    profile = await ProfileService.getByUserId(user.id);
  }

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy");

  return (
    <html lang="en" className="dark">
      <body className={inter.variable}>
        <MotionProvider>
          <ToastProvider>
            {user && profile && !isAuthPage && (
              <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-panel/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-end px-4">
                  <UserDropdown
                    user={{
                      email: profile.email,
                      full_name: profile.full_name,
                    }}
                  />
                </div>
              </header>
            )}
            {children}
          </ToastProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
