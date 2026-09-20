import { test, expect } from "@playwright/test";

test("studio renders and generates a fallback book", async ({ page }) => {
  await page.goto("/studio");
  await expect(page.getByText("OPENSTORY STUDIO • V1 CORE")).toBeVisible();
  await expect(page.getByRole("heading", { name: "استودیو ساخت کتاب کمیک" })).toBeVisible();
  await expect(page.getByLabel("ایده")).toBeVisible();
  await expect(page.getByLabel("گروه سنی")).toBeVisible();
  await expect(page.getByText(/تعداد صفحات:/)).toBeVisible();

  await page.getByRole("button", { name: "تولید کتاب" }).click();
  await expect(page.getByText(/QA: \d+\/100/)).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("button", { name: "ذخیره ویرایش‌ها" })).toBeVisible();
  await expect(page.getByText("کتابخانه پروژه‌ها")).toBeVisible();
});

test("studio exposes editing and regeneration controls after generation", async ({ page }) => {
  await page.goto("/studio");
  await page.getByRole("button", { name: "تولید کتاب" }).click();
  await expect(page.getByRole("button", { name: "ذخیره ویرایش‌ها" })).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("button", { name: "بازسازی این پنل با AI" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "خروجی HTML" })).toBeVisible();
});
