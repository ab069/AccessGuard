# AccessGuard — IAM & PAM Platform

![Version](https://img.shields.io/badge/version-1.0.0-f59e0b) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-f59e0b) ![React](https://img.shields.io/badge/React-18.3-f59e0b) ![License](https://img.shields.io/badge/license-MIT-f59e0b)

AI-powered IAM security auditing & privileged access management (PAM) platform. Track identities, analyze permissions, detect anomalies, and monitor privileged access in real time.

## Quick Start

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) and register a new account.

## Features

- **Identity Management** — Track users, roles, sources (AWS IAM, Azure AD, Okta, GCP IAM), and departments
- **Privileged Access Monitoring** — Flag and monitor privileged/administrative identities with PAM controls
- **AI Anomaly Detection** — 8 rule-based detection engines covering off-hours access, privilege escalation, excessive permissions, stale accounts, impossible travel, unusual locations, service account abuse, lateral movement
- **Risk Scoring** — Auto-calculated risk scores (0-100) based on privilege level, alert history, and anomaly severity
- **Real-Time Alerts** — WebSocket-powered live access alert streaming with instant notifications
- **Multi-Source Support** — AWS IAM, Azure AD, Okta, GCP IAM identity providers

### Anomaly Detection Rules

| Rule | Trigger | Risk Impact |
|------|---------|-------------|
| Off-Hours Access | Access outside business hours (8 PM - 6 AM) | Medium |
| Privilege Escalation | Role/permission change to admin level | Critical |
| Excessive Permissions | User has 10+ permissions/roles | Medium |
| Stale Account | No activity for 90+ days | Low |
| Impossible Travel | Two logins from distant locations in <1 hour | Critical |
| Unusual Location | Login from previously unseen geo-region | High |
| Service Account Abuse | Service account used for interactive login | High |
| Lateral Movement | User accesses 5+ different resources in short span | High |

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      AccessGuard System                          │
├────────────┬────────────┬────────────┬────────────┬─────────────┤
│  Identity  │  Privilege │  Anomaly   │   Risk     │  WebSocket  │
│  Manager   │    Access  │  Detector  │  Scorer    │  Dashboard  │
├────────────┴────────────┴────────────┴────────────┴─────────────┤
│                FastAPI + async SQLAlchemy + Redis                  │
├─────────────────────────────────────────────────────────────────┤
│                  PostgreSQL + Redis + Docker Compose               │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy (async), asyncpg |
| Frontend | React 18, TypeScript, Vite, Zustand |
| Engine | IAM anomaly detection (8 rules) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Realtime | WebSockets |
| Infra | Docker, Docker Compose, nginx |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/identities` | Create identity entry |
| GET | `/api/identities` | List identities |
| GET | `/api/identities/stats` | Identity statistics |
| POST | `/api/events` | Log an access event |
| GET | `/api/alerts` | List anomaly alerts |
| GET | `/api/alerts/stats` | Alert statistics |
| PATCH | `/api/alerts/{id}/status` | Update alert status |
| WS | `/ws/{user_id}` | WebSocket real-time feed |
| GET | `/api/health` | Health check |

## Project Structure

```
AccessGuard/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, security, database, deps
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic layer
│   │   ├── agents/      # Anomaly detection engine
│   │   ├── api/         # Route handlers
│   │   └── main.py      # FastAPI app entrypoint
│   ├── tests/           # Pytest test suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── store/       # Zustand state stores
│   │   ├── hooks/       # React hooks (WebSocket)
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── main.tsx     # Entry point
│   │   └── App.tsx      # Router
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | PostgreSQL connection string |
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection string |
| `SECRET_KEY` | `change-me-in-production` | JWT signing key |

## Demo Credentials

Register a new account at `/register` after starting the app.

## License

MIT
