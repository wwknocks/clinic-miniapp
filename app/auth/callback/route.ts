import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      logger.error("Auth callback error", { error: error.message });
      return NextResponse.redirect(
        new URL("/login?error=auth_callback_error", requestUrl.origin)
      );
    }

    logger.info("Auth callback successful");
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
