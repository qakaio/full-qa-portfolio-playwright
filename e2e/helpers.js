import { expect } from "@playwright/test";

export async function openCleanStore(page) {
  await page.goto("./");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await expect(page).toHaveTitle(/Rampz Store/);
}

export async function addProductToBag(page, productId) {
  await page.getByTestId(`add-to-cart-button-${productId}`).click();
}
