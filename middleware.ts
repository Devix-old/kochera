import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    // Check if Supabase environment variables are set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    // If Supabase is not configured, skip middleware and continue
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.next();
    }

    const { supabase, supabaseResponse } = createClient(request);

    // If Supabase client creation failed, continue with the request
    if (!supabase) {
      return NextResponse.next();
    }

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    // Wrap in try-catch to handle any Supabase errors gracefully
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If user is not logged in and trying to access a protected route,
      // you can redirect them here. For now, we'll just refresh the session.

      return supabaseResponse;
    } catch (authError) {
      // If auth check fails, continue with the request anyway
      // This prevents the entire app from breaking if Supabase is temporarily unavailable
      return supabaseResponse || NextResponse.next();
    }
  } catch (error) {
    // If anything fails in middleware, continue with the request
    // This ensures the app doesn't break if Supabase is unavailable
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

