import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createLLMProvider } from "@openstory/core";

type ProviderKind = "none" | "ollama" | "lmstudio";
type ProviderConfig = { provider: ProviderKind; baseUrl: string; model: string };
type ConfiguredLLM = { provider: "ollama" | "lmstudio"; baseUrl: string; model: string };

export const runtime = "nodejs";

const dataDir = process.env.OPENSTORY_DATA_DIR ?? ".openstory/books";
const configPath = path.join(path.dirname(dataDir), "providers.json");

const defaults = (): ProviderConfig => {
  const provider = (process.env.OPENSTORY_LLM_PROVIDER?.toLowerCase() ?? "none") as ProviderKind;
  return {
    provider: ["ollama", "lmstudio", "none"].includes(provider) ? provider : "none",
    baseUrl: provider === "lmstudio" ? (process.env.LMSTUDIO_BASE_URL ?? "http://localhost:1234/v1") : (process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"),
    model: provider === "lmstudio" ? (process.env.LMSTUDIO_MODEL ?? "local-model") : (process.env.OLLAMA_MODEL ?? "qwen2.5:7b")
  };
};

async function readConfig(): Promise<ProviderConfig> {
  try { return { ...defaults(), ...JSON.parse(await fs.readFile(configPath, "utf8")) }; }
  catch { return defaults(); }
}

export async function GET() {
  const config = await readConfig();
  if (config.provider === "none") return NextResponse.json({ config, provider: { id: "deterministic", name: "Deterministic fallback", local: true }, health: { healthy: true, status: "fallback", checkedAt: new Date().toISOString() } });
  try {
    const selection: ConfiguredLLM = { provider: config.provider, baseUrl: config.baseUrl, model: config.model };
    const provider = createLLMProvider(selection);
    const health = typeof (provider as { health?: () => Promise<unknown> }).health === "function"
      ? await (provider as typeof provider & { health: () => Promise<unknown> }).health()
      : { healthy: false, status: "unknown", error: "Provider does not expose a health check.", checkedAt: new Date().toISOString() };
    return NextResponse.json({ config, provider: provider.metadata, health });
  } catch (error) {
    return NextResponse.json({ config, provider: { id: config.provider, name: config.provider }, health: { healthy: false, status: "unknown", error: error instanceof Error ? error.message : String(error), checkedAt: new Date().toISOString() } });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<ProviderConfig>;
    const provider = body.provider;
    if (provider !== "none" && provider !== "ollama" && provider !== "lmstudio") throw new Error("Provider must be none, ollama or lmstudio.");
    const baseUrl = String(body.baseUrl ?? (provider === "lmstudio" ? "http://localhost:1234/v1" : "http://localhost:11434")).trim();
    if (!/^https?:\/\//i.test(baseUrl)) throw new Error("Provider base URL must use http or https.");
    const model = String(body.model ?? (provider === "ollama" ? "qwen2.5:7b" : "local-model")).trim();
    if (provider !== "none" && !model) throw new Error("Provider model is required.");
    const config: ProviderConfig = { provider, baseUrl: baseUrl.replace(/\/$/, ""), model };
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
    return NextResponse.json({ config, saved: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid provider configuration" }, { status: 400 });
  }
}
