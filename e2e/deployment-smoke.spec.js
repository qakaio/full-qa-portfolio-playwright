import { expect, test } from "@playwright/test";

test("DEP-01 P1 - published page responds with Rampz Store HTML", async ({
  request,
}) => {
  const response = await request.get("./");
  const contentType = response.headers()["content-type"];
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(contentType).toContain("text/html");
  expect(body).toContain(
    "<title>Rampz Store | Lab essentials, made simple</title>",
  );
});

test("DEP-02 P1 - published CSS and JavaScript return the expected MIME types", async ({
  request,
}) => {
  const assets = [
    { path: "./styles.css", contentType: "text/css" },
    { path: "./app.js", contentType: "javascript" },
  ];

  for (const asset of assets) {
    const response = await request.get(asset.path);
    const contentType = response.headers()["content-type"] || "";

    expect(response.status(), asset.path).toBe(200);
    expect(contentType, asset.path).toContain(asset.contentType);
    expect(await response.text(), asset.path).not.toBe("");
  }
});
