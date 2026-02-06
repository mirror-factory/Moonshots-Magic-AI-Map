import {
  getNewsletters,
  getNewsletterById,
  searchNewsletters,
  getRecentNewsletters,
} from "@/lib/registries/newsletters";

describe("newsletters registry", () => {
  // ------------------------------------------------------------------
  // getNewsletters
  // ------------------------------------------------------------------
  describe("getNewsletters", () => {
    it("returns all entries when called with no filters", () => {
      const entries = getNewsletters();
      expect(entries.length).toBe(10);
    });

    it("filters by text query across title, summary, content, and tags", () => {
      const entries = getNewsletters({ query: "orlando" });
      expect(entries.length).toBeGreaterThan(0);
      entries.forEach((e) => {
        const haystack = [e.title, e.summary, e.content, ...e.tags]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("orlando");
      });
    });

    it("query matching is case-insensitive", () => {
      const lower = getNewsletters({ query: "orlando" });
      const upper = getNewsletters({ query: "ORLANDO" });
      expect(lower).toEqual(upper);
    });

    it("filters by category", () => {
      const entries = getNewsletters({ category: "food" });
      expect(entries.length).toBeGreaterThan(0);
      expect(entries.every((e) => e.category === "food")).toBe(true);
    });

    it("caps results with limit", () => {
      const entries = getNewsletters({ limit: 3 });
      expect(entries).toHaveLength(3);
    });

    it("returns results sorted by publishedAt descending (newest first)", () => {
      const entries = getNewsletters();
      for (let i = 1; i < entries.length; i++) {
        const prev = new Date(entries[i - 1].publishedAt).getTime();
        const curr = new Date(entries[i].publishedAt).getTime();
        expect(curr).toBeLessThanOrEqual(prev);
      }
    });

    it("returns empty array when no entries match the query", () => {
      const entries = getNewsletters({ query: "zzzyyyxxx-no-match" });
      expect(entries).toHaveLength(0);
    });
  });

  // ------------------------------------------------------------------
  // getNewsletterById
  // ------------------------------------------------------------------
  describe("getNewsletterById", () => {
    it("returns an entry for a valid ID", () => {
      const all = getNewsletters();
      const target = all[0];
      const found = getNewsletterById(target.id);
      expect(found).toBeDefined();
      expect(found!.id).toBe(target.id);
      expect(found!.title).toBe(target.title);
    });

    it("returns undefined for an invalid ID", () => {
      const found = getNewsletterById("non-existent-id-12345");
      expect(found).toBeUndefined();
    });
  });

  // ------------------------------------------------------------------
  // searchNewsletters
  // ------------------------------------------------------------------
  describe("searchNewsletters", () => {
    it("returns entries matching the query", () => {
      const results = searchNewsletters("orlando");
      expect(results.length).toBeGreaterThan(0);
      results.forEach((e) => {
        const haystack = [e.title, e.summary, e.content, ...e.tags]
          .join(" ")
          .toLowerCase();
        expect(haystack).toContain("orlando");
      });
    });

    it("returns an empty array when nothing matches", () => {
      const results = searchNewsletters("zzzyyyxxx-no-match");
      expect(results).toHaveLength(0);
    });
  });

  // ------------------------------------------------------------------
  // getRecentNewsletters
  // ------------------------------------------------------------------
  describe("getRecentNewsletters", () => {
    it("returns the requested number of most recent entries", () => {
      const recent = getRecentNewsletters(3);
      expect(recent).toHaveLength(3);
    });

    it("entries are sorted by publishedAt descending", () => {
      const recent = getRecentNewsletters(5);
      for (let i = 1; i < recent.length; i++) {
        const prev = new Date(recent[i - 1].publishedAt).getTime();
        const curr = new Date(recent[i].publishedAt).getTime();
        expect(curr).toBeLessThanOrEqual(prev);
      }
    });

    it("defaults to 5 entries when no limit is provided", () => {
      const recent = getRecentNewsletters();
      expect(recent).toHaveLength(5);
    });

    it("the first entry is the most recently published", () => {
      const recent = getRecentNewsletters(1);
      const all = getNewsletters();
      // getNewsletters with no filter returns sorted by publishedAt desc
      expect(recent[0].id).toBe(all[0].id);
    });
  });
});
