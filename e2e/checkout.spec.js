import { expect, test } from "@playwright/test";
import { addProductToBag, openCleanStore } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await openCleanStore(page);
});

test("CHK-01 P1 - checkout vazio não é iniciado", async ({ page }) => {
  test.fail(
    true,
    "A versão publicada deixa o botão de checkout habilitado com o carrinho vazio.",
  );

  await page.getByTestId("open-cart-button").click();
  await expect(page.getByText("Your bag is taking a break.")).toBeVisible();
  await expect(page.getByTestId("cart-item-3")).toHaveCount(0);
  await expect(page.getByTestId("checkout-button")).toBeDisabled();
});

test("CHK-02 P1 - endereço incompleto não avança no checkout", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  await page.getByTestId("open-cart-button").click();
  await page.getByTestId("checkout-button").click();

  const checkout = page.getByRole("dialog", { name: "Checkout" });
  await expect(checkout).toBeVisible();
  await expect(
    checkout.getByRole("heading", { name: "Where should we send it?" }),
  ).toBeVisible();
  await checkout.getByTestId("checkout-address-continue").click();

  const nameIsRequired =
    await checkout
      .getByTestId("checkout-name-input")
      .evaluate((input) => input.validity.valueMissing);
  expect(nameIsRequired).toBe(true);
  await expect(
    checkout.getByRole("heading", { name: "Where should we send it?" }),
  ).toBeVisible();
  await expect(
    checkout.getByRole("heading", { name: "Shipping options" }),
  ).toHaveCount(0);
});

test("CHK-02 P1 - e-mail e CEP inválidos não avançam do endereço", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  await page.getByTestId("open-cart-button").click();
  await page.getByTestId("checkout-button").click();

  const checkout = page.getByRole("dialog", { name: "Checkout" });
  await page.getByTestId("checkout-name-input").fill("QA Demo");
  await page.getByTestId("checkout-email-input").fill("invalid-email");
  await page.getByTestId("checkout-cep-input").fill("123");
  await page.getByTestId("checkout-street-input").fill("Test Street");
  await page.getByTestId("checkout-number-input").fill("10");
  await page.getByTestId("checkout-city-input").fill("Test City");
  await page.getByTestId("checkout-state-input").fill("SP");
  await page.getByTestId("checkout-address-continue").click();

  const emailIsInvalid = await checkout
    .getByTestId("checkout-email-input")
    .evaluate((input) => input.validity.typeMismatch);
  expect(emailIsInvalid).toBe(true);
  await expect(
    checkout.getByRole("heading", { name: "Where should we send it?" }),
  ).toBeVisible();

  await page
    .getByTestId("checkout-email-input")
    .fill("valid-checkout@example.test");
  const cepIsInvalid = await checkout
    .getByTestId("checkout-cep-input")
    .evaluate((input) => !input.validity.valid);
  expect(cepIsInvalid).toBe(true);
  await page.getByTestId("checkout-address-continue").click();
  await expect(
    checkout.getByRole("heading", { name: "Where should we send it?" }),
  ).toBeVisible();
  await expect(
    checkout.getByRole("heading", { name: "Shipping options" }),
  ).toHaveCount(0);
});

test("CHK-10 P1 - falha da API de frete mostra erro sem confirmar avanço", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  await page.getByTestId("open-cart-button").click();
  await page.getByTestId("checkout-button").click();

  const checkout = page.getByRole("dialog", { name: "Checkout" });
  await page.getByTestId("checkout-name-input").fill("QA Demo");
  await page
    .getByTestId("checkout-email-input")
    .fill("shipping-error@example.test");
  await page.getByTestId("checkout-cep-input").fill("01310000");
  await page.getByTestId("checkout-street-input").fill("Test Street");
  await page.getByTestId("checkout-number-input").fill("10");
  await page.getByTestId("checkout-city-input").fill("Test City");
  await page.getByTestId("checkout-state-input").fill("SP");
  await page.getByTestId("checkout-address-continue").click();

  await expect(checkout.getByRole("alert")).toContainText(
    "Shipping could not be calculated",
  );
  await expect(
    checkout.getByRole("heading", { name: "Where should we send it?" }),
  ).toBeVisible();
  await expect(
    checkout.getByRole("heading", { name: "Shipping options" }),
  ).toHaveCount(0);
  await expect(checkout).not.toContainText("Order confirmed");
});
