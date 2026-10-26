const fs = require("node:fs");
const path = require("node:path");

function collectTests(suite, tests = []) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      tests.push({
        title: spec.title,
        project: test.projectName || "unknown",
        expectedStatus: test.expectedStatus,
        results: test.results || [],
      });
    }
  }

  for (const childSuite of suite.suites || []) {
    collectTests(childSuite, tests);
  }

  return tests;
}

function summarizeReport(report) {
  const projects = new Map();
  const tests = (report.suites || []).flatMap((suite) => collectTests(suite));

  for (const test of tests) {
    const project = projects.get(test.project) || {
      passed: 0,
      expectedFailures: 0,
      unexpectedPasses: 0,
      flaky: 0,
      skipped: 0,
      failed: 0,
    };
    const finalResult = test.results.at(-1);
    const hadFailedAttempt = test.results
      .slice(0, -1)
      .some(
        (result) => result.status === "failed" || result.status === "timedOut",
      );

    if (
      test.expectedStatus === "failed" &&
      ["failed", "timedOut"].includes(finalResult?.status)
    ) {
      project.expectedFailures += 1;
    } else if (
      test.expectedStatus === "failed" &&
      finalResult?.status === "passed"
    ) {
      project.unexpectedPasses += 1;
    } else if (finalResult?.status === "passed" && hadFailedAttempt) {
      project.flaky += 1;
    } else if (finalResult?.status === "passed") {
      project.passed += 1;
    } else if (!finalResult || finalResult.status === "skipped") {
      project.skipped += 1;
    } else {
      project.failed += 1;
    }

    projects.set(test.project, project);
  }

  return projects;
}

function renderSummary(projects) {
  const lines = [
    "## Playwright cross-browser results",
    "",
    "| Browser | Passed | Expected failures | Unexpected passes | Flaky | Failed | Skipped | Total |",
    "|---|---:|---:|---:|---:|---:|---:|---:|",
  ];

  for (const [name, counts] of [...projects.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    lines.push(
      `| ${name} | ${counts.passed} | ${counts.expectedFailures} | ${counts.unexpectedPasses} | ${counts.flaky} | ${counts.failed} | ${counts.skipped} | ${total} |`,
    );
  }

  return `${lines.join("\n")}\n`;
}

function writeSummary() {
  const reportPath = path.resolve("test-results/results.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const summary = renderSummary(summarizeReport(report));
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (summaryPath) {
    fs.appendFileSync(summaryPath, summary);
  } else {
    process.stdout.write(summary);
  }
}

if (require.main === module) {
  writeSummary();
}

module.exports = { renderSummary, summarizeReport, writeSummary };
