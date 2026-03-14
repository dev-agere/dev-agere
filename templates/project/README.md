# [Project Name]

> **Client:** [Client Name]
> **Status:** [Draft | In Progress | Delivered | Maintained]
> **Start Date:** YYYY-MM-DD

## Scope

Describe what this project delivers, key objectives, and success criteria.

- Objective 1
- Objective 2
- Out of scope: ...

## Architecture

High-level system design. Include key components, data flow, and integration points.

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  Input  │────▶│ Process │────▶│ Output  │
└─────────┘     └─────────┘     └─────────┘
```

### Tech Stack

- **Language:**
- **Framework:**
- **Infrastructure:**

### Key Decisions

| Decision | Rationale |
|----------|-----------|
|          |           |

## Setup

### Prerequisites

- Node.js >= 18 (or relevant runtime)
- API keys configured in `.env` (see `.env.example`)

### Installation

```bash
# Clone and install
cp .env.example .env
# Edit .env with your credentials
npm install
```

### Running Locally

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Deployment

### Environments

| Environment | URL | Notes |
|-------------|-----|-------|
| Development | localhost | Local dev |
| Staging     |     | Pre-production validation |
| Production  |     | Live |

### Deploy Steps

```bash
npm run build
# Deploy artifact to target environment
```

## Project Structure

```
src/           # Application source code
docs/          # Documentation and specs
tests/         # Test suites
.github/       # CI/CD configuration
```

## Contact

- **AI Enterprises Team:** [Founding Engineer]
- **Client Contact:** [Name / Channel]
