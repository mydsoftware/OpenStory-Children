import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

type ProviderKind = "none" | "ollama" | "lmstudio";
type ProviderConfig = { provider: ProviderKind; baseUrl: string; model: string };

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
  if (config.provider === "none") return NextResponse.json({ config, healthy: true, status: "fallback" });
  try {
    const url = config.provider === "ollama" ? `${config.baseUrl.replace(/\/$/, "")}/api/tags` : `${config.baseUrl.replace(/\/$/, "")}/models`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return NextResponse.json({ config, healthy: response.ok, status: response.ok ? "online" : `http-${response.status}` });
  } catch (error) {
    return NextResponse.json({ config, healthy: false, status: error instanceof Error ? error.message : "offline" });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<ProviderConfig>;
    const provider = body.provider;
    if (provider !== "none" && provider !== "ollama" && provider !== "lmstudio") throw new Error("Provider must be none, ollama or lmstudio.");
    const config: ProviderConfig = {
      provider,
      baseUrl: String(body.baseUrl ?? (provider === "lmstudio" ? "http://localhost:1234/v1" : "http://localhost:11434")).replace(/\/$/, ""),
      model: String(body.model ?? (provider === "ollama" ? "qwen2.5:7b" : "local-model"))
    };
    await fs.mkdir(path.dirname(configPath), { recursive: true });
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
    return NextResponse.json({ config, saved: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid provider configuration" }, { status: 400 });
  }
}
