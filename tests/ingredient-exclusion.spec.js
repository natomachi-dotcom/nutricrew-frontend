import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoAsPremiumUser, completeNewPairing } from "./fixtures.js";

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

  // Nut-Free is a one-time profile field, seeded directly rather than clicked
  // through onboarding — a returning user's diet/allergies are pre-set, not
  // re-asked (see bf4095f "Fix returning users being forced through full
  // onboarding on every pairing").
  await gotoAsPremiumUser(page, { diets: ["nut_free"] });
  await completeNewPairing(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  // Expand the snack meal that contains almonds.
  await page.getByText("Greek Yogurt with Almonds").click();
  await expect(page.getByRole("button", { name: /almonds — remove/ })).toBeVisible();

  await page.getByRole("button", { name: /almonds — remove/ }).click();

  // Meal card updates to the regenerated, nut-free replacement.
  await expect(page.getByText("Greek Yogurt with Sunflower Seeds")).toBeVisible();
  await expect(page.getByText("Greek Yogurt with Almonds")).not.toBeVisible();

  expect(regenerateRequestBody.excludeIngredient).toBe("almonds");
  expect(regenerateRequestBody.meal.name).toBe("Greek Yogurt with Almonds");
});
