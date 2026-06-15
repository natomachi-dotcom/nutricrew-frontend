import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn } from "./fixtures.js";

test("new crew member completes check-in, generates a plan, and explores it", async ({ page }) => {
  let generatePlanRequestBody = null;
  await page.route("**/api/generate-plan", async (route) => {
    generatePlanRequestBody = route.request().postDataJSON();
    await route.fulfill({ json: MOCK_PLAN });
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

  // Back navigation returns to the last check-in step without losing answers.
  await page.getByRole("button", { name: "← Back" }).click();
  await expect(page.getByPlaceholder("50")).toHaveValue("50");
  await page.getByRole("button", { name: "Continue →" }).click();
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();

  // Generate the plan.
  await page.getByRole("button", { name: "Generate My Plan" }).click();

  // Plan screen: meal plan tab (default) with the mocked day's meals.
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();
  await expect(page.getByText("Jet Lag Advisory")).toBeVisible();
  await expect(page.getByText("Oatmeal with Berries")).toBeVisible();
  await expect(page.getByText(/Total:\s*1950\s*kcal/)).toBeVisible();

  expect(generatePlanRequestBody.lang).toBe("en");
  expect(generatePlanRequestBody.data.name).toBe("Alex Pilot");
  expect(generatePlanRequestBody.data.email).toBe("alex.pilot@example.com");
  expect(generatePlanRequestBody.data.pairing_days).toBe(1);

  // Favoriting a meal toggles the heart icon.
  const favoriteBtn = page.getByRole("button", { name: "favorite" }).first();
  await expect(favoriteBtn).toHaveText("🤍");
  await favoriteBtn.click();
  await expect(favoriteBtn).toHaveText("❤️");

  // Grocery list tab.
  await page.getByRole("button", { name: "Grocery List" }).click();
  await expect(page.getByText("Bananas")).toBeVisible();
  await expect(page.getByText("Chicken breast")).toBeVisible();

  // Food rules tab (going_usa = "no", so only destination/general rules show).
  await page.getByRole("button", { name: "Food Rules" }).click();
  await expect(page.getByText("Some dairy and meat products")).toBeVisible();
  await expect(page.getByText("Stay hydrated and avoid excess sodium")).toBeVisible();
});
