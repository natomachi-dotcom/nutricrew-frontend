import { test, expect } from "@playwright/test";
import { gotoFresh } from "./fixtures.js";

test("language selector switches the splash screen copy", async ({ page }) => {
  await gotoFresh(page);
  await expect(page.getByText("Fuel Your Flight")).toBeVisible();

  await page.getByRole("button", { name: "🇫🇷 FR" }).click();
  await expect(page.getByText("Alimentez Votre Vol")).toBeVisible();

  await page.getByRole("button", { name: "🇪🇸 ES" }).click();
  await expect(page.getByText("Combustible Para Tu Vuelo")).toBeVisible();

  await page.getByRole("button", { name: "🇬🇧 EN" }).click();
  await expect(page.getByText("Fuel Your Flight")).toBeVisible();
});
