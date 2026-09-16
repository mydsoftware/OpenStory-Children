import { beforeEach, describe, expect, it, vi } from "vitest";

describe("provider API integration", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.OPENSTORY_LLM_PROVIDER;
  });

  it("reports deterministic fallback health when no provider is configured", async () => {
    const { GET } = await import("../app/api/providers/route.js");
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.provider.id).toBe("deterministic");
    expect(body.health.healthy).toBe(true);
    expect(body.health.status).toBe("fallback");
  });

  it("rejects malformed provider URLs without writing configuration", async () => {
    const { POST } = await import("../app/api/providers/route.js");
    const response = await POST(new Request("http://localhost/api/providers", { method: "POST", body: JSON.stringify({ provider: "ollama", baseUrl: "not-a-url", model: "test" }), headers: { "content-type": "application/json" } }));
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.error).toContain("http or https");
  });

  it("returns structured offline health for a configured unavailable provider", async () => {
    process.env.OPENSTORY_LLM_PROVIDER = "ollama";
    process.env.OLLAMA_BASE_URL = "http://localhost:9";
    process.env.OLLAMA_MODEL = "test";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("connection refused")));
    const { GET } = await import("../app/api/providers/route.js");
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.health.healthy).toBe(false);
    expect(body.health.status).toBe("offline");
    expect(body.health.error).toContain("connection refused");
    vi.unstubAllGlobals();
  });
});
