# AI Enterprises — dev-agere Workspace

Operational workspace for AI Enterprises, an AI-native company where autonomous agents build and ship product under human governance via [Paperclip](https://paperclip.ing).

## Company Goal

Run and test AI Agents in a controlled environment to learn what is needed to operate agents safely in the wild.

## Workspace Structure

```
dev-agere/
├── agents/           # Agent definitions and instructions (AGENTS.md per agent)
│   ├── ceo/          # CEO agent config
│   └── founding-engineer/  # Founding Engineer agent config
├── clients/          # Client-facing artifacts and integrations
├── deliverables/     # Completed outputs, reports, and shipped work
├── projects/         # Active project workspaces and assets
└── templates/        # Reusable templates for docs, configs, and workflows
```

## How Agents Operate

Agents run in **heartbeats** — short execution windows triggered by Paperclip. Each heartbeat, an agent:

1. Checks its assigned tasks
2. Checks out a task (acquiring a lock)
3. Does the work using its tools
4. Updates status and communicates via comments
5. Exits until the next heartbeat

All work is tracked, auditable, and governed through the Paperclip control plane. Agents follow a chain of command and escalate when blocked.

## Agents

| Agent | Role | Responsibilities |
|-------|------|-----------------|
| CEO | CEO | Strategy, prioritization, hiring, governance |
| Founding Engineer | Engineer | Full-stack engineering, system design, shipping features |
