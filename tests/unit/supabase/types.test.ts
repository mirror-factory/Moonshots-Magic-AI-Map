/**
 * @module tests/unit/supabase/types
 * Validates the generated Supabase database types match the expected schema.
 */

import type { Database, Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/types";

describe("Supabase database types", () => {
  describe("Database schema structure", () => {
    it("has a public schema with Tables", () => {
      type PublicSchema = Database["public"];
      type TableNames = keyof PublicSchema["Tables"];

      const expectedTables: TableNames[] = [
        "profiles",
        "events",
        "user_interactions",
        "chat_sessions",
      ];

      // Type-level check — if this compiles, the tables exist
      expect(expectedTables).toHaveLength(4);
    });
  });

  describe("profiles table types", () => {
    it("Row type has all expected fields", () => {
      type ProfileRow = Tables<"profiles">;
      const _check: ProfileRow = {
        id: "uuid",
        user_id: "uuid",
        name: "Test User",
        categories: ["music", "food"],
        vibes: ["chill"],
        price_range: "moderate",
        preferred_days: ["weekend"],
        preferred_times: ["evening"],
        travel_radius: 25,
        has_kids: false,
        has_pets: false,
        goals: ["Discover events"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      expect(_check.user_id).toBe("uuid");
    });

    it("Insert type requires user_id", () => {
      type ProfileInsert = TablesInsert<"profiles">;
      const _check: ProfileInsert = { user_id: "required" };
      expect(_check.user_id).toBe("required");
    });

    it("Update type has all fields optional", () => {
      type ProfileUpdate = TablesUpdate<"profiles">;
      const _check: ProfileUpdate = {};
      expect(_check).toEqual({});
    });
  });

  describe("events table types", () => {
    it("Row type has all expected fields", () => {
      type EventRow = Tables<"events">;
      const _check: EventRow = {
        id: "uuid",
        title: "Jazz in the Park",
        description: "Live jazz",
        category: "music",
        subcategory: null,
        coordinates: [-81.37, 28.54],
        venue: "Lake Eola",
        address: "512 E Washington St",
        city: "Orlando",
        region: "Central Florida",
        start_date: "2026-06-20T19:00:00Z",
        end_date: null,
        all_day: false,
        timezone: "America/New_York",
        price_min: null,
        price_max: null,
        price_currency: null,
        is_free: true,
        url: null,
        image_url: null,
        tags: ["jazz", "live-music"],
        source_type: "manual",
        source_id: null,
        status: "active",
        featured: false,
        expires_at: null,
        fts: null as unknown,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      expect(_check.title).toBe("Jazz in the Park");
    });

    it("Insert type requires title, venue, category, coordinates, start_date", () => {
      type EventInsert = TablesInsert<"events">;
      const _check: EventInsert = {
        title: "Test Event",
        venue: "Test Venue",
        category: "music",
        coordinates: [-81.37, 28.54],
        start_date: "2026-06-20T19:00:00Z",
      };
      expect(_check.title).toBe("Test Event");
    });
  });

  describe("user_interactions table types", () => {
    it("Row type has all expected fields", () => {
      type InteractionRow = Tables<"user_interactions">;
      const _check: InteractionRow = {
        id: "uuid",
        user_id: "uuid",
        event_id: "evt-001",
        interaction_type: "liked",
        created_at: "2026-01-01T00:00:00Z",
      };
      expect(_check.interaction_type).toBe("liked");
    });

    it("Insert type requires user_id, event_id, interaction_type", () => {
      type InteractionInsert = TablesInsert<"user_interactions">;
      const _check: InteractionInsert = {
        user_id: "uuid",
        event_id: "evt-001",
        interaction_type: "liked",
      };
      expect(_check.event_id).toBe("evt-001");
    });
  });

  describe("chat_sessions table types", () => {
    it("Row type has all expected fields", () => {
      type ChatRow = Tables<"chat_sessions">;
      const _check: ChatRow = {
        id: "uuid",
        user_id: "uuid",
        title: "Event search",
        messages: [],
        ambient_context: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      };
      expect(_check.title).toBe("Event search");
    });

    it("Insert type requires user_id", () => {
      type ChatInsert = TablesInsert<"chat_sessions">;
      const _check: ChatInsert = { user_id: "uuid" };
      expect(_check.user_id).toBe("uuid");
    });
  });
});
