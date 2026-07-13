import { test, expect } from "@playwright/test";
import { gotoFresh } from "./fixtures.js";

// A visitor with no cached account on this device/browser (incognito, cleared
// storage, or a different device) must be able to reach the existing-account
// login flow, not just first-time check-in.
test("a visitor with no cached account can reach login from the splash screen", async ({ page }) => {
  await gotoFresh(page);

  // "Begin Check-In" is still the primary CTA...
  await expect(page.getByRole("button", { name: "Begin Check-In" })).toBeVisible();
  // ...but a separate login control is also available.
  const loginBtn = page.getByRole("button", { name: "log in" });
  await expect(loginBtn).toBeVisible();

  await loginBtn.click();
  await expect(page.getByText("Sign in")).toBeVisible();
  await expect(page.getByPlaceholder("your@email.com")).toBeVisible();

  // Back returns to the splash screen without side effects.
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByRole("button", { name: "Begin Check-In" })).toBeVisible();
});
