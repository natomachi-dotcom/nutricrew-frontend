import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn } from "./fixtures.js";

// Regression: btoa() throws InvalidCharacterError on any character outside
// Latin-1 (smart quotes, em-dashes, ellipses — all common in AI-generated
// text). GroceryList used btoa(JSON.stringify(list)) to build its localStorage
// key, so a single grocery item containing one of these characters crashed
// the whole component with no error boundary, blanking the screen. Confirmed
// production report 2026-07-25: "click grocery list, screen goes black,
// bounces back to create new pairing."
test("grocery list with smart quotes and em-dashes doesn't crash the app", async ({ page }) => {
  const planWithTrickyChars = {
    ...MOCK_PLAN,
    groceryList: {
      ...MOCK_PLAN.groceryList,
      produce: ["Chef's knife — sharpened", "Café-style beans…"],
      pantry: [...MOCK_PLAN.groceryList.pantry, "“Gourmet” seasoning blend"], // curly quotes
    },
  };

  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: planWithTrickyChars });
  });

  await gotoFresh(page);
  await completeCheckIn(page);
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  await page.getByRole("button", { name: /Grocery List/ }).click();

  // The crash used to blank the whole screen and bounce back to check-in —
  // assert we're still on the plan screen with the tricky-character items
  // actually rendered, not silently dropped or errored out.
  await expect(page.getByText("Chef's knife")).toBeVisible();
  await expect(page.getByText("Café-style beans")).toBeVisible();
  await expect(page.getByText("Gourmet” seasoning blend", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Begin Check-In" })).not.toBeVisible();
});
