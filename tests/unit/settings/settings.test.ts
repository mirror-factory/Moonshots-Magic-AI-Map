import {
  getStoredModel,
  setStoredModel,
  getStoredApiKey,
  setStoredApiKey,
  clearStoredApiKey,
  maskApiKey,
  getModelById,
  AVAILABLE_MODELS,
  DEFAULT_MODEL,
} from "@/lib/settings";

describe("settings", () => {
  describe("getStoredModel / setStoredModel", () => {
    it("returns DEFAULT_MODEL when nothing stored", () => {
      expect(getStoredModel()).toBe(DEFAULT_MODEL);
    });

    it("roundtrips a stored model", () => {
      setStoredModel("openai/gpt-4o");
      expect(getStoredModel()).toBe("openai/gpt-4o");
    });

    it("returns DEFAULT_MODEL for invalid stored value", () => {
      localStorage.setItem("moonshots_selected_model", "nonexistent/model");
      expect(getStoredModel()).toBe(DEFAULT_MODEL);
    });
  });

  describe("getStoredApiKey / setStoredApiKey / clearStoredApiKey", () => {
    it("returns undefined when nothing stored", () => {
      expect(getStoredApiKey()).toBeUndefined();
    });

    it("roundtrips a stored API key", () => {
      setStoredApiKey("sk-test-1234567890abcdef");
      expect(getStoredApiKey()).toBe("sk-test-1234567890abcdef");
    });

    it("clearStoredApiKey removes key", () => {
      setStoredApiKey("sk-test-1234567890abcdef");
      expect(getStoredApiKey()).toBe("sk-test-1234567890abcdef");

      clearStoredApiKey();
      expect(getStoredApiKey()).toBeUndefined();
    });
  });

  describe("maskApiKey", () => {
    it("shows first 8 and last 4 chars for long keys", () => {
      const masked = maskApiKey("sk-1234567890abcdefghij");
      expect(masked).toBe("sk-12345...ghij");
    });

    it('returns "--------" for short keys (<=12 chars)', () => {
      const masked = maskApiKey("short-key");
      expect(masked).toBe("\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022");
    });
  });

  describe("getModelById", () => {
    it("returns model for valid ID", () => {
      const model = getModelById("openai/gpt-4o");
      expect(model).toBeDefined();
      expect(model!.name).toBe("GPT-4o");
      expect(model!.provider).toBe("OpenAI");
    });

    it("returns undefined for invalid ID", () => {
      const model = getModelById("nonexistent/model");
      expect(model).toBeUndefined();
    });
  });

  describe("AVAILABLE_MODELS", () => {
    it("has at least 1 entry", () => {
      expect(AVAILABLE_MODELS.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("DEFAULT_MODEL", () => {
    it("is in AVAILABLE_MODELS", () => {
      const ids = AVAILABLE_MODELS.map((m) => m.id);
      expect(ids).toContain(DEFAULT_MODEL);
    });
  });
});
