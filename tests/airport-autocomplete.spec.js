import { test, expect } from "@playwright/test";
import { gotoFresh } from "./fixtures.js";

// Walks check-in far enough to reach the destination step, without needing
// the rest of a full completeCheckIn walkthrough.
async function walkToDestination(page) {
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
  await page.getByRole("button", { name: "No Restrictions" }).click();
  await continueBtn.click();
  await page.getByRole("button", { name: "Stay Focused & Alert" }).click();
  await continueBtn.click();
  await page.getByRole("button", { name: "Per Day" }).click();
  await page.getByPlaceholder("50").fill("50");
  await continueBtn.click();
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();
  await page.getByPlaceholder("Montreal (YUL)").fill("Toronto");
  // Departure step: typing a city shows its commercial airports as choices.
  await expect(page.getByRole("button", { name: /YYZ/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /YTZ/ })).toBeVisible();
  await page.getByRole("button", { name: /YYZ/ }).click();
  await expect(page.getByPlaceholder("Montreal (YUL)")).toHaveValue("Toronto (YYZ)");
  await continueBtn.click();
}

test("typing a city shows its commercial airports as choices", async ({ page }) => {
  await gotoFresh(page);
  await walkToDestination(page);

  const destInput = page.getByPlaceholder("Where are you flying? (city or airport)");
  await destInput.fill("London");
  await expect(page.getByRole("button", { name: /LHR/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /LGW/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /LCY/ })).toBeVisible();

  await page.getByRole("button", { name: /LHR/ }).click();
  await expect(destInput).toHaveValue("London (LHR)");
});

test("typing an ICAO code surfaces the matching airport", async ({ page }) => {
  await gotoFresh(page);
  await walkToDestination(page);

  const destInput = page.getByPlaceholder("Where are you flying? (city or airport)");
  await destInput.fill("CYYZ");
  await expect(page.getByRole("button", { name: /Toronto Pearson/ })).toBeVisible();

  await page.getByRole("button", { name: /Toronto Pearson/ }).click();
  await expect(destInput).toHaveValue("Toronto (YYZ)");
});
