import type { ImageProvider, LLMProvider, ProviderHealth, ProviderMetadata, RetryPolicy } from "./providers.js";
import { DEFAULT_RETRY_POLICY } from "./providers.js";
import { checkHttpHealth, withRetry } from "./provider-resilience.js";

type OllamaConfig = { baseUrl: string; model: string; timeoutMs?: number; retry?: Partial<RetryPolicy> };
type OpenAIConfig = { baseUrl: string; model: string; timeoutMs?: number; apiKey?: string; retry?: Partial<RetryPolicy> };
type ComfyConfig = { baseUrl: string; workflow?: Record<string, unknown>; timeoutMs?: number; pollIntervalMs?: number; retry?: Partial<RetryPolicy> };

function timer(ms: number) { const controller = new AbortController(); const id = setTimeout(() => controller.abort(), ms); return { signal: controller.signal, clear: () => clearTimeout(id) }; }
async function readJson(response: Response): Promise<any> { const text = await response.text(); if (!response.ok) throw new Error(`Provider HTTP ${response.status}: ${text.slice(0, 500)}`); return JSON.parse(text); }
function parseJson(text: string): unknown { const value = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, ""); try { return JSON.parse(value); } catch { const start = value.indexOf("{"); const end = value.lastIndexOf("}"); if (start >= 0 && end > start) return JSON.parse(value.slice(start, end + 1)); throw new Error("LLM returned invalid JSON."); } }
function retryPolicy(value?: Partial<RetryPolicy>): RetryPolicy { return { ...DEFAULT_RETRY_POLICY, ...value }; }

export class OllamaLLMProvider implements LLMProvider {
  readonly metadata: ProviderMetadata;
  constructor(private readonly config: OllamaConfig) { this.metadata = { id: "ollama", name: "Ollama", model: config.model, local: true }; }
  async health(): Promise<ProviderHealth> { return checkHttpHealth({ url: `${this.config.baseUrl.replace(/\/$/, "")}/api/tags`, timeoutMs: 5000 }); }
  async generateStructured<T>(input: { prompt: string; schema: unknown }): Promise<T> {
    return withRetry(async () => { const t = timer(this.config.timeoutMs ?? 120000); try { const r = await fetch(`${this.config.baseUrl}/api/chat`, { method: "POST", signal: t.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({ model: this.config.model, stream: false, format: input.schema, messages: [{ role: "user", content: input.prompt }] }) }); const data = await readJson(r); return parseJson(data.message?.content ?? data.response) as T; } finally { t.clear(); } }, retryPolicy(this.config.retry));
  }
}

export class OpenAICompatibleLLMProvider implements LLMProvider {
  readonly metadata: ProviderMetadata;
  constructor(private readonly config: OpenAIConfig) { this.metadata = { id: "openai-compatible", name: "OpenAI-compatible", model: config.model, local: true }; }
  async health(): Promise<ProviderHealth> { return checkHttpHealth({ url: `${this.config.baseUrl.replace(/\/$/, "")}/models`, timeoutMs: 5000 }); }
  async generateStructured<T>(input: { prompt: string; schema: unknown }): Promise<T> {
    return withRetry(async () => { const t = timer(this.config.timeoutMs ?? 120000); try { const headers: Record<string, string> = { "content-type": "application/json" }; if (this.config.apiKey) headers.authorization = `Bearer ${this.config.apiKey}`; const r = await fetch(`${this.config.baseUrl}/chat/completions`, { method: "POST", signal: t.signal, headers, body: JSON.stringify({ model: this.config.model, messages: [{ role: "user", content: input.prompt }], response_format: { type: "json_schema", json_schema: { name: "openstory_output", strict: true, schema: input.schema } }, temperature: 0.2 }) }); const data = await readJson(r); return parseJson(data.choices?.[0]?.message?.content ?? "") as T; } finally { t.clear(); } }, retryPolicy(this.config.retry));
  }
}

export class ComfyUIImageProvider implements ImageProvider {
  readonly metadata: ProviderMetadata = { id: "comfyui", name: "ComfyUI", local: true };
  constructor(private readonly config: ComfyConfig) {}
  async health(): Promise<ProviderHealth> { return checkHttpHealth({ url: `${this.config.baseUrl.replace(/\/$/, "")}/system_stats`, timeoutMs: 5000 }); }
  async generate(input: { prompt: string; references?: string[] }): Promise<{ assetId: string; url: string }> {
    if (!this.config.workflow) throw new Error("ComfyUI workflow is required.");
    return withRetry(async () => { const t = timer(this.config.timeoutMs ?? 180000); try { const workflow = JSON.parse(JSON.stringify(this.config.workflow).replace(/\{\{PROMPT\}\}/g, input.prompt)); const submitted = await readJson(await fetch(`${this.config.baseUrl}/prompt`, { method: "POST", signal: t.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({ prompt: workflow }) })); if (!submitted.prompt_id) throw new Error("ComfyUI did not return prompt_id."); const deadline = Date.now() + (this.config.timeoutMs ?? 180000); while (Date.now() < deadline) { const history = await readJson(await fetch(`${this.config.baseUrl}/history/${submitted.prompt_id}`, { signal: t.signal })); for (const node of Object.values(history[submitted.prompt_id]?.outputs ?? {}) as any[]) { const image = Array.isArray(node?.images) ? node.images.find((x: any) => x?.filename) : undefined; if (image) return { assetId: `${submitted.prompt_id}:${image.filename}`, url: `${this.config.baseUrl}/view?filename=${encodeURIComponent(image.filename)}&subfolder=${encodeURIComponent(image.subfolder ?? "")}&type=${encodeURIComponent(image.type ?? "output")}` }; } await new Promise(resolve => setTimeout(resolve, this.config.pollIntervalMs ?? 1000)); } throw new Error("ComfyUI generation timed out."); } finally { t.clear(); } }, retryPolicy(this.config.retry));
  }
}
