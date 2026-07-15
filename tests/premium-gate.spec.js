import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn } from "./fixtures.js";

test("first pairing is free with no card and no paywall; second pairing hits the paywall", async ({ page }) => {
  let generateCallCount = 0;
  await page.route("**/api/generate-plan", async (route) => {
    generateCallCount++;
    await route.fulfill({ json: { ...MOCK_PLAN, pairingCount: 1, isPremium: false } });
  });

  await gotoFresh(page);
  await completeCheckIn(page);

  // STAGE 1 — first pairing: free, no card, no paywall.
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();
  expect(generateCallCount).toBe(1);

  // STAGE 2 — same account's second pairing attempt: the client already knows
  // (needsPremium=true, cached verbatim from the first response — see
  // MOCK_PLAN) that this account has used its free pairing, so it routes
  // straight to the paywall without a wasted round trip. Fail loudly if
  // generate-plan is called again.
  await page.getByRole("button", { name: "New Pairing" }).click();
  const continueBtn = page.getByRole("button", { name: "Continue →" });
  await continueBtn.click(); // budget: pre-filled from profile
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();
  await continueBtn.click(); // departure: pre-filled from profile
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Tokyo (NRT)");
  await continueBtn.click();
  await continueBtn.click(); // kitchen access (day 1): pre-filled from profile
  await page.getByRole("button", { name: "🌍 No", exact: true }).click();
  await continueBtn.click();
  await continueBtn.click(); // duty schedule, optional — skip

  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Premium Feature")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start Your Free Month" })).toBeVisible();
  expect(generateCallCount).toBe(1);

  // Back returns to the boarding pass screen.
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
});
