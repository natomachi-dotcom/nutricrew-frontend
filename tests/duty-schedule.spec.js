import { test, expect } from "@playwright/test";

// Stores a session token + full user profile in localStorage so the app boots
// directly to the splash screen with a "New Pairing" button.  The verify-session
// API call will fail (no backend in tests) but the catch handler only redirects
// from "loading", so we stay on "splash".
async function gotoReturningUser(page) {
  // No real backend runs in tests. Left unmocked, Vite's dev-server proxy turns
  // "nothing listening on :3001" into an HTTP error response (not a network
  // exception), which the app's verify-session handler treats as "session
  // invalid" and force-redirects to the login screen regardless of where the
  // user already navigated. Mock a success response so verify-session is a no-op.
  await page.route("**/api/auth/verify-session", (route) =>
    route.fulfill({ json: { email: "renatogadeabi@gmail.com", isPremium: false } })
  );
  await page.addInitScript(() => {
    localStorage.setItem(
      "nutricrew_session",
      JSON.stringify({ token: "test-token", email: "renatogadeabi@gmail.com" })
    );
    localStorage.setItem(
      "nutricrew_user",
      JSON.stringify({
        name: "Alex Pilot",
        email: "renatogadeabi@gmail.com",
        gender: "male",
        weight: "75",
        dob: "1985-06-15",
        position: "pilot",
        kitchen: ["fridge"],
        diets: ["none"],
        goals: ["stay_focused"],
        budget_type: "day",
        budget_amount: "50",
      })
    );
  });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "New Pairing" })).toBeVisible({
    timeout: 5000,
  });
}

// Clicks through the returning-user steps (pairing_days → departure →
// destination → kitchen_day_1 → going_usa → duty_schedule) and leaves the
// caller on the duty_schedule step, ready to fill in the time or skip it.
async function walkToDutySchedule(page) {
  const continueBtn = page.getByRole("button", { name: "Continue →" });

  await page.getByRole("button", { name: "New Pairing" }).click();

  // pairing_days: 1 day
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();

  // departure: optional (canContinue always returns true), proceed as-is
  await continueBtn.click();

  // destination: required — at least one city must be filled
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Paris (CDG)");
  await continueBtn.click();

  // kitchen access (day 1): required — at least one option
  await page.getByRole("button", { name: "Fridge, No Stove" }).click();
  await continueBtn.click();

  // going_usa: No
  await page.getByRole("button", { name: "🌍 No", exact: true }).click();
  await continueBtn.click();

  // Now on duty_schedule step
}

test.describe("Duty Schedule → Boarding Pass", () => {
  test("COGNITIVE MODE row appears when report_time is set", async ({ page }) => {
    await gotoReturningUser(page);
    await walkToDutySchedule(page);

    await page.locator('input[type="time"]').fill("06:00");
    await page.getByRole("button", { name: "Continue →" }).click();

    // Confirm we landed on the boarding pass
    await expect(
      page.getByRole("button", { name: "Generate My Plan" })
    ).toBeVisible();
    await expect(
      page.getByText("🧠 COGNITIVE MODE | DUTY OPTIMIZED")
    ).toBeVisible();
  });

  test("COGNITIVE MODE row is absent when duty schedule is skipped", async ({ page }) => {
    await gotoReturningUser(page);
    await walkToDutySchedule(page);

    // duty_schedule canContinue() always returns true — skip without filling
    await page.getByRole("button", { name: "Continue →" }).click();

    await expect(
      page.getByRole("button", { name: "Generate My Plan" })
    ).toBeVisible();
    await expect(
      page.getByText("🧠 COGNITIVE MODE | DUTY OPTIMIZED")
    ).not.toBeVisible();
  });
});
