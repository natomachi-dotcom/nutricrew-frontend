import { test, expect } from "@playwright/test";
import { gotoAsPremiumUser } from "./fixtures.js";

// Regression: the onboarding step asking what's on the plane menu
// (pairing.airplane_meal_description) is optional, and a dedicated
// completeness check already marked its step key ("airplane_meal_plan") as
// always satisfied. But the Continue button is actually gated by a SEPARATE
// canContinue() that didn't special-case this step — it fell through to a
// generic `pairing[currentStep]` lookup, which reads pairing.airplane_meal_plan
// (undefined; the real field is airplane_meal_description), so Continue
// stayed disabled forever on this step regardless of what was typed. Only
// the separate Skip button (which discards the answer) worked. A tester
// reported typing "chicken piri piri" and being stuck.
test("typing an airplane meal description enables Continue on that step", async ({ page }) => {
  await gotoAsPremiumUser(page);
  const continueBtn = page.getByRole("button", { name: "Continue →" });

  await page.getByRole("button", { name: "New Pairing" }).click();
  await continueBtn.click(); // diet: pre-filled
  await continueBtn.click(); // budget: pre-filled
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();
  await continueBtn.click(); // departure: pre-filled
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Paris (CDG)");
  await continueBtn.click();
  await page.getByRole("button", { name: "Airplane Meals Provided" }).click();
  await continueBtn.click();
  await continueBtn.click(); // duty schedule, optional — skip

  // airplane meal plan step
  await expect(page.getByText("What Will You Eat on the Plane?")).toBeVisible();
  await page.getByPlaceholder(/chicken with rice and salad/).fill("chicken piri piri");
  await expect(continueBtn).toBeEnabled();
  await continueBtn.click();

  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
});
