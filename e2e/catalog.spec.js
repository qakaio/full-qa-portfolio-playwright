import { expect, test } from "@playwright/test";
import { openCleanStore } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await openCleanStore(page);
});

test("CAT-01 P1 - exibe produtos, categorias e paginação do catálogo", async ({
  page,
}) => {
  await expect(page.getByTestId("product-card-1")).toBeVisible();
  await expect(page.getByTestId("product-card-12")).toBeVisible();
  await expect(page.getByTestId("product-card-13")).toHaveCount(0);
  await expect(page.getByTestId("category-filter-glassware")).toContainText(
    "Glassware",
  );
  await expect(page.getByText(/Showing.*1–12.*20 products/)).toBeVisible();
});

test("CAT-02 P1 - busca sem diferenciar caixa e limpa estado vazio", async ({
  page,
}) => {
  const grid = page.getByTestId("product-grid");
  const search = page.getByTestId("search-input");

  await search.fill("bEaKeR");
  await expect(page.getByTestId("product-card-3")).toBeVisible();
  await expect(grid.locator("article")).toHaveCount(1);

  await search.fill("no-such-lab-product");
  await expect(page.getByTestId("empty-clear-filters-button")).toBeVisible();
  await page.getByTestId("empty-clear-filters-button").click();

  await expect(page.getByTestId("product-card-1")).toBeVisible();
  await expect(search).toHaveValue("");
});

test("CAT-03 P1 - combina categoria, preço, estoque e ordenação", async ({
  page,
}) => {
  await page.getByTestId("category-filter-equipment").click();
  await page.getByTestId("max-price-filter").fill("500");
  await page.getByRole("checkbox", { name: "In stock only" }).check({
    force: true,
  });
  await page
    .getByTestId("sort-products")
    .selectOption({ label: "Price: low to high" });

  const cards = page.getByTestId("product-grid").locator("article");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText("Laboratory Thermometer");
  await expect(cards.nth(1)).toContainText("Bunsen Burner");
  await expect(cards.nth(2)).toContainText("Precision Scale 0.01g");
});

test("CAT-04 P1 - limpar filtros restaura o catálogo após filtrar", async ({
  page,
}) => {
  await page.getByTestId("category-filter-equipment").click();
  await page.getByTestId("min-price-filter").fill("500");
  await expect(page.getByTestId("product-card-11")).toBeVisible();
  await expect(page.getByTestId("product-card-1")).toHaveCount(0);

  await page.getByTestId("clear-filters-button").click();

  await expect(page.getByTestId("product-card-1")).toBeVisible();
  await expect(page.getByTestId("category-filter-all")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByTestId("min-price-filter")).toHaveValue("");
});

test("CAT-05 P2 - limite de preço idêntico retorna apenas o preço correspondente", async ({
  page,
}) => {
  await page.getByTestId("min-price-filter").fill("18.5");
  await page.getByTestId("max-price-filter").fill("18.5");

  const cards = page.getByTestId("product-grid").locator("article");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Glass Beaker 250ml");
});

test("CAT-06 P2 - navega para a próxima página e retorna", async ({ page }) => {
  const grid = page.getByTestId("product-grid");

  await page.getByTestId("pagination-next").click();
  await expect(page.getByTestId("product-card-13")).toBeVisible();
  await expect(grid.locator("article")).toHaveCount(8);

  await page.getByTestId("pagination-previous").click();
  await expect(page.getByTestId("product-card-1")).toBeVisible();
  await expect(grid.locator("article")).toHaveCount(12);
});

test("CAT-08 P2 - fecha detalhes do produto com Escape e devolve o foco", async ({
  page,
}) => {
  const detailButton = page.getByRole("button", {
    name: "View details for Glass Beaker 250ml",
  });

  await detailButton.click();
  const dialog = page.getByRole("dialog", { name: "Glass Beaker 250ml" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Specifications" }),
  ).toBeVisible();
  await expect(dialog).toContainText("250 ml");
  await expect(dialog.getByRole("button", { name: "Add to bag" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(detailButton).toBeFocused();
});

test("CAT-08 P2 - fecha detalhes pelo botão de fechar", async ({ page }) => {
  await page.getByTestId("product-detail-3").click();
  const dialog = page.getByRole("dialog", { name: "Glass Beaker 250ml" });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: "Close product details" }).click();
  await expect(dialog).toBeHidden();
});

test("CAT-01b P1 - produto sem estoque não oferece ação de compra", async ({
  page,
}) => {
  const unavailableProduct = page.getByTestId("product-card-12");

  await expect(unavailableProduct).toContainText(/out of stock/i);
  await expect(unavailableProduct).toContainText("Unavailable");
  await expect(page.getByTestId("add-to-cart-button-12")).toHaveCount(0);
});
