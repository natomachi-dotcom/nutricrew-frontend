import { test, expect } from "@playwright/test";
import { gotoAsPremiumUser } from "./fixtures.js";

// Two related bugs found live: (1) kitchen access silently pre-filled from a
// PRIOR trip's saved profile default (e.g. "Hotel (No Kitchen)") even when
// the current trip's actual accommodation is different — the crew member
// could tap Continue without ever making an active choice. (2) the Profile
// modal let a diet selection be saved as completely empty (no chips at all),
// which is trivial to trigger by accident: tapping an already-selected diet
// chip to "confirm" it actually toggles it OFF, and nothing blocked saving
// the resulting empty list — so every later pairing silently generated with
// no diet restriction at all.

test("kitchen access has no default for a new pairing — Continue is blocked until an explicit choice is made", async ({ page }) => {
  await gotoAsPremiumUser(page); // seeded with kitchen: ["hotel"]
  await page.getByRole("button", { name: "New Pairing" }).click();
  const continueBtn = page.getByRole("button", { name: "Continue →" });

  await continueBtn.click(); // diet: pre-filled from profile, still editable
  await continueBtn.click(); // budget: pre-filled from profile
  await page.getByRole("button", { name: "1 Days" }).click();
  await continueBtn.click();
  await continueBtn.click(); // departure: pre-filled from profile
  await page.getByPlaceholder("Where are you flying? (city or airport)").fill("Paris (CDG)");
  await continueBtn.click();

  // Now on the kitchen access step. Despite the saved profile having
  // kitchen: ["hotel"], NONE of the options should already be selected —
  // Continue must be disabled until the crew member actively picks one.
  await expect(page.getByText("Kitchen Access")).toBeVisible();
  await expect(continueBtn).toBeDisabled();

  await page.getByRole("button", { name: "Fridge, No Stove" }).click();
  await expect(continueBtn).toBeEnabled();
});

test("Profile modal refuses to save an empty diet selection", async ({ page }) => {
  await gotoAsPremiumUser(page, { diets: ["vegan"] });

  await page.getByRole("button", { name: "profile" }).click();
  await expect(page.getByText("Edit Profile")).toBeVisible();

  // Tap the already-selected Vegan chip once — the natural "let me confirm
  // this is still right" action, which actually toggles it OFF.
  await page.getByRole("button", { name: /Vegan/ }).click();

  await page.getByRole("button", { name: "Save Changes" }).click();

  // Must NOT save — the modal stays open with a validation message, exactly
  // like the check-in diet step's own "pick at least one" requirement.
  await expect(page.getByText("Edit Profile")).toBeVisible();
  await expect(page.getByText("Select at least one diet option to continue.")).toBeVisible();

  // Re-selecting (even explicitly "No Restrictions") allows the save through.
  await page.getByRole("button", { name: /No Restrictions/ }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page.getByText("Edit Profile")).not.toBeVisible();
});
