# Code Review System

This project is a minimal end-to-end implementation of a code review workflow.  
It focuses on **how review systems preserve context over time**, rather than on UI polish, automation, or feature count.

The goal of the project is to understand how real review systems model state, history, and feedback in a way that avoids ambiguity as code evolves.

---

## Motivation

While learning software engineering, I noticed that many projects emphasize features without addressing how teams actually reason about code changes and feedback.

Code review is fundamentally about **preserving meaning over time**:
- feedback should always refer to the exact version of code it was written for
- history should never be overwritten
- system state should be explicit, not implied

This project was built to explore those ideas from first principles.

---

## Core Workflow

The system models a simple but realistic review lifecycle:

1. An author creates a review session
2. The author submits code as immutable revisions
3. Reviewers add comments tied to specific revisions and optional line numbers
4. The author closes the session when review is complete
5. No further changes are allowed after closure

All actions are validated against explicit system state to prevent invalid transitions.

---

## Key Design Principles

### Immutability

Code is never updated in place.  
Each change creates a new revision that permanently preserves the previous state.

This ensures that comments and feedback always remain meaningful.

---

### Explicit State

Review sessions have a clearly defined lifecycle:
- open
- closed

All backend logic checks state explicitly before allowing mutations.  
The system does not rely on inferred intent or client assumptions.

---

### Contextual Feedback

Comments are attached to **revisions**, not sessions.  
This guarantees that feedback always refers to a specific snapshot of code.

Older comments are never moved or reinterpreted when new revisions are created.

---

### Clear Ownership

Users are modeled as a single entity.  
A user can act as an author or reviewer depending on context.

Ownership and relationships are always explicit through foreign keys.

---

## Technical Overview

- **Backend**: Node.js with Express
- **Database**: SQLite (relational schema, portable by design)
- **Frontend**: Minimal React application (Vite)
- **Architecture**: Monolithic, clarity-first design
- **State Management**: Enforced entirely by the backend

The frontend exists only to:
- exercise backend endpoints
- demonstrate the full review lifecycle
- display raw backend responses

It intentionally avoids abstraction, styling, and advanced UI logic.

---

## What This Project Demonstrates

- Designing state-driven backend systems
- Modeling immutable history correctly
- Using relational data to preserve context
- Enforcing business rules explicitly in code
- Connecting a minimal frontend to a validated backend
- Translating real-world workflows into schemas and APIs

---
## Docker Support

This project includes Docker configuration to define a reproducible runtime environment for both the backend and frontend.

Docker is used here as a **declarative specification** of how the system should be run, rather than as a deployment mechanism. This allows the system to be started consistently across different machines without relying on local setup assumptions.

### Structure

The system is split into two containers:

- Backend container  
  Runs the Node.js Express API and manages the SQLite database.  
  Exposes port 3000.

- Frontend container  
  Runs a minimal React application using Vite to exercise backend endpoints.  
  Exposes port 5173.

Each component has its own Dockerfile to keep responsibilities and lifecycles explicit.

### Docker Compose

A `docker-compose.yml` file defines how the frontend and backend run together and communicate over a shared network.

The frontend receives the backend API URL via environment variables, allowing the same codebase to work both inside and outside Docker without modification.

### Execution Notes

The Docker configuration is intentionally included even though it may not be executable in all development environments. Some platforms do not provide a Docker daemon.

In such cases, the Docker files serve as an explicit and portable definition of the system runtime rather than a required execution step.

### Running with Docker (locally)

On a machine with Docker installed, the full system can be started with:

docker-compose up --build

This will start both services and expose:
- frontend at http://localhost:5173
- backend at http://localhost:3000
Why this works:
- It explains Docker **without overclaiming**
- It clearly separates “configuration” from “execution”
- It shows you understand environment constraints

---

## Development Approach

The project was built incrementally, with frequent validation and iteration.

Mistakes were intentionally left visible during development, including:
- incorrect early schemas
- table and column mismatches
- async and SQL usage errors
- environment and deployment assumptions

Each mistake informed a clearer and more correct design.

A detailed explanation of these decisions and corrections is documented in `DESIGN.md`.

---

## Status

The core system is complete:
- review sessions
- immutable revisions
- revision-scoped comments
- explicit session closure
- minimal frontend to demonstrate system flow

The project is intentionally frozen at this stage to preserve clarity and correctness.

---

## Purpose

This repository represents a learning-focused system design exercise.  
It prioritizes understanding over completeness and correctness over scale.

The goal was not to build a production platform, but to deeply understand how one *should* be structured.