import { test, expect } from "@playwright/test";

// Regression: a check-in draft had no expiration, so a form abandoned days
// or weeks ago permanently stood between a returning, already-logged-in
// user and the splash/home screen — every app open routed back into the
// same stale form instead. Flagged in a UX review: "navigation to reach
// the main landing page... currently defaults to an intermediate step."
// Fixed with a 24h freshness window on the draft.
test("a stale (>24h) check-in draft no longer blocks the splash screen", async ({ page }) => {
  const staleDraft = { step: 3, pairing: { name: "Alex" }, checkinReturning: true, savedAt: Date.now() - 25 * 60 * 60 * 1000 };
  await page.addInitScript((draft) => {
    localStorage.setItem("nutricrew_session", JSON.stringify({ token: "test-token", email: "alex@example.com" }));
    localStorage.setItem("nutricrew_user", JSON.stringify({ name: "Alex", email: "alex@example.com", isPremium: true, hasPassword: true, gender: "male", weight: "75kg", dob: "1990-01-01", position: "pilot" }));
    localStorage.setItem("nutricrew_checkin_draft", JSON.stringify(draft));
  }, staleDraft);
  await page.route("**/api/auth/verify-session", (route) => route.fulfill({ json: { email: "alex@example.com", isPremium: true } }));

  await page.goto("/");

  // Splash screen, not dumped back into the check-in form.
  await expect(page.getByRole("button", { name: "New Pairing" })).toBeVisible();
});

test("a fresh (<24h) check-in draft still resumes the check-in form", async ({ page }) => {
  const freshDraft = { step: 3, pairing: { name: "Alex" }, checkinReturning: true, savedAt: Date.now() - 60 * 1000 };
  await page.addInitScript((draft) => {
    localStorage.setItem("nutricrew_session", JSON.stringify({ token: "test-token", email: "alex@example.com" }));
    localStorage.setItem("nutricrew_user", JSON.stringify({ name: "Alex", email: "alex@example.com", isPremium: true, hasPassword: true, gender: "male", weight: "75kg", dob: "1990-01-01", position: "pilot" }));
    localStorage.setItem("nutricrew_checkin_draft", JSON.stringify(draft));
  }, freshDraft);
  await page.route("**/api/auth/verify-session", (route) => route.fulfill({ json: { email: "alex@example.com", isPremium: true } }));

  await page.goto("/");

  // Resumed the in-progress check-in, not sent to splash.
  await expect(page.getByRole("button", { name: "Continue →" })).toBeVisible();
});
