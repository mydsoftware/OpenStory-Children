# راهنمای استفاده از OpenStory Children

## 1. اجرای محلی

پیش‌نیاز: Node.js 20+ و pnpm 10+.

```bash
pnpm install
pnpm --filter @openstory/web dev
```

سپس مرورگر را روی `http://localhost:3000/studio` باز کنید.

## 2. ساخت اولین کتاب

1. ایده داستان را در کادر «ایده» بنویسید.
2. گروه سنی را انتخاب کنید.
3. تعداد صفحات را انتخاب کنید.
4. روی «تولید کتاب» بزنید.
5. نتیجه، شخصیت‌ها، صفحات و پنل‌ها را بررسی کنید.
6. امتیاز QA را بررسی کنید.
7. با «خروجی HTML» کتاب را ذخیره کنید.
8. فایل HTML را در مرورگر باز کنید و برای PDF از Print مرورگر استفاده کنید.

## 3. نمونه ورودی

```text
برای یک کودک ۴ ساله یک کمیک ۱۰ صفحه‌ای درباره یک داینوسور کوچولو به نام دینو بساز که دوستش را گم کرده.
```

## 4. استفاده بدون هوش مصنوعی ابری

نسخه فعلی یک deterministic fallback دارد؛ بنابراین برای تست اولیه هیچ API key لازم نیست.

برای اتصال AI محلی، معماری Provider از این سرویس‌ها پشتیبانی می‌کند:

- Ollama: `http://localhost:11434`
- LM Studio / OpenAI-compatible: `http://localhost:1234/v1`
- ComfyUI: `http://localhost:8188`

## 5. توسعه‌دهندگان و Agentها

قبل از تغییر کد این فایل‌ها را بخوانید:

```text
README.md
AGENTS.md
docs/PROJECT_STATUS.md
planning/CURRENT_TASK.md
docs/ROADMAP.md
```

سپس:

```bash
pnpm check
pnpm --filter @openstory/web build
```

قاعده پروژه: هیچ مرحله‌ای صرفاً با نوشتن مستندات کامل محسوب نمی‌شود؛ implementation، test و verification لازم است.
