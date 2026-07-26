import { test, expect } from "@playwright/test";
import { gotoAsPremiumUser, completeNewPairing, MOCK_PLAN } from "./fixtures.js";

// Regression: (1) the exercise "watch" link always pointed at a generic
// YouTube search-results page even when a specific video ID (ex.vid) was
// known — the thumbnail proved one existed, but tapping it never actually
// reached that video. (2) the exercise thumbnail depended on a live YouTube
// image URL that could 404/go missing with no real fallback. Both replaced:
// links now go to the specific video, and a custom SVG diagram (no network
// dependency) always renders regardless of vid.
test("gym plan exercises show custom diagrams and link to the specific video", async ({ page }) => {
  const month = new Date().toISOString().slice(0, 7);
  const mockPlan = {
    weeks: [{
      weekStart: `${month}-01`,
      days: [{
        date: `${month}-01`, type: "off",
        workout: {
          title: "Full Body", duration: "45 min",
          exercises: [
            { name: "Push-Up", sets: 3, reps: "12", notes: "Keep core tight.", muscle: "Chest", vid: "IODxDxX7oi4" },
            { name: "Squat", sets: 3, reps: "15", notes: "Full depth.", muscle: "Legs", vid: "ultWZbUMPL8" },
            { name: "Glute Bridge", sets: 3, reps: "15", notes: "Squeeze glutes.", muscle: "Glutes", vid: "OUgsJ8-Vi0E" },
            { name: "Plank", sets: 3, reps: "45s", notes: "Straight line.", muscle: "Core", vid: "pSHjTRaRanQ" },
            { name: "Downward Dog", sets: 1, reps: "60s", notes: "Breathe deeply.", muscle: "Flexibility", vid: "j97SSGsnCAQ" },
          ],
        },
      }],
    }],
  };

  await page.route("**/api/gym-plan/get*", (route) => route.fulfill({ json: { found: true, plan: mockPlan } }));
  await page.route("**/api/gym-plan/generate", (route) => route.fulfill({ json: { ok: true } }));
  await page.route("**/api/generate-plan", (route) => route.fulfill({ json: MOCK_PLAN }));
  await gotoAsPremiumUser(page);
  await completeNewPairing(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  await page.getByRole("button", { name: "gym plan" }).click();
  await expect(page.getByText("Full Body")).toBeVisible();

  // All five exercise names render, and each got its own custom diagram
  // (svg with the pose-icon's fixed viewBox) — no reliance on any external
  // image loading to see something.
  for (const name of ["Push-Up", "Squat", "Glute Bridge", "Plank", "Downward Dog"]) {
    await expect(page.getByText(name, { exact: true })).toBeVisible();
  }
  await expect(page.locator('svg[viewBox="0 0 64 56"]')).toHaveCount(5);

  // The watch link for Push-Up must point at the SPECIFIC video, not a
  // generic search-results page.
  const pushUpLink = page.locator("a[href*='watch?v=IODxDxX7oi4']");
  await expect(pushUpLink).toHaveCount(1);
  await expect(page.locator("a[href*='youtube.com/results']")).toHaveCount(0);
});
