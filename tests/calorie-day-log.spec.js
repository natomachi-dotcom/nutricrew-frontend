import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoAsPremiumUser } from "./fixtures.js";

// The calorie estimator can log an item against a SPECIFIC pairing day (not
// a single undated running total) — it shows up as a real line item in that
// day's meal plan and counts toward that day's own total. See App.jsx's
// addCalorieExtra/removeCalorieExtra and CalorieModal's day picker.

const TWO_DAY_PLAN = {
  ...MOCK_PLAN,
  days: [
    { ...MOCK_PLAN.days[0], day: 1, label: "Day 1 — Fort Lauderdale", totalCalories: 1950 },
    { ...MOCK_PLAN.days[0], day: 2, label: "Day 2 — Tokyo", totalCalories: 2000 },
  ],
};

async function completeTwoDayPairing(page, destinations = ["Fort Lauderdale (FLL)", "Tokyo (NRT)"]) {
  const continueBtn = page.getByRole("button", { name: "Continue →" });
  await page.getByRole("button", { name: "New Pairing" }).click();
  await continueBtn.click(); // diet: pre-filled
  await continueBtn.click(); // budget: pre-filled
  await page.getByRole("button", { name: "2 Days" }).click();
  await continueBtn.click();
  await continueBtn.click(); // departure: pre-filled
  const destInputs = page.getByPlaceholder("Where are you flying? (city or airport)");
  await destInputs.nth(0).fill(destinations[0]);
  await destInputs.nth(1).fill(destinations[1]);
  await continueBtn.click();
  await page.getByRole("button", { name: "Hotel (No Kitchen)" }).click(); // kitchen day 1
  await continueBtn.click();
  await page.getByRole("button", { name: "Hotel (No Kitchen)" }).click(); // kitchen day 2
  await continueBtn.click();
  await continueBtn.click(); // duty schedule, optional — skip
  await expect(page.getByRole("button", { name: "Generate My Plan" })).toBeVisible();
  await page.getByRole("button", { name: "Generate My Plan" }).click();
}

test("logging calories against Day 1 vs Day 2 adds to the right day only", async ({ page }) => {
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: TWO_DAY_PLAN });
  });
  await page.route("**/api/estimate-calories", async (route) => {
    const body = JSON.parse(route.request().postData());
    const total = body.prompt.includes("protein bar") ? 210 : 480;
    await route.fulfill({ json: { total, breakdown: [{ food: "item", calories: total }], note: "" } });
  });

  await gotoAsPremiumUser(page);
  await completeTwoDayPairing(page);
  await expect(page.getByText("Day 1 — Fort Lauderdale")).toBeVisible();

  // Baseline totals before logging anything.
  await expect(page.getByText("Total: 1950 kcal")).toBeVisible();

  await page.getByRole("button", { name: "calorie estimator" }).click();
  await expect(page.getByText("Calorie Estimator")).toBeVisible();

  // Day picker defaults to the day currently open in the plan (Day 1).
  await expect(page.getByRole("button", { name: "log calories to Day 1" })).toBeVisible();

  // Log a snack to Day 1 via the AI estimate flow.
  await page.getByText("Can't find it? Estimate by description (AI)").click();
  await page.getByPlaceholder(/Describe what you ate/).fill("protein bar");
  await page.getByRole("button", { name: "Estimate Calories" }).click();
  await expect(page.getByText(/≈\s*210\s*kcal/)).toBeVisible();
  await page.getByRole("button", { name: /Add to Day 1/ }).click();
  await expect(page.getByText("Logged Extras — Day 1")).toBeVisible();

  // Switch the picker to Day 2 and log a different item there. Day 1's own
  // "Logged Extras" section is still visible in the plan view behind the
  // modal (unrelated to the modal's current day selection) — only one match
  // (that background one) should exist; the modal itself shows none yet
  // since Day 2 has nothing logged.
  await page.getByRole("button", { name: "log calories to Day 2" }).click();
  await expect(page.getByText("Logged Extras", { exact: false })).toHaveCount(1);
  await page.getByPlaceholder(/Describe what you ate/).fill("airport sandwich");
  await page.getByRole("button", { name: "Estimate Calories" }).click();
  await expect(page.getByText(/≈\s*480\s*kcal/)).toBeVisible();
  await page.getByRole("button", { name: /Add to Day 2/ }).click();
  await expect(page.getByText("Logged Extras — Day 2")).toBeVisible();

  await page.getByRole("button", { name: "✕" }).click();

  // Day 1's meal plan now shows the logged extra and the bumped total;
  // Day 2's item never leaked onto Day 1.
  await expect(page.getByText("protein bar", { exact: false })).toBeVisible();
  await expect(page.getByText("210 kcal")).toBeVisible();
  await expect(page.getByText("Total: 2160 kcal")).toBeVisible(); // 1950 + 210
  await expect(page.getByText("airport sandwich", { exact: false })).not.toBeVisible();

  // Day 2 shows only its own logged item and its own bumped total.
  await page.getByRole("button", { name: /Day 2/ }).click();
  await expect(page.getByText("airport sandwich", { exact: false })).toBeVisible();
  await expect(page.getByText("480 kcal", { exact: true })).toBeVisible();
  await expect(page.getByText("Total: 2480 kcal")).toBeVisible(); // 2000 + 480
  await expect(page.getByText("protein bar", { exact: false })).not.toBeVisible();
});

test("removing a logged extra removes it from that day's total", async ({ page }) => {
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: TWO_DAY_PLAN });
  });
  await page.route("**/api/estimate-calories", async (route) => {
    await route.fulfill({ json: { total: 300, breakdown: [{ food: "snack", calories: 300 }], note: "" } });
  });

  await gotoAsPremiumUser(page);
  await completeTwoDayPairing(page);
  await expect(page.getByText("Day 1 — Fort Lauderdale")).toBeVisible();

  await page.getByRole("button", { name: "calorie estimator" }).click();
  await page.getByText("Can't find it? Estimate by description (AI)").click();
  await page.getByPlaceholder(/Describe what you ate/).fill("snack");
  await page.getByRole("button", { name: "Estimate Calories" }).click();
  await page.getByRole("button", { name: /Add to Day 1/ }).click();
  await expect(page.getByText("Logged Extras — Day 1")).toBeVisible();

  await page.getByRole("button", { name: "×", exact: true }).click();
  await expect(page.getByText("Logged Extras", { exact: false })).not.toBeVisible();

  await page.getByRole("button", { name: "✕" }).click();
  await expect(page.getByText("Total: 1950 kcal")).toBeVisible(); // back to baseline
});

test("single-day pairing has no day picker and adds directly to Day 1", async ({ page }) => {
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: MOCK_PLAN });
  });
  await page.route("**/api/estimate-calories", async (route) => {
    await route.fulfill({ json: { total: 150, breakdown: [{ food: "coffee", calories: 150 }], note: "" } });
  });

  await gotoAsPremiumUser(page);
  await page.getByRole("button", { name: "New Pairing" }).click();
  const continueBtn = page.getByRole("button", { name: "Continue →" });
  await continueBtn.click();
  await continueBtn.click();
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();
  await continueBtn.click();
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Paris (CDG)");
  await continueBtn.click();
  await page.getByRole("button", { name: "Hotel (No Kitchen)" }).click();
  await continueBtn.click();
  await continueBtn.click();
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();

  await page.getByRole("button", { name: "calorie estimator" }).click();
  await expect(page.getByRole("button", { name: "log calories to Day 1" })).not.toBeVisible(); // no picker for a single day

  await page.getByText("Can't find it? Estimate by description (AI)").click();
  await page.getByPlaceholder(/Describe what you ate/).fill("coffee");
  await page.getByRole("button", { name: "Estimate Calories" }).click();
  await page.getByRole("button", { name: "Add to Plan" }).click();
  await expect(page.getByText("Logged Extras").first()).toBeVisible();

  await page.getByRole("button", { name: "✕" }).click();
  await expect(page.getByText("Total: 2100 kcal")).toBeVisible(); // 1950 + 150
});
