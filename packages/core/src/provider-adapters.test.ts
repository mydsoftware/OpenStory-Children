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

  it("uploads a reference and injects it into a ComfyUI workflow", async () => {\n    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {\n      const url = String(input);\n      if (url.endsWith("/ref.png")) return new Response(new Uint8Array([1,2,3]), { status: 200, headers: { "content-type": "image/png" } });\n      if (url.endsWith("/upload/image")) return new Response(JSON.stringify({ name: "reference.png", subfolder: "" }), { status: 200 });\n      if (url.endsWith("/prompt")) return new Response(JSON.stringify({ prompt_id: "p1" }), { status: 200 });\n      if (url.endsWith("/history/p1")) return new Response(JSON.stringify({ p1: { outputs: { "1": { images: [{ filename: "out.png", subfolder: "", type: "output" }] } } } }), { status: 200 });\n      throw new Error("unexpected URL " + url);\n    });\n    vi.stubGlobal("fetch", fetchMock);\n    const provider = new ComfyUIImageProvider({ baseUrl: "http://localhost:8188", workflow: { "1": { class_type: "CheckpointLoaderSimple", inputs: { ckpt_name: "base.safetensors" } }, "2": { class_type: "CLIPTextEncode", inputs: { text: "{{PROMPT}}" } }, "3": { class_type: "CLIPTextEncode", inputs: { text: "{{NEGATIVE_PROMPT}}" } }, "4": { class_type: "EmptyLatentImage", inputs: { width: 512, height: 512, batch_size: 1 } }, "5": { class_type: "LoadImage", inputs: { image: "old.png" } }, "6": { class_type: "KSampler", inputs: { model: ["1", 0], seed: 1, steps: 20, cfg: 7, sampler_name: "euler", scheduler: "normal" } } } });\n    const result = await provider.generate({ prompt: "dino", references: ["https://example.com/ref.png"], seed: 42 });\n    expect(result.url).toContain("out.png");\n    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8188/upload/image", expect.objectContaining({ method: "POST" }));\n    const promptCall = fetchMock.mock.calls.find(call => String(call[0]).endsWith("/prompt"));\n    expect(String(promptCall?.[1]?.body)).toContain("reference.png");\n    vi.unstubAllGlobals();\n  });\n\n  it("requires a ComfyUI workflow", async () => {
    const provider = new ComfyUIImageProvider({ baseUrl: "http://localhost:8188" });
    await expect(provider.generate({ prompt: "test" })).rejects.toThrow("workflow is required");
  });
});
