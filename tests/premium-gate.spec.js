import { test, expect } from "@playwright/test";
import { gotoFresh, completeCheckIn } from "./fixtures.js";

test("a new (non-premium) user is paywalled immediately — no free pairing", async ({ page }) => {
  // With FREE_PAIRING_LIMIT = 0 there is no free plan: a brand-new user must
  // start the card-required free month before any plan is generated, so the
  // premium screen appears on Generate WITHOUT the client ever calling
  // /api/generate-plan. Fail loudly if that request is made.
  let generateCalled = false;
  await page.route("**/api/generate-plan", async (route) => {
    generateCalled = true;
    await route.abort();
  });

  await gotoFresh(page);
  await completeCheckIn(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();

  await expect(page.getByText("Premium Feature")).toBeVisible();
  await expect(page.getByText("Start Your Free Month")).toBeVisible();
  expect(generateCalled).toBe(false);

  // Back returns to the boarding pass screen.
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
});
