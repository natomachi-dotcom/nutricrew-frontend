import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn } from "./fixtures.js";

// New feature: trading a calorie-estimator extra for a planned meal instead
// of just piling it on top of the daily total. Trading marks the chosen
// meal "skipped" (not deleted) — still visible, greyed out, excluded from
// the day's total, and restorable from the plan view.
test("trading an AI-estimated extra skips the chosen meal and updates the daily total", async ({ page }) => {
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: MOCK_PLAN });
  });
  await page.route("**/api/estimate-calories", async (route) => {
    await route.fulfill({ json: { total: 300, breakdown: [{ food: "Candy bar", calories: 300 }], note: "Approximate." } });
  });

  await gotoFresh(page);
  await completeCheckIn(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  // Original total: 450 (breakfast) + 600 (lunch) + 700 (dinner) + 200 (snack) = 1950.
  await expect(page.getByText("Total:")).toContainText("1950 kcal");

  // Open the calorie estimator (centered modal now, not a bottom sheet).
  await page.getByRole("button", { name: "calorie estimator" }).click();
  await expect(page.getByText("Calorie Estimator")).toBeVisible();

  await page.getByText("Can't find it? Estimate by description (AI)").click();
  await page.getByPlaceholder(/Describe what you ate/).fill("A candy bar");
  await page.getByRole("button", { name: "Estimate Calories" }).click();
  await expect(page.getByText("≈ 300 kcal")).toBeVisible();

  // Trade it against the planned Lunch (600 kcal) instead of just adding it.
  await page.getByRole("button", { name: "Trade for a planned meal instead" }).click();
  await page.getByText("Lunch: Grilled Chicken Salad").click();

  // Modal closes the picker; close the whole modal to check the plan view.
  await page.getByRole("button", { name: "✕" }).click();

  // Lunch is now shown as skipped, and the total reflects: 1950 - 600 (skipped lunch) + 300 (extra) = 1650.
  await expect(page.getByText("Skipped", { exact: false })).toBeVisible();
  await expect(page.getByText("Total:")).toContainText("1650 kcal");

  // Restore the meal from the plan view — total goes back to 1950 + 300 (extra stays logged) = 2250.
  await page.getByText("Grilled Chicken Salad").click(); // expand the card
  await page.getByRole("button", { name: /Restore this meal/ }).click();
  await expect(page.getByText("Total:")).toContainText("2250 kcal");
});
