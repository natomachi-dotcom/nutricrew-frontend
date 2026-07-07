import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh } from "./fixtures.js";

// Walks through check-in selecting Nut-Free (instead of the default "No
// Restrictions" completeCheckIn uses) so the ingredient-exclusion UI is
// active on the resulting plan.
async function completeCheckInNutFree(page) {
  const continueBtn = page.getByRole("button", { name: "Continue →" });

  await page.getByRole("button", { name: "Begin Check-In" }).click();
  await page.getByPlaceholder("John Smith").fill("Alex Pilot");
  await continueBtn.click();
  await page.getByPlaceholder("john@airline.com").fill("alex.pilot@example.com");
  await continueBtn.click();
  await page.getByRole("button", { name: "Male", exact: true }).click();
  await continueBtn.click();
  await page.getByPlaceholder("70").fill("75");
  await continueBtn.click();
  await page.locator('input[type="date"]').fill("1990-01-01");
  await continueBtn.click();
  await page.getByRole("button", { name: "Pilot" }).click();
  await continueBtn.click();
  await page.getByRole("button", { name: /Small/ }).click();
  await continueBtn.click();
  await page.getByRole("button", { name: "I Need Simple Recipes" }).click();
  await continueBtn.click();

  // diet: Nut-Free (an allergy, not "No Restrictions")
  await page.getByRole("button", { name: "Nut-Free" }).click();
  await continueBtn.click();

  await page.getByRole("button", { name: "Stay Focused & Alert" }).click();
  await continueBtn.click();
  await page.getByRole("button", { name: "Per Day" }).click();
  await page.getByPlaceholder("50").fill("50");
  await continueBtn.click();
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();
  await page.getByPlaceholder("Montreal (YUL)").fill("Montreal (YUL)");
  await continueBtn.click();
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Paris (CDG)");
  await continueBtn.click();
  await page.getByRole("button", { name: "Hotel (No Kitchen)" }).click();
  await continueBtn.click();
  await page.getByRole("button", { name: "🌍 No", exact: true }).click();
  await continueBtn.click();
  await continueBtn.click(); // duty schedule, optional — skip

  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
}

test("flagging an allergen ingredient regenerates just that meal", async ({ page }) => {
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: MOCK_PLAN });
  });

  const replacementMeal = {
    type: "Snack",
    name: "Greek Yogurt with Sunflower Seeds",
    description: "Plain Greek yogurt topped with sunflower seeds and honey (nut-free).",
    prep: "2 min",
    calories: 200,
    protein: 12,
    carbs: 15,
    fat: 8,
    tags: ["protein-rich"],
    ingredients: ["Greek yogurt", "sunflower seeds", "honey"],
    tip: "Buy single-serving cups for travel.",
    recyclingTip: "Rinse and recycle the yogurt cup.",
  };
  let regenerateRequestBody = null;
  await page.route("**/api/regenerate-meal", async (route) => {
    regenerateRequestBody = route.request().postDataJSON();
    await route.fulfill({ json: { meal: replacementMeal } });
  });

  await gotoFresh(page);
  await completeCheckInNutFree(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  // Expand the snack meal that contains almonds.
  await page.getByText("Greek Yogurt with Almonds").click();
  await expect(page.getByRole("button", { name: /almonds ✕/ })).toBeVisible();

  await page.getByRole("button", { name: /almonds ✕/ }).click();

  // Meal card updates to the regenerated, nut-free replacement.
  await expect(page.getByText("Greek Yogurt with Sunflower Seeds")).toBeVisible();
  await expect(page.getByText("Greek Yogurt with Almonds")).not.toBeVisible();

  expect(regenerateRequestBody.excludeIngredient).toBe("almonds");
  expect(regenerateRequestBody.meal.name).toBe("Greek Yogurt with Almonds");
});
