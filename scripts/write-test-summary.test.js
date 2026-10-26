const assert = require("node:assert/strict");
const test = require("node:test");
const { renderSummary, summarizeReport } = require("./write-test-summary");

function spec(title, projectName, expectedStatus, statuses) {
  return {
    title,
    tests: [
      {
        projectName,
        expectedStatus,
        results: statuses.map((status) => ({ status })),
      },
    ],
  };
}

test("summarizes browser results and classifies expected, flaky, and skipped cases", () => {
  const report = {
    suites: [
      {
        specs: [
          spec("pass", "chromium", "passed", ["passed"]),
          spec("expected failure", "chromium", "failed", ["failed"]),
          spec("expected timeout", "chromium", "failed", ["timedOut"]),
          spec("unexpected pass", "chromium", "failed", ["passed"]),
          spec("flaky retry", "firefox", "passed", ["failed", "passed"]),
          spec("failed", "firefox", "passed", ["timedOut"]),
          spec("skipped", "webkit", "passed", ["skipped"]),
          spec("not run", "webkit", "passed", []),
        ],
        suites: [
          {
            specs: [spec("nested pass", "webkit", "passed", ["passed"])],
          },
        ],
      },
    ],
  };

  const summary = summarizeReport(report);

  assert.deepEqual(summary.get("chromium"), {
    passed: 1,
    expectedFailures: 2,
    unexpectedPasses: 1,
    flaky: 0,
    skipped: 0,
    failed: 0,
  });
  assert.deepEqual(summary.get("firefox"), {
    passed: 0,
    expectedFailures: 0,
    unexpectedPasses: 0,
    flaky: 1,
    skipped: 0,
    failed: 1,
  });
  assert.deepEqual(summary.get("webkit"), {
    passed: 1,
    expectedFailures: 0,
    unexpectedPasses: 0,
    flaky: 0,
    skipped: 2,
    failed: 0,
  });
});

test("renders projects in stable alphabetical order with outcome totals", () => {
  const summary = renderSummary(
    new Map([
      [
        "webkit",
        {
          passed: 3,
          expectedFailures: 1,
          unexpectedPasses: 0,
          flaky: 0,
          skipped: 0,
          failed: 0,
        },
      ],
      [
        "chromium",
        {
          passed: 4,
          expectedFailures: 0,
          unexpectedPasses: 0,
          flaky: 1,
          skipped: 0,
          failed: 0,
        },
      ],
    ]),
  );

  assert.ok(summary.indexOf("| chromium |") < summary.indexOf("| webkit |"));
  assert.match(summary, /\| chromium \| 4 \| 0 \| 0 \| 1 \| 0 \| 0 \| 5 \|/);
  assert.match(summary, /\| webkit \| 3 \| 1 \| 0 \| 0 \| 0 \| 0 \| 4 \|/);
});
