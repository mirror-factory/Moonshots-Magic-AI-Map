/**
 * @module lib/supabase/server
 * Server-side Supabase client factory. Uses `createServerClient` from
 * `@supabase/ssr` with Next.js cookie handling for authenticated
 * server-side operations in Route Handlers and Server Components.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

/**
 * Creates a Supabase client for use in server contexts (Route Handlers,
 * Server Components, Server Actions). Automatically reads and writes
 * auth cookies via Next.js `cookies()`.
 *
 * @returns A typed Supabase server client instance.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll is called from Server Components where cookies
            // can't be set — this is expected and safe to ignore.
          }
        },
      },
    },
  );
}
