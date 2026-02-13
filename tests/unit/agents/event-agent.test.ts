import { createEventAgent } from "@/lib/agents/event-agent";

describe("createEventAgent", () => {
  const agent = createEventAgent("test-model");

  it("returns an object", () => {
    expect(agent).toBeDefined();
    expect(typeof agent).toBe("object");
  });

  it("has a settings property", () => {
    expect(agent.settings).toBeDefined();
    expect(typeof agent.settings).toBe("object");
  });

  it("has a tools getter", () => {
    expect(agent.tools).toBeDefined();
    expect(typeof agent.tools).toBe("object");
  });

  it("has version agent-v1", () => {
    expect(agent.version).toBe("agent-v1");
  });

  describe("tools", () => {
    const expectedToolNames = [
      "searchEvents",
      "getEventDetails",
      "rankEvents",
      "mapNavigate",
      "getUserProfile",
      "updateUserProfile",
      "startFlyover",
      "highlightEvents",
      "getDirectionsTool",
      "startPresentation",
      "changeEventFilter",
    ];

    it("contains all 11 expected tools", () => {
      const toolNames = Object.keys(agent.tools);
      expect(toolNames).toHaveLength(11);
      expectedToolNames.forEach((name) => {
        expect(toolNames).toContain(name);
      });
    });

    it.each(expectedToolNames)("includes the %s tool", (toolName) => {
      expect(agent.tools).toHaveProperty(toolName);
      expect(agent.tools[toolName]).toBeDefined();
    });

    it("each tool has a description", () => {
      Object.entries(agent.tools).forEach(([_name, toolDef]) => {
        expect(toolDef).toHaveProperty("description");
        expect(typeof toolDef.description).toBe("string");
        expect(toolDef.description.length).toBeGreaterThan(0);
      });
    });

    it("server-side tools have execute functions", () => {
      const serverTools = [
        "searchEvents",
        "getEventDetails",
        "rankEvents",
      ];
      serverTools.forEach((name) => {
        expect(typeof agent.tools[name].execute).toBe("function");
      });
    });

    it("client-side tools do NOT have execute functions", () => {
      const clientTools = [
        "mapNavigate",
        "getUserProfile",
        "updateUserProfile",
        "startFlyover",
        "highlightEvents",
        "getDirectionsTool",
        "startPresentation",
        "changeEventFilter",
      ];
      clientTools.forEach((name) => {
        expect(agent.tools[name].execute).toBeUndefined();
      });
    });
  });

  describe("instructions", () => {
    it("includes today's date", () => {
      const todayISO = new Date().toISOString().split("T")[0];
      expect(agent.settings.instructions).toContain(todayISO);
    });

    it('mentions "Ditto" as the AI name', () => {
      expect(agent.settings.instructions).toContain("Ditto");
    });

    it('mentions "Moonshots & Magic" brand', () => {
      expect(agent.settings.instructions).toContain("Moonshots & Magic");
    });

    it("includes guidance on clarifying questions", () => {
      expect(agent.settings.instructions).toContain("QUESTION:");
      expect(agent.settings.instructions).toContain("OPTIONS:");
    });

    it("includes personalization instructions", () => {
      expect(agent.settings.instructions).toContain("getUserProfile");
      expect(agent.settings.instructions).toContain("updateUserProfile");
    });

    it("includes flyover tour guidance", () => {
      expect(agent.settings.instructions).toContain("startFlyover");
    });
  });

  describe("stopWhen", () => {
    it("has a stopWhen setting", () => {
      expect(agent.settings.stopWhen).toBeDefined();
      expect(typeof agent.settings.stopWhen).toBe("function");
    });
  });

  describe("model", () => {
    it("stores the provided model in settings", () => {
      expect(agent.settings.model).toBe("test-model");
    });

    it("uses default model when no argument is provided", () => {
      const defaultAgent = createEventAgent();
      expect(defaultAgent).toBeDefined();
      expect(defaultAgent.tools).toBeDefined();
      expect(defaultAgent.settings.model).toBe("anthropic/claude-sonnet-4.5");
    });

    it("accepts a custom model string", () => {
      const customAgent = createEventAgent("openai/gpt-4o");
      expect(customAgent).toBeDefined();
      expect(customAgent.settings.model).toBe("openai/gpt-4o");
    });
  });
});
