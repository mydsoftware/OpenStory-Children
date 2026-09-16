import { OllamaLLMProvider, OpenAICompatibleLLMProvider } from "./provider-adapters.js";
import { createOllamaConfig, createOpenAICompatibleConfig, type LLMProvider } from "./providers.js";

export type LLMProviderSelection = {
  provider: "ollama" | "lmstudio";
  baseUrl: string;
  model: string;
  apiKey?: string;
};

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
