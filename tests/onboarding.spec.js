import { test, expect } from "@playwright/test";
import { gotoFresh, completeCheckIn } from "./fixtures.js";

// A brand-new, never-logged-in user has no free pairing under the current
// paywall model (FREE_PAIRING_LIMIT = 0 — see premium-gate.spec.js) and there's
// no front-end-only way to fake "already premium" for a user who was never
// issued a session (premiumSuccess force-navigates straight to the premium
// screen rather than letting checkin continue). So this test covers what a
// truly fresh user can reach on their own: check-in completion and the
// boarding pass. Generate-and-explore for an already-subscribed user is
// covered by ingredient-exclusion.spec.js and airplane-meal.spec.js, which
// seed an already-premium returning user via gotoAsPremiumUser.
test("new crew member completes check-in and reaches the paywall on first Generate", async ({ page }) => {
  let generateCalled = false;
  await page.route("**/api/generate-plan", async (route) => {
    generateCalled = true;
    await route.abort();
  });

  await gotoFresh(page);
  await expect(page.getByText("Fuel Your Flight")).toBeVisible();

  await completeCheckIn(page);

  // Boarding pass reflects the check-in answers, including the detected jet lag
  // (Montreal (YUL, UTC-5) -> Paris (CDG, UTC+1) = 6h difference).
  await expect(page.getByText("NUTRICREW NUTRITION")).toBeVisible();
  await expect(page.getByText("Alex Pilot")).toBeVisible();
  await expect(page.getByText("PILOT", { exact: true })).toBeVisible();
  await expect(page.getByText("$50/DAY")).toBeVisible();
  await expect(page.getByText("6H DIFF ⚠️")).toBeVisible();

  // Back navigation returns to the last check-in step (duty schedule) without
  // losing earlier answers — confirmed by the budget still showing correctly
  // once we're back on the boarding pass.
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByText("Your Duty Schedule")).toBeVisible();
  await page.getByRole("button", { name: "Continue →" }).click();
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
  await expect(page.getByText("$50/DAY")).toBeVisible();

  // First Generate hits the paywall, not the AI backend.
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Premium Feature")).toBeVisible();
  expect(generateCalled).toBe(false);
});
