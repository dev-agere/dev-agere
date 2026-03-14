const SEVERITY_COLORS = {
  error: "\x1b[31m",    // red
  warning: "\x1b[33m",  // yellow
  suggestion: "\x1b[36m", // cyan
};
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

const SEVERITY_ICONS = {
  error: "✗",
  warning: "⚠",
  suggestion: "→",
};

/**
 * Format a review result for terminal output.
 * @param {object} review - Structured review from reviewCode()
 * @returns {string} Formatted string for console output
 */
export function formatReview(review) {
  const lines = [];

  // Header
  lines.push(`${BOLD}Code Review — Score: ${scoreBar(review.score)}${RESET}`);
  lines.push(`${DIM}${review.summary}${RESET}`);
  lines.push("");

  // Issues grouped by severity
  for (const severity of ["error", "warning", "suggestion"]) {
    const group = review.issues.filter((i) => i.severity === severity);
    if (group.length === 0) continue;

    const color = SEVERITY_COLORS[severity];
    const icon = SEVERITY_ICONS[severity];

    for (const issue of group) {
      const loc = issue.line != null ? `:${issue.line}` : "";
      lines.push(`  ${color}${icon} ${severity.toUpperCase()}${loc}${RESET} ${issue.message}`);
      if (issue.fix) {
        lines.push(`    ${DIM}Fix: ${issue.fix}${RESET}`);
      }
    }
    lines.push("");
  }

  // Highlights
  if (review.highlights.length > 0) {
    lines.push(`${BOLD}Highlights:${RESET}`);
    for (const h of review.highlights) {
      lines.push(`  \x1b[32m✓${RESET} ${h}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

function scoreBar(score) {
  const filled = "█".repeat(score);
  const empty = "░".repeat(10 - score);
  const color = score >= 7 ? "\x1b[32m" : score >= 4 ? "\x1b[33m" : "\x1b[31m";
  return `${color}${filled}${empty}${RESET} ${score}/10`;
}

/**
 * Format a review result as plain JSON.
 */
export function formatJson(review) {
  return JSON.stringify(review, null, 2);
}
