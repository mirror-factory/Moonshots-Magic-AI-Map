import { searchNewsletters } from "@/lib/agents/tools/search-newsletters";

describe("searchNewsletters tool", () => {
  it("has an execute function", () => {
    expect(typeof searchNewsletters.execute).toBe("function");
  });

  it("has a description", () => {
    expect(searchNewsletters.description).toBeDefined();
    expect(searchNewsletters.description.length).toBeGreaterThan(0);
  });

  it("has an inputSchema", () => {
    expect(searchNewsletters.inputSchema).toBeDefined();
  });

  describe("execute", () => {
    it("returns { count, newsletters } for a matching query", async () => {
      const result = await searchNewsletters.execute!({
        query: "orlando",
        limit: 5,
      });

      expect(result).toHaveProperty("count");
      expect(result).toHaveProperty("newsletters");
      expect(typeof result.count).toBe("number");
      expect(Array.isArray(result.newsletters)).toBe(true);
      expect(result.count).toBeGreaterThan(0);
      expect(result.newsletters.length).toBeGreaterThan(0);
    });

    it("count reflects total matches, not limited array length", async () => {
      const result = await searchNewsletters.execute!({
        query: "orlando",
        limit: 2,
      });

      // Total matches for "orlando" is 9 in the dataset
      expect(result.count).toBeGreaterThan(result.newsletters.length);
      expect(result.newsletters.length).toBeLessThanOrEqual(2);
    });

    it("limits newsletters array length", async () => {
      const result = await searchNewsletters.execute!({
        query: "orlando",
        limit: 3,
      });

      expect(result.newsletters.length).toBeLessThanOrEqual(3);
    });

    it("returns newsletters with expected shape", async () => {
      const result = await searchNewsletters.execute!({
        query: "orlando",
        limit: 5,
      });

      expect(result.newsletters.length).toBeGreaterThan(0);

      result.newsletters.forEach((newsletter) => {
        expect(newsletter).toHaveProperty("id");
        expect(newsletter).toHaveProperty("title");
        expect(newsletter).toHaveProperty("summary");
        expect(newsletter).toHaveProperty("category");
        expect(newsletter).toHaveProperty("source");
        expect(newsletter).toHaveProperty("publishedAt");
        expect(newsletter).toHaveProperty("tags");

        expect(typeof newsletter.id).toBe("string");
        expect(typeof newsletter.title).toBe("string");
        expect(typeof newsletter.summary).toBe("string");
        expect(typeof newsletter.category).toBe("string");
        expect(typeof newsletter.source).toBe("string");
        expect(typeof newsletter.publishedAt).toBe("string");
        expect(Array.isArray(newsletter.tags)).toBe(true);
      });
    });

    it("returns empty results for a non-matching query", async () => {
      const result = await searchNewsletters.execute!({
        query: "zzzznonexistentqueryzzzz",
        limit: 5,
      });

      expect(result.count).toBe(0);
      expect(result.newsletters).toEqual([]);
    });

    it("includes author field when present", async () => {
      const result = await searchNewsletters.execute!({
        query: "orlando",
        limit: 10,
      });

      // At least some newsletters should have an author
      const withAuthor = result.newsletters.filter(
        (n) => n.author !== undefined,
      );
      expect(withAuthor.length).toBeGreaterThan(0);
    });

    it("does not include full content in response (slim projection)", async () => {
      const result = await searchNewsletters.execute!({
        query: "orlando",
        limit: 5,
      });

      result.newsletters.forEach((newsletter) => {
        // The tool maps to a slim projection, no "content" field
        expect(newsletter).not.toHaveProperty("content");
      });
    });
  });

  describe("inputSchema validation", () => {
    it("accepts valid query and limit", () => {
      const result = searchNewsletters.inputSchema.safeParse({
        query: "food",
        limit: 3,
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing query", () => {
      const result = searchNewsletters.inputSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("uses default limit when not provided", () => {
      const result = searchNewsletters.inputSchema.safeParse({
        query: "events",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(5);
      }
    });

    it("rejects non-string query", () => {
      const result = searchNewsletters.inputSchema.safeParse({
        query: 123,
      });
      expect(result.success).toBe(false);
    });
  });
});
