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

  it("uploads a reference and injects it into a ComfyUI workflow", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/ref.png")) return new Response(new Uint8Array([1,2,3]), { status: 200, headers: { "content-type": "image/png" } });
      if (url.endsWith("/upload/image")) return new Response(JSON.stringify({ name: "reference.png", subfolder: "" }), { status: 200 });
      if (url.endsWith("/prompt")) return new Response(JSON.stringify({ prompt_id: "p1" }), { status: 200 });
      if (url.endsWith("/history/p1")) return new Response(JSON.stringify({ p1: { outputs: { "1": { images: [{ filename: "out.png", subfolder: "", type: "output" }] } } } }), { status: 200 });
      throw new Error("unexpected URL " + url);
    });
    vi.stubGlobal("fetch", fetchMock);
    const provider = new ComfyUIImageProvider({ baseUrl: "http://localhost:8188", workflow: { "1": { class_type: "CheckpointLoaderSimple", inputs: { ckpt_name: "StorybookRedmond.safetensors" } }, "2": { class_type: "CLIPTextEncode", inputs: { text: "{{PROMPT}}" } }, "3": { class_type: "CLIPTextEncode", inputs: { text: "{{NEGATIVE_PROMPT}}" } }, "4": { class_type: "EmptyLatentImage", inputs: { width: 512, height: 512, batch_size: 1 } }, "5": { class_type: "LoadImage", inputs: { image: "old.png" } }, "6": { class_type: "CLIPVisionLoader", inputs: { clip_name: "CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors" } }, "7": { class_type: "IPAdapterModelLoader", inputs: { ipadapter_file: "ip-adapter-plus_sd15.safetensors" } }, "8": { class_type: "IPAdapterApply", inputs: { model: ["1", 0], ipadapter: ["7", 0], image: ["5", 0], clip_vision: ["6", 0], weight: 0.75, weight_type: "standard", start_at: 0, end_at: 1 } }, "9": { class_type: "KSampler", inputs: { model: ["8", 0], seed: 1, steps: 20, cfg: 7, sampler_name: "euler", scheduler: "normal" } } } });
    const result = await provider.generate({ prompt: "dino", references: ["https://example.com/ref.png"], seed: 42 });
    expect(result.url).toContain("out.png");
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8188/upload/image", expect.objectContaining({ method: "POST" }));
    const promptCall = fetchMock.mock.calls.find(call => String(call[0]).endsWith("/prompt"));
    expect(String(promptCall?.[1]?.body)).toContain("reference.png");
    vi.unstubAllGlobals();
  });

  it("requires a ComfyUI workflow", async () => {
    const provider = new ComfyUIImageProvider({ baseUrl: "http://localhost:8188" });
    await expect(provider.generate({ prompt: "test" })).rejects.toThrow("workflow is required");
  });
});
