# Local AI — Windows + SD 1.5 + ComfyUI

OpenStory Children is local-first. The V1 image pipeline uses **ComfyUI + Stable Diffusion 1.5 + IPAdapter Plus** and does not require a cloud API.

## Target hardware

The workflow is intentionally conservative for an NVIDIA GPU with about 6 GB VRAM, including GTX 1660 Ti 6 GB:

- 512×512
- batch 1
- 20–25 steps (default 22)
- CFG 6.5
- DPM++ 2M
- Karras
- IPAdapter weight 0.75

Do not add FLUX, SDXL-heavy, Qwen Image, Wan or HunyuanVideo to this V1 workflow.

## ComfyUI

Run ComfyUI locally at:

`http://127.0.0.1:8188`

The project workflow is committed at:

`workflows/comfyui/storybook-ipadapter-sd15.json`

It is an API-format workflow, not a UI export. It contains:

`CheckpointLoaderSimple → CLIP Text Encode → IPAdapter Plus → KSampler → VAEDecode → SaveImage`

and a reference branch:

`LoadImage → CLIP Vision → IPAdapter Plus`

### Required ComfyUI models/nodes

Install the **ComfyUI_IPAdapter_plus** custom node and the following model files:

- SD 1.5 checkpoint: `StorybookRedmond.safetensors` in `models/checkpoints/`
- IPAdapter Plus SD15: `ip-adapter-plus_sd15.safetensors` in `models/ipadapter/`
- CLIP Vision ViT-H: `CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors` in `models/clip_vision/`

The workflow now references these exact filenames. The IPAdapter Plus project documents `ip-adapter-plus_sd15.safetensors` as the SD15 Plus model and the ViT-H encoder as its matching image encoder. citeturn0search3turn0search4

Do not commit model binaries to this repository.

Expected local layout:

```text
D:\AI\ComfyUI\
├── models\
│   ├── checkpoints\
│   │   └── StorybookRedmond.safetensors
│   ├── clip_vision\
│   │   └── CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors
│   └── ipadapter\
│       └── ip-adapter-plus_sd15.safetensors
└── custom_nodes\
    └── ComfyUI_IPAdapter_plus\
```

## OpenStory configuration

Copy `.env.example` to your local environment and use:

```text
OPENSTORY_IMAGE_PROVIDER=comfyui
COMFYUI_BASE_URL=http://localhost:8188
COMFYUI_TIMEOUT_MS=300000
COMFYUI_POLL_INTERVAL_MS=1000
COMFYUI_WORKFLOW_PATH=./workflows/comfyui/storybook-ipadapter-sd15.json
```

`COMFYUI_WORKFLOW_PATH` has priority. The legacy `COMFYUI_WORKFLOW_JSON` remains supported as a fallback for existing installations.

## How reference consistency works

The generation pipeline is:

`Story → Characters → Character Reference → Pages/Panels → ComfyUI → QA → Repair`

When a character has no stored reference asset, OpenStory first generates a reference image with the same local ComfyUI provider. The reference asset is attached to the character and persisted in the canonical book.

For each page/panel, OpenStory automatically:

1. finds the Character IDs used by the panel;
2. resolves their reference assets;
3. uploads the reference image to `POST /upload/image`;
4. injects the returned ComfyUI image name into the `LoadImage` node;
5. injects prompt, negative prompt, seed and sampling controls into the workflow;
6. submits `POST /prompt`;
7. polls `GET /history/{prompt_id}`;
8. records the generated image URL and asset ID.

V1 sends the first reference when a panel has multiple characters. The provider contract already accepts a reference list so multi-reference workflow expansion can be added without changing the domain API.

## Prompt and seed

Every generated panel receives:

- character description and appearance;
- book visual style;
- page/panel context;
- negative prompt;
- deterministic page/panel seed.

The default negative prompt includes deformed anatomy, extra limbs/fingers, duplicate characters, text, watermark, blur, low quality and out-of-frame results.

A page/panel seed is stored in the canonical model. Regenerating one panel does not change other panels' seeds.

## Windows development

From the repository root:

```powershell
corepack enable
corepack prepare pnpm@10.15.1 --activate
pnpm install
pnpm --filter @openstory/web dev
```

Open:

`http://localhost:3000/studio`

ComfyUI must be running separately at `http://127.0.0.1:8188`.

## Troubleshooting

- **ComfyUI unavailable:** verify `http://127.0.0.1:8188/system_stats`.
- **Workflow missing:** verify `COMFYUI_WORKFLOW_PATH` from the OpenStory working directory.
- **Workflow invalid:** inspect the API-format JSON and ensure required custom nodes are installed.
- **Model missing:** open the workflow in ComfyUI and verify checkpoint/IPAdapter/CLIP Vision filenames.
- **Reference upload failed:** verify ComfyUI accepts `POST /upload/image` and that the reference URL/file is readable.
- **Generation timeout:** increase `COMFYUI_TIMEOUT_MS`; do not remove polling.
- **Output image missing:** inspect the ComfyUI history for the returned prompt ID and SaveImage output.

Never put secrets or API keys in the repository.
