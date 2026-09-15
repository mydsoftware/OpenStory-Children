export interface ProviderMetadata { id: string; name: string; model?: string; local?: boolean; }
export interface LLMProvider { metadata: ProviderMetadata; generateStructured<T>(input: { prompt: string; schema: unknown }): Promise<T>; }
export interface ImageProvider { metadata: ProviderMetadata; generate(input: { prompt: string; references?: string[] }): Promise<{ assetId: string; url: string }>; }
export interface ProviderRegistry { llm?: LLMProvider; image?: ImageProvider; }

export class DeterministicLLMProvider implements LLMProvider {
  metadata = { id: "deterministic", name: "Deterministic fallback", local: true };
  async generateStructured<T>(): Promise<T> { throw new Error("No LLM configured. Use the deterministic story engine or configure an LLM provider."); }
}

export function createOllamaConfig(baseUrl = "http://localhost:11434", model = "qwen2.5:7b") {
  return { kind: "ollama" as const, baseUrl: baseUrl.replace(/\/$/, ""), model };
}

export function createOpenAICompatibleConfig(baseUrl = "http://localhost:1234/v1", model = "local-model") {
  return { kind: "openai-compatible" as const, baseUrl: baseUrl.replace(/\/$/, ""), model };
}

export function createComfyUIConfig(baseUrl = "http://localhost:8188") {
  return { kind: "comfyui" as const, baseUrl: baseUrl.replace(/\/$/, "") };
}
