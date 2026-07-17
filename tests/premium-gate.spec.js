import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn } from "./fixtures.js";

test("first pairing is free with no card and no paywall; second pairing hits the paywall with no trial language", async ({ page }) => {
  let generateCallCount = 0;
  await page.route("**/api/generate-plan", async (route) => {
    generateCallCount++;
    await route.fulfill({ json: { ...MOCK_PLAN, pairingCount: 1, isPremium: false } });
  });
  // Launch model: TRIAL_ENABLED=false — mocked explicitly so this test's
  // pass/fail doesn't depend on network access to the real backend.
  await page.route("**/api/config", (route) => route.fulfill({ json: { trialEnabled: false } }));

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
  await expect(page.getByRole("button", { name: "Subscribe — $7.99/month" })).toBeVisible();
  expect(generateCallCount).toBe(1);

  // No trial language anywhere on the paywall — this is the launch model
  // (1 free pairing, then an immediate paid subscription), not a trial.
  await expect(page.getByText(/free month/i)).not.toBeVisible();
  await expect(page.getByText(/free trial/i)).not.toBeVisible();
  await expect(page.getByText(/30 days/i)).not.toBeVisible();

  // Back returns to the boarding pass screen.
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
});

// Regression guard for the "preserve the trial code" requirement: every trial
// UI branch (splash badge, paywall CTA, disclaimer, billing terms) must still
// render correctly the moment the backend's TRIAL_ENABLED flag is flipped
// back on — nothing about the launch-model change may have deleted or broken
// that code path, only skipped it by default.
test("flipping TRIAL_ENABLED=true restores the original trial flow", async ({ page }) => {
  await page.route("**/api/config", (route) => route.fulfill({ json: { trialEnabled: true } }));

  await gotoFresh(page);
  // Splash screen badge, shown before check-in even starts.
  await expect(page.getByText("First Month Free")).toBeVisible();

  await completeCheckIn(page);
  // A brand-new account has no cached needsPremium yet, so simulate the
  // server routing it straight to the trial paywall (e.g. an account that
  // already used its free pairing on another device).
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ status: 403, json: { error: "premium_required", message: "trial", pairingCount: 1, needsPremium: true } });
  });
  await page.getByRole("button", { name: "Generate My Plan" }).click();

  await expect(page.getByText("Premium Feature")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start Your Free Month" })).toBeVisible();
  await expect(page.getByText(/Free for 30 days/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Subscribe — $7.99/month" })).not.toBeVisible();
});
