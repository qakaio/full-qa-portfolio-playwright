import { expect, test } from "@playwright/test";
import { openCleanStore } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await openCleanStore(page);
});

test("CON-01a P1 - required contact fields prevent empty submission", async ({
  page,
}) => {
  await page.getByTestId("contact-submit-button").click();

  const nameIsRequired = await page
    .getByTestId("contact-name-input")
    .evaluate((input) => input.validity.valueMissing);
  expect(nameIsRequired).toBe(true);
  await expect(
    page.getByText(
      "Thanks for reaching out. Your demo message was validated locally; no email was sent or stored.",
    ),
  ).toHaveCount(0);
});

test("CON-01b P1 - validates email format and minimum message length", async ({
  page,
}) => {
  await page.getByTestId("contact-name-input").fill("QA Tester");
  await page.getByTestId("contact-email-input").fill("invalid-email");
  await page.getByTestId("contact-subject-input").fill("Question");
  await page.getByTestId("contact-message-input").fill("Too short");
  await page.getByTestId("contact-submit-button").click();

  const emailIsInvalid = await page
    .getByTestId("contact-email-input")
    .evaluate((input) => input.validity.typeMismatch);
  const messageIsInvalid = await page
    .getByTestId("contact-message-input")
    .evaluate((input) => !input.validity.valid);
  expect(emailIsInvalid).toBe(true);
  expect(messageIsInvalid).toBe(true);
});

test("CON-02 P1 - valid contact message shows local confirmation without a request", async ({
  page,
}) => {
  const nonGetRequests = [];
  page.on("request", (request) => {
    if (request.method() !== "GET") {
      nonGetRequests.push(request.url());
    }
  });

  await page.getByTestId("contact-name-input").fill("QA Tester");
  await page.getByTestId("contact-email-input").fill("qa@example.test");
  await page.getByTestId("contact-subject-input").fill("Test question");
  await page
    .getByTestId("contact-message-input")
    .fill("This is a browser-only demo test message.");
  await page.getByTestId("contact-submit-button").click();

  await expect(
    page.getByRole("status").filter({
      hasText: "Your demo message was validated locally; no email was sent or stored.",
    }),
  ).toBeVisible();
  expect(nonGetRequests).toEqual([]);
});
