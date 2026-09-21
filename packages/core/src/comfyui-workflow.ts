import type { Page, Character } from "./schemas.js";

export interface ComfyUIWorkflowInput {
  prompt: string;
  negativePrompt: string;
  seed: number;
  width: number;
  height: number;
  steps: number;
  cfg: number;
  sampler: string;
  scheduler: string;
  checkpoint?: string;
  referenceImage?: string;
  ipAdapterWeight?: number;
}

type Workflow = Record<string, { class_type?: string; inputs?: Record<string, unknown> }>;

export function cloneWorkflow(workflow: Record<string, unknown>): Workflow {
  return JSON.parse(JSON.stringify(workflow)) as Workflow;
}

function setInput(node: { inputs?: Record<string, unknown> }, key: string, value: unknown) {
  if (node.inputs) node.inputs[key] = value;
}

export function mutateComfyUIWorkflow(source: Record<string, unknown>, input: ComfyUIWorkflowInput): Record<string, unknown> {
  const workflow = cloneWorkflow(source);
  for (const node of Object.values(workflow)) {
    const type = node.class_type ?? "";
    const values = node.inputs ?? {};
    if (type === "CLIPTextEncode") {
      const text = String(values.text ?? "");
      if (text.includes("{{NEGATIVE_PROMPT}}") || text.toLowerCase().includes("negative")) setInput(node, "text", input.negativePrompt);
      else if (text.includes("{{PROMPT}}") || text === "") setInput(node, "text", input.prompt);
    }
    if (type === "EmptyLatentImage") {
      setInput(node, "width", input.width); setInput(node, "height", input.height); setInput(node, "batch_size", 1);
    }
    if (type === "KSampler") {
      setInput(node, "seed", input.seed); setInput(node, "steps", input.steps); setInput(node, "cfg", input.cfg);
      setInput(node, "sampler_name", input.sampler); setInput(node, "scheduler", input.scheduler);
    }
    if (type === "CheckpointLoaderSimple" && input.checkpoint) setInput(node, "ckpt_name", input.checkpoint);
    if ((type === "IPAdapterApply" || type === "IPAdapterAdvanced") && input.ipAdapterWeight !== undefined) setInput(node, "weight", input.ipAdapterWeight);
    if (type === "LoadImage" && input.referenceImage) setInput(node, "image", input.referenceImage);
  }
  return workflow;
}

export function defaultImagePrompt(page: Page, characters: Character[], visualStyle = "cute children's storybook, soft cartoon illustration"): string {
  const identities = characters.map(c => `${c.name}: ${c.description}; appearance: ${c.visualTraits.join(", ")}`).join(" | ");
  return [visualStyle, identities, `Page ${page.pageNumber}: ${page.title}`, ...page.panels.map(p => p.narration)].filter(Boolean).join(". ");
}

export const DEFAULT_NEGATIVE_PROMPT = "deformed, extra limbs, extra fingers, bad anatomy, duplicate character, mutated face, text, watermark, logo, blurry, low quality, cropped, out of frame, scary, gore, violence";
