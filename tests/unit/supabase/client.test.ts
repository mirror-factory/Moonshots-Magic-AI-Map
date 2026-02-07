/**
 * @module tests/unit/supabase/client
 * Tests for the browser-side Supabase client factory.
 */

import { vi, beforeEach, afterEach } from "vitest";

describe("createClient (browser)", () => {
  const MOCK_URL = "https://test.supabase.co";
  const MOCK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test";

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", MOCK_URL);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", MOCK_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns a Supabase client object", async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const client = createClient();
    expect(client).toBeDefined();
    expect(typeof client).toBe("object");
  });

  it("client has auth, from, and rpc methods", async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const client = createClient();
    expect(client.auth).toBeDefined();
    expect(typeof client.from).toBe("function");
    expect(typeof client.rpc).toBe("function");
  });

  it("client.from() returns a query builder for known tables", async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const client = createClient();
    const query = client.from("profiles");
    expect(query).toBeDefined();
    expect(typeof query.select).toBe("function");
    expect(typeof query.insert).toBe("function");
    expect(typeof query.update).toBe("function");
    expect(typeof query.delete).toBe("function");
  });
});
