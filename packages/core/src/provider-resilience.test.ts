import { describe, expect, it, vi } from "vitest";
import { checkHttpHealth, withRetry } from "./provider-resilience.js";
import { DEFAULT_RETRY_POLICY } from "./providers.js";

describe("provider resilience", () => {
  it("retries transient provider failures and succeeds", async () => {
    const operation = vi.fn().mockRejectedValueOnce(new Error("temporary network failure")).mockResolvedValue("ok");
    await expect(withRetry(operation, { ...DEFAULT_RETRY_POLICY, attempts: 2, delayMs: 0 })).resolves.toBe("ok");
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it("returns offline health for an unreachable endpoint", async () => {
    const health = await checkHttpHealth({ url: "http://provider.invalid", timeoutMs: 10, fetchImpl: vi.fn().mockRejectedValue(new Error("offline")) });
    expect(health.healthy).toBe(false);
    expect(health.status).toBe("offline");
    expect(health.error).toContain("offline");
  });

  it("returns degraded health for a non-2xx endpoint", async () => {
    const health = await checkHttpHealth({ url: "http://provider", fetchImpl: vi.fn().mockResolvedValue(new Response("bad", { status: 503 })) });
    expect(health.healthy).toBe(false);
    expect(health.status).toBe("degraded");
    expect(health.error).toBe("HTTP 503");
  });
});
