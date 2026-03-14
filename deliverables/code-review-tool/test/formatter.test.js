import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatReview, formatJson } from "../src/formatter.js";

const sampleReview = {
  summary: "Decent code with a few issues.",
  issues: [
    { severity: "error", line: 10, message: "Null pointer dereference", fix: "Add null check" },
    { severity: "warning", line: null, message: "No error handling", fix: null },
    { severity: "suggestion", line: 3, message: "Use const instead of let", fix: "const x = 1" },
  ],
  score: 5,
  highlights: ["Good variable naming"],
};

describe("formatReview", () => {
  it("includes score", () => {
    const output = formatReview(sampleReview);
    assert.ok(output.includes("5/10"));
  });

  it("includes summary", () => {
    const output = formatReview(sampleReview);
    assert.ok(output.includes("Decent code with a few issues."));
  });

  it("includes all issue messages", () => {
    const output = formatReview(sampleReview);
    assert.ok(output.includes("Null pointer dereference"));
    assert.ok(output.includes("No error handling"));
    assert.ok(output.includes("Use const instead of let"));
  });

  it("includes highlights", () => {
    const output = formatReview(sampleReview);
    assert.ok(output.includes("Good variable naming"));
  });

  it("handles empty issues and highlights", () => {
    const minimal = { summary: "All good.", issues: [], score: 10, highlights: [] };
    const output = formatReview(minimal);
    assert.ok(output.includes("10/10"));
    assert.ok(output.includes("All good."));
  });
});

describe("formatJson", () => {
  it("returns valid JSON string", () => {
    const output = formatJson(sampleReview);
    const parsed = JSON.parse(output);
    assert.deepEqual(parsed, sampleReview);
  });
});
