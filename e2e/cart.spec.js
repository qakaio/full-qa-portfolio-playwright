import { expect, test } from "@playwright/test";
import { addProductToBag, openCleanStore } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await openCleanStore(page);
});

test("CART-01 P1 - adding products updates quantity and subtotal", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  await addProductToBag(page, 3);
  await page.getByTestId("open-cart-button").click();

  const item = page.getByTestId("cart-item-3");
  await expect(item).toBeVisible();
  await expect(page.getByTestId("cart-count")).toHaveText("2");
  await expect(item).toContainText("2");
  await expect(page.getByTestId("cart-subtotal")).toContainText("37,00");

  await page.getByTestId("cart-item-increase-3").click();
  await expect(item).toContainText("3");
  await expect(page.getByTestId("cart-subtotal")).toContainText("55,50");
});

test("CART-02 P1 - limits quantity to ten units", async ({ page }) => {
  await addProductToBag(page, 3);
  await page.getByTestId("open-cart-button").click();

  const increase = page.getByTestId("cart-item-increase-3");
  for (let quantity = 1; quantity < 10; quantity += 1) {
    await increase.click();
  }

  await expect(page.getByTestId("cart-item-3")).toContainText("10");
  await expect(increase).toBeDisabled();
});

test("CART-03 P1 - preserves cart items and quantities after reload", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  await page.getByTestId("open-cart-button").click();
  await page.getByTestId("cart-item-increase-3").click();

  await page.reload();
  await page.getByTestId("open-cart-button").click();

  await expect(page.getByTestId("cart-item-3")).toContainText("2");
  await expect(page.getByTestId("cart-subtotal")).toContainText("37,00");
});

test("CART-04a P1 - removing the last item shows the empty cart state", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  await page.getByTestId("open-cart-button").click();
  await page.getByTestId("cart-item-remove-3").click();

  await expect(page.getByTestId("cart-item-3")).toHaveCount(0);
  await expect(page.getByText("Your bag is taking a break.")).toBeVisible();
});

test("CART-04b P1 - removing an item updates the subtotal and supports clearing the cart", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  await addProductToBag(page, 4);
  await page.getByTestId("open-cart-button").click();

  await page.getByTestId("cart-item-remove-3").click();
  await expect(page.getByTestId("cart-item-3")).toHaveCount(0);
  await expect(page.getByTestId("cart-subtotal")).toContainText("34,00");

  await page.getByTestId("cart-item-remove-4").click();
  await expect(page.getByText("Your bag is taking a break.")).toBeVisible();
});

test("CART-06 P2 - quantity limit respects available stock", async ({
  page,
}) => {
  await page.getByTestId("pagination-next").click();
  await expect(page.getByTestId("product-card-13")).toBeVisible();

  for (let quantity = 0; quantity < 3; quantity += 1) {
    await addProductToBag(page, 13);
  }
  await page.getByTestId("open-cart-button").click();

  await expect(page.getByTestId("cart-item-13")).toContainText("3");
  await expect(page.getByTestId("cart-item-increase-13")).toBeDisabled();
});

test("CART-05 P2 - recovers from invalid cart data in storage", async ({
  page,
}) => {
  await addProductToBag(page, 3);
  const cartKey = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((name) =>
      name.toLowerCase().includes("cart"),
    );
    if (key) {
      localStorage.setItem(key, "{invalid");
    }
    return key;
  });
  expect(cartKey).toBeTruthy();

  await page.reload();
  await page.getByTestId("open-cart-button").click();

  await expect(page.getByText("Your bag is taking a break.")).toBeVisible();
});
