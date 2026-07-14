# Smartcomply Transaction Monitoring Platform

A production‑ready transaction monitoring system built with Python/Django, React/TypeScript, Redis Streams, and Docker.  
It evaluates every transaction against configurable rules, assigns risk scores, generates alerts, and provides a responsive dashboard.

**Repository:** [github.com/emmaoluga-sketch/Smartcomply-Transaction-Monitoring-Platform](https://github.com/emmaoluga-sketch/Smartcomply-Transaction-Monitoring-Platform.git)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Running Tests](#running-tests)
- [Design Decisions](#design-decisions)
- [Trade‑offs](#trade-offs)
- [Assumptions](#assumptions)
- [Bonus Features](#bonus-features)
- [Directory Structure](#directory-structure)

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   React     │────▶│  Django/DRF │────▶│  PostgreSQL 16   │
│  Frontend   │     │   Backend   │     └─────────────────┘
└─────────────┘     └──────┬──────┘
                           │             ┌─────────────────┐
                           └─────────────│  Redis 7 (Cache │
                           │             │  + Streams)     │
                           │             └────────┬────────┘
                           │                      │
                           ▼                      ▼
                    ┌─────────────┐     ┌─────────────────┐
                    │  Django     │     │   Worker        │
                    │  Event      │────▶│ (Async Event    │
                    │  Publisher  │     │  Processor)     │
                    └─────────────┘     └────────┬────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │   Rule Engine   │
                                        │ + SHA‑256 Hash  │
                                        └─────────────────┘
```

- **Backend:** Django REST Framework with JWT authentication, pagination, filtering, searching, sorting, API versioning, and OpenAPI/Swagger documentation.
- **Frontend:** React + TypeScript + Tailwind CSS – fully responsive, search, filters, pagination, loading & error states.
- **Event Bus:** Redis Streams – every new transaction publishes an event; a separate worker processes it asynchronously.
- **Rule Engine:** Pluggable class‑based rules evaluate each transaction; triggered rules generate alerts and increase the transaction’s risk score.
- **Containerization:** Docker Compose – start the whole stack with one command.

---

## Quick Start

### Prerequisites
- Docker & Docker Compose (latest versions)
- No other dependencies – everything runs inside containers.

### Setup
```bash
git clone https://github.com/emmaoluga-sketch/Smartcomply-Transaction-Monitoring-Platform.git
cd Smartcomply-Transaction-Monitoring-Platform

# (optional) copy the environment file – defaults work out of the box
cp backend/.env.example backend/.env

# Start everything
docker compose up -d
```

Access the frontend at **http://localhost:3000**  
Default credentials: `testuser` / `test123`

The API base URL is **http://localhost:8000/api/v1/**

---

## API Documentation

- **Swagger UI:** [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)  
- **ReDoc:** available via `/api/schema/`

### Key Endpoints
| Method   | Endpoint | Description |
|----------|----------|-------------|
| `POST`   | `/auth/login/` | Obtain JWT tokens |
| `GET`    | `/customers/` | List customers (paginated, filterable, searchable, sortable) |
| `POST`   | `/customers/` | Create a customer |
| `GET`    | `/transactions/` | List transactions |
| `POST`   | `/transactions/` | Create a transaction (publishes event) |
| `GET`    | `/transactions/{id}/` | Retrieve transaction details |
| `PATCH`  | `/transactions/{id}/update_status/` | Update transaction status |
| `GET`    | `/alerts/` | List all generated alerts |

All endpoints are versioned (`/api/v1/`), fully documented, and return standard HTTP status codes.

---

## Running Tests

```bash
docker compose exec backend pytest
```

The test suite covers:
- JWT authentication
- Transaction creation
- Rule engine triggers
- Integration tests for critical workflows

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Django + DRF** | Mature ecosystem, built‑in auth, pagination, filtering, and automatic Swagger generation. |
| **Redis Streams** | Persistent, lightweight, supports consumer groups – simpler than Kafka for this scale. |
| **Pluggable Rule Engine** | Class‑based rules; adding a new rule requires only a new class + registry append. |
| **React + TypeScript + Tailwind** | Type safety, rapid UI development, beautiful responsive design. |
| **Separate Worker** | Decouples event processing from the API, improving reliability and scalability. |
| **Docker Compose** | Single‑command setup, reproducible environment. |
| **Production‑Ready Features** | Structured JSON logging, Prometheus metrics, health checks, rate limiting, database indexing, CORS headers. |

---

## Trade‑offs

- **Redis Streams vs Kafka:** Redis is simpler to deploy and sufficient for current throughput. Kafka would be preferred for very high volumes or multi‑service fan‑out.
- **Frontend State Management:** Used React hooks + axios instead of Redux – lighter and sufficient for a dashboard of this size.
- **Rust Service:** Initially planned as a separate Rust micro‑service for SHA‑256 hashing. Due to container‑level compatibility, hashing is performed in the Python worker using `hashlib` (backed by OpenSSL). The Rust service Dockerfile and code are retained to demonstrate the intended architecture.

---

## Assumptions

- Single‑tenant application.
- Currency conversion is not required for rule evaluation.
- Redis is used as a single instance; a cluster would be recommended in production.
- Real‑time UI updates are not required (polling is acceptable).

---

## Bonus Features

All bonus items are implemented (configuration files / code provided).

| Bonus | Description | Location |
|-------|-------------|----------|
| **Performance‑critical processing** | SHA‑256 hashing of every transaction in the async worker. Rust service Dockerfile included. | `backend/apps/transactions/management/commands/process_events.py`<br>`rust-service/` |
| **Kubernetes manifests** | Deployments, services, configmaps for all components. | `k8s/` |
| **CI/CD pipeline** | GitHub Actions workflow that runs tests and builds the frontend. | `.github/workflows/ci.yml` |
| **Infrastructure as Code** | Terraform scripts to provision an EC2 instance with Docker. | `terraform/` |
| **Observability** | Prometheus metrics endpoint + Prometheus configuration file. Grafana dashboard can be added. | `prometheus/prometheus.yml`<br>`/metrics` endpoint |
| **AI‑assisted risk classification** | IsolationForest model (scikit‑learn) trained on transaction data; inference function ready. | `backend/apps/transactions/ml_risk.py` |

---

## Directory Structure (simplified)

```
smartcomply/
├── backend/               # Django API + worker + tests
│   ├── apps/
│   │   ├── accounts/      # JWT auth
│   │   ├── customers/     # Customer CRUD
│   │   ├── transactions/  # Transaction CRUD + events + ml_risk
│   │   ├── rules/         # Rule engine + alerts
│   │   └── audit/         # Audit logs
│   ├── config/            # Django settings, URLs, WSGI/ASGI
│   ├── tests/             # pytest tests
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/              # React + TypeScript dashboard
├── rust-service/          # Rust micro‑service (bonus)
├── k8s/                   # Kubernetes manifests (bonus)
├── terraform/             # IaC scripts (bonus)
├── .github/workflows/     # CI/CD pipeline (bonus)
├── prometheus/            # Observability config (bonus)
├── docker-compose.yml
└── README.md
```

---

## Contact / Support

**Author:** Oluga Emmanuel Abayomi
**Email:** abayo172000@gmail.com
**GitHub:** [github.com/emmaoluga-sketch](https://github.com/emmaoluga-sketch)

For any questions, please reach out via email or open an issue on the repository.