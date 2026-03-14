import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseReviewResponse, reviewCode } from "../src/reviewer.js";

describe("parseReviewResponse", () => {
  const validReview = {
    summary: "Code looks good overall.",
    issues: [
      {
        severity: "warning",
        line: 5,
        message: "Unused variable 'x'",
        fix: "Remove the variable or use it.",
      },
    ],
    score: 7,
    highlights: ["Clean function naming"],
  };

  it("parses valid JSON", () => {
    const result = parseReviewResponse(JSON.stringify(validReview));
    assert.deepEqual(result, validReview);
  });

  it("strips markdown code fences", () => {
    const wrapped = "```json\n" + JSON.stringify(validReview) + "\n```";
    const result = parseReviewResponse(wrapped);
    assert.deepEqual(result, validReview);
  });

  it("throws on invalid JSON", () => {
    assert.throws(() => parseReviewResponse("not json"), /Failed to parse/);
  });

  it("throws when summary is missing", () => {
    const bad = JSON.stringify({ issues: [], score: 5, highlights: [] });
    assert.throws(() => parseReviewResponse(bad), /Missing 'summary'/);
  });

  it("throws when score is out of range", () => {
    const bad = JSON.stringify({
      summary: "ok",
      issues: [],
      score: 15,
      highlights: [],
    });
    assert.throws(() => parseReviewResponse(bad), /'score' must be/);
  });

  it("throws on invalid severity", () => {
    const bad = JSON.stringify({
      summary: "ok",
      issues: [{ severity: "critical", line: 1, message: "bad", fix: null }],
      score: 5,
      highlights: [],
    });
    assert.throws(() => parseReviewResponse(bad), /Invalid severity/);
  });
});

describe("reviewCode", () => {
  it("throws on empty input", async () => {
    await assert.rejects(() => reviewCode(""), /No code input/);
    await assert.rejects(() => reviewCode("   "), /No code input/);
  });

  it("calls Claude API and returns structured review", async () => {
    const mockReview = {
      summary: "Simple function, looks fine.",
      issues: [],
      score: 9,
      highlights: ["Concise implementation"],
    };

    // Mock Anthropic client
    const mockClient = {
      messages: {
        create: async () => ({
          content: [{ type: "text", text: JSON.stringify(mockReview) }],
        }),
      },
    };

    const result = await reviewCode("function add(a, b) { return a + b; }", {
      client: mockClient,
    });

    assert.deepEqual(result, mockReview);
  });

  it("passes context to the API", async () => {
    let capturedMessages;
    const mockClient = {
      messages: {
        create: async (params) => {
          capturedMessages = params.messages;
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  summary: "ok",
                  issues: [],
                  score: 8,
                  highlights: [],
                }),
              },
            ],
          };
        },
      },
    };

    await reviewCode("x = 1", { context: "Python script", client: mockClient });

    assert.ok(capturedMessages[0].content.includes("Python script"));
  });
});
