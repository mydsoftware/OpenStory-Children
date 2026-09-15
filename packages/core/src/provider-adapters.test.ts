import { describe, expect, it, vi } from "vitest";
import { ComfyUIImageProvider, OllamaLLMProvider, OpenAICompatibleLLMProvider } from "./provider-adapters.js";

describe("local provider adapters", () => {
  it("parses structured Ollama output", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ message: { content: '{"title":"دینو"}' } }), { status: 200 })));
    const provider = new OllamaLLMProvider({ baseUrl: "http://localhost:11434", model: "test", timeoutMs: 1000 });
    await expect(provider.generateStructured({ prompt: "test", schema: { type: "object" } })).resolves.toEqual({ title: "دینو" });
    vi.unstubAllGlobals();
  });

  it("uses OpenAI-compatible JSON schema output", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: '{"ok":true}' } }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const provider = new OpenAICompatibleLLMProvider({ baseUrl: "http://localhost:1234/v1", model: "test" });
    await expect(provider.generateStructured({ prompt: "test", schema: { type: "object" } })).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it("requires a ComfyUI workflow", async () => {
    const provider = new ComfyUIImageProvider({ baseUrl: "http://localhost:8188" });
    await expect(provider.generate({ prompt: "test" })).rejects.toThrow("workflow is required");
  });
});
