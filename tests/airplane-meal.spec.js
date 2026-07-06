import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn } from "./fixtures.js";

test("airplane meal checker evaluates a served meal against the crew member's diet", async ({ page }) => {
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: MOCK_PLAN });
  });
  await page.route("**/api/check-airplane-meal", async (route) => {
    await route.fulfill({
      json: {
        fits: "partial",
        dietNote: "The dish looks vegetarian, but please confirm no animal-derived broth was used.",
        calories: 480,
        note: "Estimate based on a typical airline pasta portion.",
      },
    });
  });

  await gotoFresh(page);
  await completeCheckIn(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Oatmeal with Berries")).toBeVisible();

  // Meal cards are collapsed by default — expand the first one (Breakfast) to
  // reveal its action buttons.
  await page.getByText("Oatmeal with Berries").click();
  await page.getByRole("button", { name: "check airplane meal" }).first().click();
  await expect(page.getByText("Check Airplane Meal")).toBeVisible();

  const checkBtn = page.getByRole("button", { name: "Check Meal" });
  await expect(checkBtn).toBeDisabled();

  await page.getByPlaceholder(/Describe the meal you were served/).fill("Vegetable pasta with tomato sauce");
  await expect(checkBtn).toBeEnabled();
  await checkBtn.click();

  await expect(page.getByText("⚠️ Partially fits your diet")).toBeVisible();
  await expect(page.getByText(/please confirm no animal-derived broth/)).toBeVisible();
  await expect(page.getByText(/≈\s*480\s*kcal/)).toBeVisible();
  await expect(page.getByText("Estimate based on a typical airline pasta portion.")).toBeVisible();

  await page.getByRole("button", { name: "✕" }).click();
  await expect(page.getByText("Check Airplane Meal")).not.toBeVisible();
});
