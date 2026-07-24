import { test, expect } from "@playwright/test";
import { gotoFresh } from "./fixtures.js";

// Regression: the departure field had no validation, so typing a partial
// fragment and abandoning it (e.g. "YU" instead of finishing "YUL") got
// silently debounce-saved as the permanent home base, auto-filling every
// future pairing. Production report 2026-07-25: departure field showing
// "YU" as if it were a real saved value.
test("an incomplete departure entry is not saved to the profile; a real one still is", async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole("button", { name: "Begin Check-In" }).click();

  const continueBtn = page.getByRole("button", { name: "Continue →" });
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

  // Departure step: type an incomplete fragment, wait past the 250ms debounce.
  const departureInput = page.getByPlaceholder("Montreal (YUL)");
  await departureInput.fill("YU");
  await page.waitForTimeout(500);

  const userAfterFragment = await page.evaluate(() => {
    const raw = localStorage.getItem("nutricrew_user");
    return raw ? JSON.parse(raw) : null;
  });
  expect(userAfterFragment?.departure || "").not.toBe("YU");

  // Clear it and type a real, complete airport entry — this SHOULD save.
  await departureInput.fill("");
  await departureInput.fill("Montreal (YUL)");
  await page.waitForTimeout(500);

  const userAfterReal = await page.evaluate(() => {
    const raw = localStorage.getItem("nutricrew_user");
    return raw ? JSON.parse(raw) : null;
  });
  expect(userAfterReal?.departure).toBe("Montreal (YUL)");
});
