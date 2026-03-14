#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { reviewCode } from "./reviewer.js";
import { formatReview, formatJson } from "./formatter.js";

const HELP = `
Usage: code-review [options] [file]

AI-powered code review using Claude.

Arguments:
  file           File to review (reads from stdin if omitted)

Options:
  --diff         Treat input as a unified diff
  --context, -c  Additional context (e.g. "Python web API")
  --json         Output raw JSON instead of formatted text
  --model, -m    Claude model to use (default: claude-sonnet-4-20250514)
  --help, -h     Show this help message

Examples:
  code-review src/app.js
  git diff | code-review --diff
  cat snippet.py | code-review -c "FastAPI endpoint"
`.trim();

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(HELP);
    process.exit(0);
  }

  const opts = parseArgs(args);
  const input = await getInput(opts.file);

  if (!input.trim()) {
    console.error("Error: no input provided. Pass a file or pipe code via stdin.");
    process.exit(1);
  }

  const context = buildContext(opts);

  try {
    const review = await reviewCode(input, { context, model: opts.model });

    if (opts.json) {
      console.log(formatJson(review));
    } else {
      console.log(formatReview(review));
    }

    // Exit with non-zero if there are errors
    const hasErrors = review.issues.some((i) => i.severity === "error");
    process.exit(hasErrors ? 1 : 0);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(2);
  }
}

function parseArgs(args) {
  const opts = { file: null, diff: false, context: null, json: false, model: undefined };
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--diff") {
      opts.diff = true;
    } else if (arg === "--json") {
      opts.json = true;
    } else if (arg === "--context" || arg === "-c") {
      opts.context = args[++i];
    } else if (arg === "--model" || arg === "-m") {
      opts.model = args[++i];
    } else if (!arg.startsWith("-")) {
      positional.push(arg);
    }
  }

  opts.file = positional[0] || null;
  return opts;
}

function buildContext(opts) {
  const parts = [];
  if (opts.diff) parts.push("This is a unified diff.");
  if (opts.context) parts.push(opts.context);
  return parts.join(" ") || undefined;
}

async function getInput(filePath) {
  if (filePath) {
    return readFileSync(filePath, "utf-8");
  }

  // Read from stdin
  if (process.stdin.isTTY) {
    return "";
  }

  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

main();
