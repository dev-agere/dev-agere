import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert code reviewer. Analyze the provided code or diff and return a JSON object with this exact structure:

{
  "summary": "Brief overall assessment (1-2 sentences)",
  "issues": [
    {
      "severity": "error" | "warning" | "suggestion",
      "line": <line number or null if not applicable>,
      "message": "Description of the issue",
      "fix": "Suggested fix or null"
    }
  ],
  "score": <1-10 quality score>,
  "highlights": ["List of things done well (if any)"]
}

Rules:
- "error": bugs, security issues, crashes
- "warning": performance problems, bad practices, potential bugs
- "suggestion": style improvements, readability, minor enhancements
- Be specific and actionable in messages and fixes
- Return ONLY valid JSON, no markdown fences or extra text`;

/**
 * Review code using Claude API.
 * @param {string} input - Code snippet or diff to review
 * @param {object} [options]
 * @param {string} [options.context] - Optional context about the code (language, purpose)
 * @param {string} [options.model] - Claude model to use
 * @param {Anthropic} [options.client] - Pre-configured Anthropic client (for testing)
 * @returns {Promise<object>} Structured review feedback
 */
export async function reviewCode(input, options = {}) {
  const {
    context = "",
    model = "claude-sonnet-4-20250514",
    client: injectedClient,
  } = options;

  if (!input || !input.trim()) {
    throw new Error("No code input provided");
  }

  const client = injectedClient ?? new Anthropic();

  const userMessage = context
    ? `Context: ${context}\n\nCode to review:\n${input}`
    : `Code to review:\n${input}`;

  const response = await client.messages.create({
    model,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return parseReviewResponse(text);
}

/**
 * Parse the JSON response from Claude, handling minor formatting issues.
 */
export function parseReviewResponse(text) {
  // Strip markdown code fences if present
  const cleaned = text.replace(/^```(?:json)?\s*\n?/m, "").replace(/\n?```\s*$/m, "");

  try {
    const result = JSON.parse(cleaned);
    validateReviewShape(result);
    return result;
  } catch (err) {
    throw new Error(`Failed to parse review response: ${err.message}\nRaw: ${text.slice(0, 500)}`);
  }
}

function validateReviewShape(obj) {
  if (typeof obj.summary !== "string") throw new Error("Missing 'summary' string");
  if (!Array.isArray(obj.issues)) throw new Error("Missing 'issues' array");
  if (typeof obj.score !== "number" || obj.score < 1 || obj.score > 10)
    throw new Error("'score' must be a number 1-10");
  if (!Array.isArray(obj.highlights)) throw new Error("Missing 'highlights' array");

  for (const issue of obj.issues) {
    if (!["error", "warning", "suggestion"].includes(issue.severity))
      throw new Error(`Invalid severity: ${issue.severity}`);
    if (typeof issue.message !== "string") throw new Error("Issue missing 'message'");
  }
}
