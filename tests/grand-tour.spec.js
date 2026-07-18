import { test, expect } from "@playwright/test";
import { MOCK_PLAN, gotoFresh, completeCheckIn, gotoAsPremiumUser, completeNewPairing } from "./fixtures.js";

// Final pre-launch pass covering the two full journeys the rest of the suite
// exercises only in pieces: a brand-new account's mandatory email
// verification + password setup on its first plan, and a returning premium
// user's profile/FAQ/language surface. Everything else (onboarding, paywall,
// duty schedule, modals, ingredient exclusion, airport autocomplete, review
// editing) already has dedicated specs.

test("brand-new crew member verifies their email via a one-time code, sets a mandatory password, and reaches their first plan", async ({ page }) => {
  let sendOtpCalls = 0, verifyOtpCalls = 0, setPasswordCalls = 0;

  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: { ...MOCK_PLAN, hasPassword: false } });
  });
  await page.route("**/api/auth/send-otp", async (route) => {
    sendOtpCalls++;
    await route.fulfill({ json: { alreadyVerified: false } });
  });
  await page.route("**/api/auth/verify-otp", async (route) => {
    verifyOtpCalls++;
    const body = route.request().postDataJSON();
    expect(body.otp).toBe("123456");
    await route.fulfill({
      json: { token: "test-token", email: body.email, hasPassword: false, isPremium: false, pairingCount: 1, needsPremium: true },
    });
  });
  await page.route("**/api/auth/set-password", async (route) => {
    setPasswordCalls++;
    const body = route.request().postDataJSON();
    expect(body.password).toBe("correct-horse-battery");
    await route.fulfill({ json: { success: true } });
  });

  await gotoFresh(page);
  await completeCheckIn(page, { email: "new.crew@example.com" });
  await page.getByRole("button", { name: "Generate My Plan" }).click();

  // Plan is held back — email verification comes first.
  await expect(page.getByText("Check your email")).toBeVisible();
  await expect(page.getByText("new.crew@example.com")).toBeVisible();
  expect(sendOtpCalls).toBe(1);

  await page.locator('input[placeholder="000000"]').fill("123456");
  await page.getByRole("button", { name: "Verify Code" }).click();
  expect(verifyOtpCalls).toBe(1);

  // No password on file yet -> mandatory password setup before the plan shows.
  await expect(page.getByText("Secure your account")).toBeVisible();
  await page.getByPlaceholder("New password (8+ characters)").fill("correct-horse-battery");
  await page.getByPlaceholder("Confirm password").fill("correct-horse-battery");
  await page.getByRole("button", { name: "Set Password" }).click();
  expect(setPasswordCalls).toBe(1);

  // Password accepted -> the plan that was held back is finally revealed.
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();
  await expect(page.getByText("Oatmeal with Berries")).toBeVisible();
});

test("returning premium crew member edits their profile, checks the FAQ, switches language, and starts a new pairing", async ({ page }) => {
  let profileUpdateBody = null;
  await page.route("**/api/profile/update", async (route) => {
    profileUpdateBody = route.request().postDataJSON();
    await route.fulfill({ json: { success: true } });
  });
  await page.route("**/api/config", (route) => route.fulfill({ json: { trialEnabled: false } }));

  await gotoAsPremiumUser(page);

  // Profile: identity fields are locked, other fields are editable and sync to the server.
  await page.getByRole("button", { name: "profile" }).click();
  await expect(page.getByText("Edit Profile")).toBeVisible();
  await expect(page.getByText("Alex Pilot")).toBeVisible();
  await expect(page.getByText("alex.pilot@example.com")).toBeVisible();
  await expect(page.getByText("Name and email can't be changed here.")).toBeVisible();

  await page.getByRole("button", { name: /Large/ }).click(); // lunch bag size
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Edit Profile")).not.toBeVisible();
  expect(profileUpdateBody.lunch_bag).toBe("large");
  expect(profileUpdateBody.email).toBe("alex.pilot@example.com");

  // FAQ opens from the splash screen and closes cleanly.
  await page.getByRole("button", { name: "FAQ", exact: true }).click();
  await expect(page.getByText("Frequently Asked Questions")).toBeVisible();
  await page.getByRole("button", { name: "✕" }).click();
  await expect(page.getByText("Frequently Asked Questions")).not.toBeVisible();

  // Language switch updates the splash copy for a returning (logged-in) user too.
  await page.getByRole("button", { name: "🇫🇷 FR" }).click();
  await expect(page.getByText("Bon retour", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "🇬🇧 EN" }).click();
  await expect(page.getByText("Welcome back", { exact: false })).toBeVisible();

  // New pairing still works end to end for an already-premium account (no paywall).
  await page.route("**/api/generate-plan", async (route) => {
    await route.fulfill({ json: { ...MOCK_PLAN, isPremium: true, needsPremium: false } });
  });
  await completeNewPairing(page, { destination: "Tokyo (NRT)" });
  await page.getByRole("button", { name: "Generate My Plan" }).click();
  await expect(page.getByText("Day 1 — Paris")).toBeVisible();
});
