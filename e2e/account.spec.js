import { expect, test } from "@playwright/test";
import { openCleanStore } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await openCleanStore(page);
  await page.getByTestId("open-account-button").click();
  await page.getByRole("button", { name: "Create account", exact: true }).click();
});

test("ACC-05 P1 - campos obrigatórios impedem cadastro vazio", async ({
  page,
}) => {
  await page.getByTestId("register-submit-button").click();

  const nameIsRequired = await page
    .getByTestId("register-name-input")
    .evaluate((input) => input.validity.valueMissing);
  expect(nameIsRequired).toBe(true);
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("ACC-06 P1 - senhas diferentes não criam conta", async ({ page }) => {
  await page.getByTestId("register-name-input").fill("QA Suite");
  await page
    .getByTestId("register-email-input")
    .fill("qa-password-mismatch@example.test");
  await page.getByTestId("register-cpf-input").fill("529.982.247-25");
  await page.getByTestId("register-phone-input").fill("11999990000");
  await page.getByTestId("register-password-input").fill("Teste@1234");
  await page
    .getByTestId("register-confirm-password-input")
    .fill("Different@1234");
  await page.getByTestId("register-submit-button").click();

  await expect(page.getByRole("alert")).toHaveText("The passwords don't match.");
  const accountWasStored = await page.evaluate(() =>
    Object.values(localStorage).some((value) =>
      value.includes("qa-password-mismatch@example.test"),
    ),
  );
  expect(accountWasStored).toBe(false);
});
