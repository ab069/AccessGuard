# AccessGuard

> AI-powered IAM security auditing & privileged access management (PAM) platform. Track identities, analyze permissions, detect anomalies, and monitor privileged access.

## Features

- **Identity Management** — Track users, roles, sources, and departments across IAM providers
- **Privileged Access Monitoring** — Flag and monitor privileged/administrative identities
- **AI Anomaly Detection** — 8 rule-based detection engines (off-hours access, escalation, excessive permissions, etc.)
- **Risk Scoring** — Auto-calculated risk scores based on privilege level and alert history
- **Real-Time Alerts** — WebSocket-powered live access alert streaming
- **Multi-Source Support** — AWS IAM, Azure AD, Okta, GCP IAM

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python 3.12 + async SQLAlchemy |
| Frontend | React 18 + TypeScript + Zustand |
| Engine | IAM anomaly detection rules |
| Database | PostgreSQL + Redis |
| Infra | Docker Compose |
| Auth | JWT + bcrypt |
| Realtime | WebSockets |

## Quick Start

```bash
git clone https://github.com/ab069/AccessGuard.git
cd AccessGuard; docker compose up -d; open http://localhost:3000
```

## License MIT
