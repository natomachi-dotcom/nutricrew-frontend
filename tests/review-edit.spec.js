import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn } from "./fixtures.js";

test("editing a field from the review screen updates it and returns without losing other choices", async ({ page }) => {
  let generatePlanRequestBody = null;
  await page.route("**/api/generate-plan", async (route) => {
    generatePlanRequestBody = route.request().postDataJSON();
    await route.fulfill({ json: MOCK_PLAN });
  });

  await gotoFresh(page);
  await completeCheckIn(page);

  // Boarding pass shows the original answers.
  await expect(page.getByText("$50/DAY")).toBeVisible();
  await expect(page.getByText("—", { exact: true }).first()).toBeVisible(); // DIET row: no restrictions -> "—"
  await expect(page.getByText("Stay Focused")).toBeVisible(); // GOALS row

  // Edit the budget from the review screen.
  await page.getByRole("button", { name: "Edit YOUR BUDGET" }).click();
  await expect(page.getByText("✏️ Edit")).toBeVisible(); // review-mode header indicator
  const amountInput = page.getByPlaceholder("50");
  await amountInput.fill("75");
  await page.getByRole("button", { name: "Back to Review" }).click();

  // Back on review: budget updated, everything else intact.
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
  await expect(page.getByText("$75/DAY")).toBeVisible();
  await expect(page.getByText("Stay Focused")).toBeVisible();
  await expect(page.getByText("Alex Pilot")).toBeVisible();

  // Edit a second, unrelated field (goals) to confirm the earlier budget edit
  // survives a second trip through review-edit.
  await page.getByRole("button", { name: "Edit YOUR GOALS" }).click();
  await page.getByRole("button", { name: "Avoid Bloating" }).click();
  await page.getByRole("button", { name: "Back to Review" }).click();

  await expect(page.getByText("$75/DAY")).toBeVisible(); // budget edit still intact
  await expect(page.getByText("Alex Pilot")).toBeVisible();
  await expect(page.getByText("bloating", { exact: false })).toBeVisible(); // goals edit reflected

  // This account's free first pairing is still available — Generate and
  // confirm the request reflects both edits.
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  expect(generatePlanRequestBody.data.budget_amount).toBe("75");
  expect(generatePlanRequestBody.data.goals).toEqual(expect.arrayContaining(["stay_focused", "no_bloating"]));
  expect(generatePlanRequestBody.data.name).toBe("Alex Pilot");
  expect(generatePlanRequestBody.data.pairing_days).toBe(1);
});
