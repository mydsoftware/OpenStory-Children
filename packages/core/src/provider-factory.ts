import { OllamaLLMProvider, OpenAICompatibleLLMProvider } from "./provider-adapters.js";
import { createOllamaConfig, createOpenAICompatibleConfig, type LLMProvider } from "./providers.js";

export function createLLMProviderFromEnv(env: Record<string, string | undefined> = process.env): LLMProvider | undefined {
  const kind = env.OPENSTORY_LLM_PROVIDER?.toLowerCase();
  if (kind === "ollama") return new OllamaLLMProvider(createOllamaConfig(env.OLLAMA_BASE_URL ?? "http://localhost:11434", env.OLLAMA_MODEL ?? "qwen2.5:7b"));
  if (kind === "lmstudio" || kind === "openai-compatible") return new OpenAICompatibleLLMProvider({ ...createOpenAICompatibleConfig(env.LMSTUDIO_BASE_URL ?? "http://localhost:1234/v1", env.LMSTUDIO_MODEL ?? "local-model"), apiKey: env.LMSTUDIO_API_KEY });
  return undefined;
}
