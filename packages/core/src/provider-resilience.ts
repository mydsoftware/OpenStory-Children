import type { ProviderHealth, RetryPolicy } from "./providers.js";

export async function withRetry<T>(operation: () => Promise<T>, policy: RetryPolicy): Promise<T> {
  const attempts = Math.max(1, Math.floor(policy.attempts));
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try { return await operation(); }
    catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      const delay = Math.max(0, policy.delayMs) * Math.pow(Math.max(1, policy.backoff), attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export async function checkHttpHealth(input: { url: string; timeoutMs?: number; fetchImpl?: typeof fetch }): Promise<ProviderHealth> {
  const started = Date.now();
  const checkedAt = new Date().toISOString();
  try {
    const response = await (input.fetchImpl ?? fetch)(input.url, { signal: AbortSignal.timeout(input.timeoutMs ?? 5000) });
    return { healthy: response.ok, status: response.ok ? "online" : "degraded", latencyMs: Date.now() - started, error: response.ok ? undefined : `HTTP ${response.status}`, checkedAt };
  } catch (error) {
    return { healthy: false, status: "offline", latencyMs: Date.now() - started, error: error instanceof Error ? error.message : String(error), checkedAt };
  }
}
