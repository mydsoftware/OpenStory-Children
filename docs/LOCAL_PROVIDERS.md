# اتصال به AI محلی

## Ollama

پیش‌فرض پیشنهادی برای شروع: `qwen2.5:7b` روی Ollama.

```ts
import { OllamaLLMProvider, createOllamaConfig } from "@openstory/core";

const provider = new OllamaLLMProvider(createOllamaConfig("http://localhost:11434", "qwen2.5:7b"));
```

## LM Studio و سرورهای OpenAI-compatible

```ts
import { OpenAICompatibleLLMProvider, createOpenAICompatibleConfig } from "@openstory/core";

const provider = new OpenAICompatibleLLMProvider(createOpenAICompatibleConfig("http://localhost:1234/v1", "local-model"));
```

## ComfyUI

برای ComfyUI باید workflow API-compatible در اختیار برنامه قرار گیرد. در workflow متن prompt را با `{{PROMPT}}` جایگزین کنید.

```ts
import { ComfyUIImageProvider } from "@openstory/core";

const provider = new ComfyUIImageProvider({
  baseUrl: "http://localhost:8188",
  workflow: {
    /* ComfyUI API workflow */
  }
});
```

نسخه فعلی adapterها را در سطح هسته ارائه می‌کند؛ اتصال provider به UI و ذخیره تنظیمات کاربر مرحله بعدی است.
