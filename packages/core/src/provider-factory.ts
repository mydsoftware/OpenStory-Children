import { ComfyUIImageProvider, OllamaLLMProvider, OpenAICompatibleLLMProvider } from "./provider-adapters.js";
import { createComfyUIConfig, createOllamaConfig, createOpenAICompatibleConfig, type ImageProvider, type LLMProvider } from "./providers.js";

export type LLMProviderSelection = { provider: "ollama" | "lmstudio"; baseUrl: string; model: string; apiKey?: string };

export function createLLMProvider(selection: LLMProviderSelection): LLMProvider {
  if (selection.provider === "ollama") return new OllamaLLMProvider(createOllamaConfig(selection.baseUrl, selection.model));
  return new OpenAICompatibleLLMProvider({ ...createOpenAICompatibleConfig(selection.baseUrl, selection.model), apiKey: selection.apiKey });
}

export function createLLMProviderFromEnv(env: Record<string, string | undefined> = process.env): LLMProvider | undefined {
  const kind = env.OPENSTORY_LLM_PROVIDER?.toLowerCase();
  if (kind === "ollama") return createLLMProvider({ provider: "ollama", baseUrl: env.OLLAMA_BASE_URL ?? "http://localhost:11434", model: env.OLLAMA_MODEL ?? "qwen2.5:7b" });
  if (kind === "lmstudio" || kind === "openai-compatible") return createLLMProvider({ provider: "lmstudio", baseUrl: env.LMSTUDIO_BASE_URL ?? "http://localhost:1234/v1", model: env.LMSTUDIO_MODEL ?? "local-model", apiKey: env.LMSTUDIO_API_KEY });
  return undefined;
}

export function createImageProviderFromEnv(env: Record<string, string | undefined> = process.env): ImageProvider | undefined {
  if (env.OPENSTORY_IMAGE_PROVIDER?.toLowerCase() !== "comfyui") return undefined;
  const rawWorkflow = env.COMFYUI_WORKFLOW_JSON;
  if (!rawWorkflow) return undefined;
  let workflow: Record<string, unknown>;
  try { workflow = JSON.parse(rawWorkflow); } catch { throw new Error("COMFYUI_WORKFLOW_JSON is not valid JSON."); }
  return new ComfyUIImageProvider({
    baseUrl: env.COMFYUI_BASE_URL ?? "http://localhost:8188",
    workflow,
    timeoutMs: Number(env.COMFYUI_TIMEOUT_MS ?? 180000),
    pollIntervalMs: Number(env.COMFYUI_POLL_INTERVAL_MS ?? 1000)
  });
}
