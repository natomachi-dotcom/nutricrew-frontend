import { test, expect } from "@playwright/test";
import { gotoFresh } from "./fixtures.js";

// An account with a password on file must never be logged into by simply
// leaving the password field blank — that made the password meaningless as
// an authentication factor, since anyone who knew the email could bypass it
// by not typing anything. Password is now required for the primary sign-in
// action; recovering access without it is a separate, explicitly-labeled
// "Forgot password?" action instead of an implicit blank-field default.

async function openLogin(page) {
  await gotoFresh(page);
  await page.getByRole("button", { name: "Already have an account? Log In" }).click();
  await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
}

test("leaving password blank and clicking Continue is rejected, not silently accepted", async ({ page }) => {
  let loginPasswordCalls = 0;
  let sendOtpCalls = 0;
  await page.route("**/api/auth/login-password", (route) => { loginPasswordCalls++; route.fulfill({ json: {} }); });
  await page.route("**/api/auth/send-otp", (route) => { sendOtpCalls++; route.fulfill({ json: { alreadyVerified: false } }); });

  await openLogin(page);
  await page.getByPlaceholder("your@email.com").fill("returning@example.com");
  // Password left blank on purpose.
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Password is required.", { exact: false })).toBeVisible();
  expect(loginPasswordCalls).toBe(0);
  expect(sendOtpCalls).toBe(0);
  // Still on the login screen, not silently logged in.
  await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
});

test("email + password signs in via login-password", async ({ page }) => {
  let loginPasswordBody = null;
  await page.route("**/api/auth/login-password", async (route) => {
    loginPasswordBody = route.request().postDataJSON();
    await route.fulfill({ json: {
      token: "tok", email: "returning@example.com", name: "Alex Pilot", hasPassword: true,
      isPremium: false, pairingCount: 1, needsPremium: false,
      // Fields SplashScreen's returningUser check requires to show "New
      // Pairing" instead of first-time check-in.
      gender: "male", weight: "75kg", dob: "1990-01-01", position: "pilot",
    } });
  });

  await openLogin(page);
  await page.getByPlaceholder("your@email.com").fill("returning@example.com");
  await page.getByPlaceholder("Password").fill("correct-horse-battery");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("button", { name: "New Pairing" })).toBeVisible({ timeout: 5000 });
  expect(loginPasswordBody).toEqual({ email: "returning@example.com", password: "correct-horse-battery" });
});

test("\"Forgot password?\" is a separate, explicit action that sends a one-time code", async ({ page }) => {
  let sendOtpCalls = 0;
  await page.route("**/api/auth/send-otp", (route) => { sendOtpCalls++; route.fulfill({ json: { alreadyVerified: false } }); });

  await openLogin(page);
  await page.getByPlaceholder("your@email.com").fill("forgot@example.com");
  // No password typed — this must NOT go through Continue.
  await page.getByRole("button", { name: /Forgot password/ }).click();

  await expect(page.getByText("Check your email")).toBeVisible({ timeout: 5000 });
  expect(sendOtpCalls).toBe(1);
});

test("account with no password on file still falls back to a one-time code, decided by the server", async ({ page }) => {
  await page.route("**/api/auth/login-password", (route) => route.fulfill({ status: 400, json: { error: "no_password" } }));
  let sendOtpCalls = 0;
  await page.route("**/api/auth/send-otp", (route) => { sendOtpCalls++; route.fulfill({ json: { alreadyVerified: false } }); });

  await openLogin(page);
  await page.getByPlaceholder("your@email.com").fill("nopassword@example.com");
  await page.getByPlaceholder("Password").fill("whatever-they-guessed");
  await page.getByRole("button", { name: "Continue" }).click();

  // The "doesn't have a password yet" info message is transient (the screen
  // moves straight on to the OTP step), so it isn't asserted here — the
  // reliable, non-racy signal is the OTP screen itself plus the one call.
  await expect(page.getByText("Check your email")).toBeVisible({ timeout: 5000 });
  expect(sendOtpCalls).toBe(1);
});
