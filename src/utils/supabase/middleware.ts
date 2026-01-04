import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export const createClient = (request: NextRequest) => {
  // Validate environment variables
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                request.cookies.set(name, value)
              );
              supabaseResponse = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            } catch (cookieError) {
              // Silently handle cookie errors - continue with response
            }
          },
        },
      }
    );

    return { supabase, supabaseResponse };
  } catch (error) {
    // If Supabase client creation fails, return a basic response
    return { 
      supabase: null, 
      supabaseResponse: NextResponse.next() 
    };
  }
};

