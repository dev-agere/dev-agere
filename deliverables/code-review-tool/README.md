# Code Review Tool

AI-powered code review CLI that uses the Claude API to analyze code quality, find bugs, and suggest improvements.

## Setup

```bash
npm install
export ANTHROPIC_API_KEY=your-key-here
```

## Usage

Review a file:

```bash
npm run review -- src/app.js
```

Review a git diff:

```bash
git diff | npm run review -- --diff
```

Pipe a snippet with context:

```bash
cat handler.py | npm run review -- -c "FastAPI endpoint"
```

### Options

| Flag | Description |
|------|-------------|
| `--diff` | Treat input as a unified diff |
| `--context`, `-c` | Additional context about the code |
| `--json` | Output raw JSON instead of formatted text |
| `--model`, `-m` | Claude model (default: `claude-sonnet-4-20250514`) |
| `--help`, `-h` | Show help |

## Output

The tool returns structured feedback:

- **Score** (1-10) — overall code quality rating
- **Issues** — categorized as error, warning, or suggestion, with line numbers and fixes
- **Highlights** — things done well

Exit code is `1` if errors are found, `0` otherwise.

## Programmatic Usage

```js
import { reviewCode, formatReview } from "code-review-tool";

const review = await reviewCode("function add(a, b) { return a + b; }", {
  context: "JavaScript utility",
});

console.log(formatReview(review));
```

## Tests

```bash
npm test
```
