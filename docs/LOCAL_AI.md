# Local AI Providers

OpenStory Children keeps AI providers optional and vendor-neutral.

## Ollama

Default endpoint:

`http://localhost:11434`

Example model configuration:

`qwen2.5:7b`

The core adapter sends structured JSON requests through Ollama's chat API.

## LM Studio

Default endpoint:

`http://localhost:1234/v1`

The adapter uses the OpenAI-compatible `/chat/completions` endpoint and supports an optional API key.

## ComfyUI

Default endpoint:

`http://localhost:8188`

A ComfyUI API workflow is supplied to the adapter. The prompt placeholder `{{PROMPT}}` is replaced before submission. The adapter polls `/history/{prompt_id}` and returns the first generated image asset it finds.

## Resource-aware local operation

The deterministic engine remains the default fallback, so OpenStory can run without an AI service. This is intentional for low-VRAM machines and offline development.

For a 6 GB GPU, start with lightweight image workflows and avoid making high-resolution image generation a hard requirement for the core book pipeline.

## Security

Provider endpoints should normally point to localhost or a trusted private network. Do not expose local AI APIs directly to the public internet without authentication and network controls.
