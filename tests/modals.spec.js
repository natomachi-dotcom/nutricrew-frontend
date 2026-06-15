import { test, expect } from "@playwright/test";
import { gotoFresh, completeCheckIn } from "./fixtures.js";

// The floating calorie/jet-lag/saved-meals buttons appear on both the boarding
// pass and plan screens, so these checks run right from the boarding pass
// without needing to mock plan generation.

test("calorie estimator modal estimates calories for a described meal", async ({ page }) => {
  await page.route("**/api/estimate-calories", async (route) => {
    await route.fulfill({
      json: {
        total: 650,
        breakdown: [
          { food: "Chicken sandwich", calories: 450 },
          { food: "Coffee with milk", calories: 200 },
        ],
        note: "Estimate based on typical portion sizes.",
      },
    });
  });

  await gotoFresh(page);
  await completeCheckIn(page);

  await page.getByRole("button", { name: "calorie estimator" }).click();
  await expect(page.getByText("Calorie Estimator")).toBeVisible();

  const estimateBtn = page.getByRole("button", { name: "Estimate Calories" });
  await expect(estimateBtn).toBeDisabled();

  await page.getByPlaceholder(/Describe what you ate/).fill("Chicken sandwich and a coffee with milk");
  await expect(estimateBtn).toBeEnabled();
  await estimateBtn.click();

  await expect(page.getByText(/≈\s*650\s*kcal/)).toBeVisible();
  await expect(page.getByText("Chicken sandwich", { exact: true })).toBeVisible();
  await expect(page.getByText("Estimate based on typical portion sizes.")).toBeVisible();

  await page.getByRole("button", { name: "✕" }).click();
  await expect(page.getByText("Calorie Estimator")).not.toBeVisible();
});

test("jet lag modal shows body-clock guidance for the detected time difference", async ({ page }) => {
  await gotoFresh(page);
  await completeCheckIn(page);

  await page.getByRole("button", { name: "jet lag info" }).click();
  await expect(page.getByText("Jet Lag Control")).toBeVisible();

  // Montreal (UTC-5) -> Paris (UTC+1) is a 6h eastward jump.
  await expect(page.getByText(/Time difference: 6 hours \(ahead\)/)).toBeVisible();
  await expect(page.getByText("Advance Your Body Clock")).toBeVisible();
  await expect(page.getByText("General Tips")).toBeVisible();

  await page.getByRole("button", { name: "✕" }).click();
  await expect(page.getByText("Jet Lag Control")).not.toBeVisible();
});
