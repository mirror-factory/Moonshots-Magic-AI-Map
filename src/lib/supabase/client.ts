/**
 * @module lib/supabase/client
 * Browser-side Supabase client singleton. Uses `createBrowserClient` from
 * `@supabase/ssr` for cookie-based auth in Next.js App Router.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Creates a Supabase client for use in browser/client components.
 * Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 * from the environment.
 *
 * @returns A typed Supabase browser client instance.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
